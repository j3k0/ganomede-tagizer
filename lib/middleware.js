// - read req.params.tag
// - load the user id from the ganomede-directory
// - store it into req.params.username
//
// in case of error, sets req.params.username = req.params.tag

const restify = require('restify');
const bunyan = require('bunyan');
const directory = require('ganomede-directory');
const tagFunction = require('./tag-function');

const saveAccount = (req, field, account) => {
  req.params = req.params || {};
  req.params.username = account.id;
  if (field !== 'params')
    req[field].username = account.id;
  req.params.user = req.params.user || {};
  req.params.user.username = account.id;
  if (account.aliases) {
    req.params.user.tag = account.aliases.tag
    req.params.user.name = account.aliases.name
    req.params.user.email = account.aliases.email
  }
}

const ENV_PREFIX = 'DIRECTORY_PORT_8000_TCP_';
const env = (suffix, defaultValue) =>
  (process.env[ENV_PREFIX + suffix] || defaultValue);

const createJsonClient = (args) =>
  restify.createJsonClient({
    url: urllib.format({
      protocol: args.protocol || env('PROTOCOL', 'http'),
      hostname: args.host || env('ADDR', '127.0.0.1'),
      port:     args.port || env('PORT', 8000),
      pathname: 'directory/v1'
    })
  });

const createDirectoryClient = (args) =>
  (args.force || process.env.TAG_MODE) && 
    directory.createClient({
      jsonClient: createJsonClient(args)
    })

const middleware = (field, subfield, directoryClient) => {

  const log = bunyan.createLogger({
    name: `tagizer.middleware(#{field}, #{subfield})`,
    level: process.env.LOG_LEVEL || 'info'
  });

  // directoryClient might just be create arguments
  if (!directoryClient || !directoryClient.byAlias)
    directoryClient = createDirectoryClient(directoryClient || {});

  return (req, res, next) => {

    if (!directoryClient) {
      req[field].username = req[field][subfield];
      return next();
    }

    const tag = req[field][subfield];
    const req_id = req.id()
    const value = tagFunction(tag);

    directoryClient.byAlias({
      type: "tag", value, req_id
    }, (err, account) => {

      if (err) {
        log.warn({err, tag, value, req_id},
          "directoryClient.byAlias failed");
        saveAccount(req, field, {id: tag});
      }
      else if (!account) {
        log.warn({tag, value, req_id},
          "directoryClient.byAlias returned no account");
        saveAccount(req, field, {id: tag});
      }
      else
        saveAccount(req, field, account);

      next()
    });
  };
};

module.exports = middleware;

const directory = require('ganomede-directory');

const ENV_PREFIX = 'DIRECTORY_PORT_8000_TCP_';
const env = (suffix, defaultValue) =>
  (process.env[ENV_PREFIX + suffix] || defaultValue);

const createJsonClient = (args) =>
  restify.createJsonClient({
    url: urllib.format({
      protocol: args.protocol || env('PROTOCOL', 'http'),
      hostname: args.host || env('ADDR', '127.0.0.1'),
      port:     +(args.port || env('PORT', 8000)),
      pathname: 'directory/v1'
    })
  });

const createDirectoryClient = (args) =>
  (args.force || process.env.TAG_MODE) && 
    (args.directory || directory).createClient({
      jsonClient: createJsonClient(args)
    });

module.exports = createDirectoryClient;

// - read req.params.tag
// - load the user id from the ganomede-directory
// - store it into req.params.username
//
// in case of error, sets req.params.username = req.params.tag

const restify = require('restify');
const directory = require('ganomede-directory');
const tagFunction = require('./tag-function');
const createDirectoryClient = require('./create-directory-client');
const saveAccountInRequest = require('./save-account-in-request');

const middleware = (field, subfield, directoryClient) => {

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
        req.log.warn({err, tag, value, req_id},
          "directoryClient.byAlias failed");
        saveAccountInRequest(req, field, {id: tag});
      }
      else if (!account) {
        req.log.warn({tag, value, req_id},
          "directoryClient.byAlias returned no account");
        saveAccountInRequest(req, field, {id: tag});
      }
      else
        saveAccountInRequest(req, field, account);

      next()
    });
  };
};

module.exports = middleware;

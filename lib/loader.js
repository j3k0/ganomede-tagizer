const createDirectoryClient = require('./create-directory-client');
const tagFunction = require('./tag-function');

module.exports = (directoryClient) => {

  // directoryClient might just be create arguments
  if (!directoryClient || !directoryClient.byAlias)
    directoryClient = createDirectoryClient(directoryClient || {});

  return (req, tag, callback) => {

    const identityCallback = () =>
      callback({
        username: tag,
        tag: tag,
        name: tag
      });

    if (!directoryClient)
      return identityCallback();

    const req_id = req.id()
    const value = tagFunction(tag);

    directoryClient.byAlias({
      type: "tag", value, req_id
    }, (err, account) => {

      if (err) {
        req.log.warn({err, tag, value, req_id},
          "directoryClient.byAlias failed");
        identityCallback();
      }
      else if (!account) {
        req.log.warn({tag, value, req_id},
          "directoryClient.byAlias returned no account");
        identityCallback();
      }
      else {
        callback({
          username: account.id,
          tag: account.aliases.tag,
          name: account.aliases.name
        });
      }
    });
  };
};

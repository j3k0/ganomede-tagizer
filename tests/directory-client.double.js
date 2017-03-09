const td = require('testdouble');

module.exports = ({username, name, tag, req_id}) => {

  const directoryClient = td.object(['byAlias']);

  td.when(directoryClient.byAlias(
    td.matchers.anything()))
    .thenCallback(new Error());

  td.when(directoryClient.byAlias(
    {type: 'tag', value: tag, req_id}))
    .thenCallback(null, {
      id: username,
      aliases: {
        tag: tag,
        name: name
      }
    });

  return directoryClient;
};

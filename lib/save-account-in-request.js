const saveAccountInRequest = (req, field, account) => {

  req.params = req.params || {};
  req.params.username = account.id;

  req.params.user = req.params.user || {};
  req.params.user.username = account.id;

  if (field !== 'params')
    req[field].username = account.id;

  if (account.aliases) {
    req.params.user.tag = account.aliases.tag
    req.params.user.name = account.aliases.name
    req.params.user.email = account.aliases.email
  }
};

module.exports = saveAccountInRequest;

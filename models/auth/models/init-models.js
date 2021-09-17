var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _account_access = require("./account_access");
var _account_banned = require("./account_banned");
var _account_muted = require("./account_muted");
var _autobroadcast = require("./autobroadcast");
var _build_info = require("./build_info");
var _ip_banned = require("./ip_banned");
var _logs = require("./logs");
var _logs_ip_actions = require("./logs_ip_actions");
var _realmcharacters = require("./realmcharacters");
var _realmlist = require("./realmlist");
var _reset = require("./reset");
var _secret_digest = require("./secret_digest");
var _updates = require("./updates");
var _updates_include = require("./updates_include");
var _uptime = require("./uptime");
var _user = require("./user");
var _version_db_auth = require("./version_db_auth");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var account_access = _account_access(sequelize, DataTypes);
  var account_banned = _account_banned(sequelize, DataTypes);
  var account_muted = _account_muted(sequelize, DataTypes);
  var autobroadcast = _autobroadcast(sequelize, DataTypes);
  var build_info = _build_info(sequelize, DataTypes);
  var ip_banned = _ip_banned(sequelize, DataTypes);
  var logs = _logs(sequelize, DataTypes);
  var logs_ip_actions = _logs_ip_actions(sequelize, DataTypes);
  var realmcharacters = _realmcharacters(sequelize, DataTypes);
  var realmlist = _realmlist(sequelize, DataTypes);
  var reset = _reset(sequelize, DataTypes);
  var secret_digest = _secret_digest(sequelize, DataTypes);
  var updates = _updates(sequelize, DataTypes);
  var updates_include = _updates_include(sequelize, DataTypes);
  var uptime = _uptime(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var version_db_auth = _version_db_auth(sequelize, DataTypes);

  user.belongsTo(account, { as: "account", foreignKey: "accountId"});
  account.hasMany(user, { as: "users", foreignKey: "accountId"});
  reset.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(reset, { as: "resets", foreignKey: "userId"});
  version_db_auth.belongsTo(version_db_auth, { as: "required_rev_version_db_auth", foreignKey: "required_rev"});
  version_db_auth.hasMany(version_db_auth, { as: "version_db_auths", foreignKey: "required_rev"});

  return {
    account,
    account_access,
    account_banned,
    account_muted,
    autobroadcast,
    build_info,
    ip_banned,
    logs,
    logs_ip_actions,
    realmcharacters,
    realmlist,
    reset,
    secret_digest,
    updates,
    updates_include,
    uptime,
    user,
    version_db_auth,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

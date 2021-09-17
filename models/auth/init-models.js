import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _account from  "./account.js";
import _account_access from  "./account_access.js";
import _account_banned from  "./account_banned.js";
import _account_muted from  "./account_muted.js";
import _autobroadcast from  "./autobroadcast.js";
import _build_info from  "./build_info.js";
import _ip_banned from  "./ip_banned.js";
import _logs from  "./logs.js";
import _logs_ip_actions from  "./logs_ip_actions.js";
import _realmcharacters from  "./realmcharacters.js";
import _realmlist from  "./realmlist.js";
import _reset from  "./reset.js";
import _secret_digest from  "./secret_digest.js";
import _updates from  "./updates.js";
import _updates_include from  "./updates_include.js";
import _uptime from  "./uptime.js";
import _user from  "./user.js";
import _version_db_auth from  "./version_db_auth.js";

export default function initModels(sequelize) {
  var account = _account.init(sequelize, DataTypes);
  var account_access = _account_access.init(sequelize, DataTypes);
  var account_banned = _account_banned.init(sequelize, DataTypes);
  var account_muted = _account_muted.init(sequelize, DataTypes);
  var autobroadcast = _autobroadcast.init(sequelize, DataTypes);
  var build_info = _build_info.init(sequelize, DataTypes);
  var ip_banned = _ip_banned.init(sequelize, DataTypes);
  var logs = _logs.init(sequelize, DataTypes);
  var logs_ip_actions = _logs_ip_actions.init(sequelize, DataTypes);
  var realmcharacters = _realmcharacters.init(sequelize, DataTypes);
  var realmlist = _realmlist.init(sequelize, DataTypes);
  var reset = _reset.init(sequelize, DataTypes);
  var secret_digest = _secret_digest.init(sequelize, DataTypes);
  var updates = _updates.init(sequelize, DataTypes);
  var updates_include = _updates_include.init(sequelize, DataTypes);
  var uptime = _uptime.init(sequelize, DataTypes);
  var user = _user.init(sequelize, DataTypes);
  var version_db_auth = _version_db_auth.init(sequelize, DataTypes);

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

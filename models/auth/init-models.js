import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _account from  "./account.js";
import _reset from  "./reset.js";
import _user from  "./user.js";

export default function initModels(sequelize) {
  var account = _account.init(sequelize, DataTypes);
  var reset = _reset.init(sequelize, DataTypes);
  var user = _user.init(sequelize, DataTypes);

  user.belongsTo(account, { as: "account", foreignKey: "accountId"});
  account.hasMany(user, { as: "users", foreignKey: "accountId"});
  reset.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(reset, { as: "resets", foreignKey: "userId"});

  return {
    account,
    reset,
    user,
  };
}

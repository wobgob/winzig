const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return account_access.init(sequelize, DataTypes);
}

class account_access extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    gmlevel: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    RealmID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      primaryKey: true
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'account_access',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "RealmID" },
        ]
      },
    ]
  });
  return account_access;
  }
}

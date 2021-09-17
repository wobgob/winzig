const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return account_muted.init(sequelize, DataTypes);
}

class account_muted extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    mutedate: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    mutetime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    mutedby: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mutereason: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'account_muted',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "mutedate" },
        ]
      },
    ]
  });
  return account_muted;
  }
}

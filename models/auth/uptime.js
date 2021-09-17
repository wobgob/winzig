import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class uptime extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    realmid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    starttime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    uptime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    maxplayers: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    revision: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "AzerothCore"
    }
  }, {
    sequelize,
    tableName: 'uptime',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "realmid" },
          { name: "starttime" },
        ]
      },
    ]
  });
  return uptime;
  }
}

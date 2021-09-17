import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class realmlist extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      unique: "idx_name"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "127.0.0.1"
    },
    localAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "127.0.0.1"
    },
    localSubnetMask: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "255.255.255.0"
    },
    port: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 8085
    },
    icon: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    flag: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 2
    },
    timezone: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    allowedSecurityLevel: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    population: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    gamebuild: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 12340
    }
  }, {
    sequelize,
    tableName: 'realmlist',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  return realmlist;
  }
}

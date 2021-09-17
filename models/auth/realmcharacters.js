import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class realmcharacters extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    realmid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    acctid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    numchars: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'realmcharacters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "realmid" },
          { name: "acctid" },
        ]
      },
      {
        name: "acctid",
        using: "BTREE",
        fields: [
          { name: "acctid" },
        ]
      },
    ]
  });
  return realmcharacters;
  }
}

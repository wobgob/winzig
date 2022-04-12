import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class faction_change extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    account: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "Account Identifier"
    }
  }, {
    sequelize,
    tableName: 'faction_change',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
        ]
      },
      {
        name: "idx_account",
        using: "BTREE",
        fields: [
          { name: "account" },
        ]
      }
    ]
  });
  return faction_change;
  }
}
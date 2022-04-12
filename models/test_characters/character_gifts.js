import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_gifts extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    item_guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    entry: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    flags: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'character_gifts',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "item_guid" },
        ]
      },
      {
        name: "idx_guid",
        using: "BTREE",
        fields: [
          { name: "guid" },
        ]
      },
    ]
  });
  return character_gifts;
  }
}

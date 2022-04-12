import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_inventory extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "Global Unique Identifier"
    },
    bag: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    slot: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    item: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Item Global Unique Identifier"
    }
  }, {
    sequelize,
    tableName: 'character_inventory',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "item" },
        ]
      },
      {
        name: "guid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "bag" },
          { name: "slot" },
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
  return character_inventory;
  }
}

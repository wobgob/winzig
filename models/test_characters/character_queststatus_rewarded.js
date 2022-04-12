import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_queststatus_rewarded extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    quest: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Quest Identifier"
    },
    active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'character_queststatus_rewarded',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "quest" },
        ]
      },
    ]
  });
  return character_queststatus_rewarded;
  }
}

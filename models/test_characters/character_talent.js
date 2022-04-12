import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_talent extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    spell: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    specMask: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'character_talent',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "spell" },
        ]
      },
    ]
  });
  return character_talent;
  }
}

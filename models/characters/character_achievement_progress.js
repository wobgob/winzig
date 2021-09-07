import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_achievement_progress extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    criteria: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    counter: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    date: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'character_achievement_progress',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "criteria" },
        ]
      },
    ]
  });
  return character_achievement_progress;
  }
}

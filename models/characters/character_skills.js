import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_skills extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    skill: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    max: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'character_skills',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "skill" },
        ]
      },
    ]
  });
  return character_skills;
  }
}

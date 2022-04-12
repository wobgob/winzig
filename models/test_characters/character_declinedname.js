import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_declinedname extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    genitive: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    dative: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    accusative: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    instrumental: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    },
    prepositional: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'character_declinedname',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
        ]
      },
    ]
  });
  return character_declinedname;
  }
}

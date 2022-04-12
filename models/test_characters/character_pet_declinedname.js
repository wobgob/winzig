import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_pet_declinedname extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    owner: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    genitive: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    dative: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    accusative: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    instrumental: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    prepositional: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'character_pet_declinedname',
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
        name: "owner_key",
        using: "BTREE",
        fields: [
          { name: "owner" },
        ]
      },
    ]
  });
  return character_pet_declinedname;
  }
}

import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class character_aura extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    casterGuid: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Full Global Unique Identifier"
    },
    itemGuid: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    spell: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    effectMask: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    recalculateMask: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    stackCount: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    amount0: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amount1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amount2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    base_amount0: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    base_amount1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    base_amount2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    maxDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    remainTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    remainCharges: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'character_aura',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "casterGuid" },
          { name: "itemGuid" },
          { name: "spell" },
          { name: "effectMask" },
        ]
      },
    ]
  });
  return character_aura;
  }
}

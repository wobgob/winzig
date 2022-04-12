import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class pet_aura extends Model {
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
      type: DataTypes.MEDIUMINT,
      allowNull: false
    },
    amount1: {
      type: DataTypes.MEDIUMINT,
      allowNull: false
    },
    amount2: {
      type: DataTypes.MEDIUMINT,
      allowNull: false
    },
    base_amount0: {
      type: DataTypes.MEDIUMINT,
      allowNull: false
    },
    base_amount1: {
      type: DataTypes.MEDIUMINT,
      allowNull: false
    },
    base_amount2: {
      type: DataTypes.MEDIUMINT,
      allowNull: false
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
    tableName: 'pet_aura',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
          { name: "casterGuid" },
          { name: "spell" },
          { name: "effectMask" },
        ]
      },
    ]
  });
  return pet_aura;
  }
}

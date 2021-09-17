import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class autobroadcast extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    realmid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
      primaryKey: true
    },
    id: {
      autoIncrement: true,
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    weight: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: 1
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'autobroadcast',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "realmid" },
        ]
      },
    ]
  });
  return autobroadcast;
  }
}

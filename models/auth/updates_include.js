import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class updates_include extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    path: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: true,
      comment: "directory to include. $ means relative to the source directory."
    },
    state: {
      type: DataTypes.ENUM('RELEASED','ARCHIVED','CUSTOM'),
      allowNull: false,
      defaultValue: "RELEASED",
      comment: "defines if the directory contains released or archived updates."
    }
  }, {
    sequelize,
    tableName: 'updates_include',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "path" },
        ]
      },
    ]
  });
  return updates_include;
  }
}

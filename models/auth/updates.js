import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class updates extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      primaryKey: true,
      comment: "filename with extension of the update."
    },
    hash: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      defaultValue: "",
      comment: "sha1 hash of the sql file."
    },
    state: {
      type: DataTypes.ENUM('RELEASED','ARCHIVED','CUSTOM'),
      allowNull: false,
      defaultValue: "RELEASED",
      comment: "defines if an update is released or archived."
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "timestamp when the query was applied."
    },
    speed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "time the query takes to apply in ms."
    }
  }, {
    sequelize,
    tableName: 'updates',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  return updates;
  }
}

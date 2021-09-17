import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class version_db_auth extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    sql_rev: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    required_rev: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'version_db_auth',
        key: 'sql_rev'
      }
    },
    date: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    '2021_06_17_00': {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'version_db_auth',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sql_rev" },
        ]
      },
      {
        name: "required",
        using: "BTREE",
        fields: [
          { name: "required_rev" },
        ]
      },
    ]
  });
  return version_db_auth;
  }
}

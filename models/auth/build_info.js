import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class build_info extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    build: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    majorVersion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minorVersion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bugfixVersion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hotfixVersion: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    winAuthSeed: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    win64AuthSeed: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    mac64AuthSeed: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    winChecksumSeed: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    macChecksumSeed: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'build_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "build" },
        ]
      },
    ]
  });
  return build_info;
  }
}

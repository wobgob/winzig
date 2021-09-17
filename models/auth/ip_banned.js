import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ip_banned extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    ip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "127.0.0.1",
      primaryKey: true
    },
    bandate: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    unbandate: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    bannedby: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "[Console]"
    },
    banreason: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "no reason"
    }
  }, {
    sequelize,
    tableName: 'ip_banned',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ip" },
          { name: "bandate" },
        ]
      },
    ]
  });
  return ip_banned;
  }
}

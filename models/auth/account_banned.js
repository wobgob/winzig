import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class account_banned extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Account id"
    },
    bandate: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    unbandate: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    bannedby: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    banreason: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'account_banned',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "bandate" },
        ]
      },
    ]
  });
  return account_banned;
  }
}

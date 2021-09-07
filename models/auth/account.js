import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class account extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "Identifier"
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      unique: "idx_username"
    },
    salt: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    verifier: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    session_key: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    totp_secret: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    reg_mail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    joindate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_ip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "127.0.0.1"
    },
    last_attempt_ip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "127.0.0.1"
    },
    failed_logins: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    locked: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    lock_country: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: "00"
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    online: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    expansion: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 2
    },
    mutetime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    mutereason: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    muteby: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    locale: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    os: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: ""
    },
    recruiter: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    totaltime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'account',
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
        name: "idx_username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
  return account;
  }
}

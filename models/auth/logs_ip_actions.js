import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class logs_ip_actions extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "Unique Identifier"
    },
    account_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "Account ID"
    },
    character_guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "Character Guid"
    },
    type: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "127.0.0.1"
    },
    systemnote: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes inserted by system"
    },
    unixtime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "Unixtime"
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "Timestamp"
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Allows users to add a comment"
    }
  }, {
    sequelize,
    tableName: 'logs_ip_actions',
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
    ]
  });
  return logs_ip_actions;
  }
}

import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class mail_items extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    mail_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    item_guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    receiver: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "Character Global Unique Identifier"
    }
  }, {
    sequelize,
    tableName: 'mail_items',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "item_guid" },
        ]
      },
      {
        name: "idx_receiver",
        using: "BTREE",
        fields: [
          { name: "receiver" },
        ]
      },
      {
        name: "idx_mail_id",
        using: "BTREE",
        fields: [
          { name: "mail_id" },
        ]
      },
    ]
  });
  return mail_items;
  }
}

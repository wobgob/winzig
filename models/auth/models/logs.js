const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return logs.init(sequelize, DataTypes);
}

class logs extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    realm: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    level: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    string: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'logs',
    timestamps: false
  });
  return logs;
  }
}

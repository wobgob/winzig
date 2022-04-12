import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class characters extends Model {
  static init(sequelize, DataTypes) {
  super.init({
    guid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Global Unique Identifier"
    },
    account: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "Account Identifier"
    },
    name: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    race: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    class: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    gender: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    level: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    xp: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    money: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    skin: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    face: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    hairStyle: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    hairColor: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    facialStyle: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    bankSlots: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    restState: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    playerFlags: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    position_x: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    position_y: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    position_z: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    map: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "Map Identifier"
    },
    instance_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    instance_mode_mask: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    orientation: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    taximask: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    online: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    cinematic: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    totaltime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    leveltime: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    logout_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    is_logout_resting: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    rest_bonus: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    resettalents_cost: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    resettalents_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    trans_x: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    trans_y: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    trans_z: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    trans_o: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    transguid: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
      defaultValue: 0
    },
    extra_flags: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    stable_slots: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    at_login: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    zone: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    death_expire_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    taxi_path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    arenaPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    totalHonorPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    todayHonorPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    yesterdayHonorPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    totalKills: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    todayKills: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    yesterdayKills: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    chosenTitle: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    knownCurrencies: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    watchedFaction: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    drunk: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    health: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power1: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power2: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power3: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power4: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power5: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power6: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    power7: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    latency: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    talentGroupsCount: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    activeTalentGroup: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    exploredZones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    equipmentCache: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ammoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    knownTitles: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    actionBars: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    grantableLevels: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    order: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleteInfos_Account: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    deleteInfos_Name: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    deleteDate: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'characters',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "guid" },
        ]
      },
      {
        name: "idx_account",
        using: "BTREE",
        fields: [
          { name: "account" },
        ]
      },
      {
        name: "idx_online",
        using: "BTREE",
        fields: [
          { name: "online" },
        ]
      },
      {
        name: "idx_name",
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  return characters;
  }
}

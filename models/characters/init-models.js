import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _character_account_data from  "./character_account_data.js";
import _character_achievement from  "./character_achievement.js";
import _character_achievement_progress from  "./character_achievement_progress.js";
import _character_action from  "./character_action.js";
import _character_aura from  "./character_aura.js";
import _character_declinedname from  "./character_declinedname.js";
import _character_equipmentsets from  "./character_equipmentsets.js";
import _character_gifts from  "./character_gifts.js";
import _character_glyphs from  "./character_glyphs.js";
import _character_homebind from  "./character_homebind.js";
import _character_inventory from  "./character_inventory.js";
import _character_pet from  "./character_pet.js";
import _character_pet_declinedname from  "./character_pet_declinedname.js";
import _character_queststatus from  "./character_queststatus.js";
import _character_queststatus_rewarded from  "./character_queststatus_rewarded.js";
import _character_reputation from  "./character_reputation.js";
import _character_skills from  "./character_skills.js";
import _character_spell from  "./character_spell.js";
import _character_spell_cooldown from  "./character_spell_cooldown.js";
import _character_talent from  "./character_talent.js";
import _characters from  "./characters.js";
import _faction_change from "./faction_change.js"
import _item_instance from  "./item_instance.js";
import _mail from  "./mail.js";
import _mail_items from  "./mail_items.js";
import _pet_aura from  "./pet_aura.js";
import _pet_spell from  "./pet_spell.js";
import _pet_spell_cooldown from  "./pet_spell_cooldown.js";

export default function initModels(sequelize) {
  var character_account_data = _character_account_data.init(sequelize, DataTypes);
  var character_achievement = _character_achievement.init(sequelize, DataTypes);
  var character_achievement_progress = _character_achievement_progress.init(sequelize, DataTypes);
  var character_action = _character_action.init(sequelize, DataTypes);
  var character_aura = _character_aura.init(sequelize, DataTypes);
  var character_declinedname = _character_declinedname.init(sequelize, DataTypes);
  var character_equipmentsets = _character_equipmentsets.init(sequelize, DataTypes);
  var character_gifts = _character_gifts.init(sequelize, DataTypes);
  var character_glyphs = _character_glyphs.init(sequelize, DataTypes);
  var character_homebind = _character_homebind.init(sequelize, DataTypes);
  var character_inventory = _character_inventory.init(sequelize, DataTypes);
  var character_pet = _character_pet.init(sequelize, DataTypes);
  var character_pet_declinedname = _character_pet_declinedname.init(sequelize, DataTypes);
  var character_queststatus = _character_queststatus.init(sequelize, DataTypes);
  var character_queststatus_rewarded = _character_queststatus_rewarded.init(sequelize, DataTypes);
  var character_reputation = _character_reputation.init(sequelize, DataTypes);
  var character_skills = _character_skills.init(sequelize, DataTypes);
  var character_spell = _character_spell.init(sequelize, DataTypes);
  var character_spell_cooldown = _character_spell_cooldown.init(sequelize, DataTypes);
  var character_talent = _character_talent.init(sequelize, DataTypes);
  var characters = _characters.init(sequelize, DataTypes);
  var faction_change = _faction_change.init(sequelize, DataTypes);
  var item_instance = _item_instance.init(sequelize, DataTypes);
  var mail = _mail.init(sequelize, DataTypes);
  var mail_items = _mail_items.init(sequelize, DataTypes);
  var pet_aura = _pet_aura.init(sequelize, DataTypes);
  var pet_spell = _pet_spell.init(sequelize, DataTypes);
  var pet_spell_cooldown = _pet_spell_cooldown.init(sequelize, DataTypes);


  return {
    character_account_data,
    character_achievement,
    character_achievement_progress,
    character_action,
    character_aura,
    character_declinedname,
    character_equipmentsets,
    character_gifts,
    character_glyphs,
    character_homebind,
    character_inventory,
    character_pet,
    character_pet_declinedname,
    character_queststatus,
    character_queststatus_rewarded,
    character_reputation,
    character_skills,
    character_spell,
    character_spell_cooldown,
    character_talent,
    characters,
    faction_change,
    item_instance,
    mail,
    mail_items,
    pet_aura,
    pet_spell,
    pet_spell_cooldown,
  };
}

import Sequelize from 'sequelize'
import { CharactersDb } from '../../db.js'

const { DataTypes, Model } = Sequelize;
const sequelize = CharactersDb;

export class Characters extends Model {}
Characters.init({
    guid: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
    },
	account: {
		type: DataTypes.INTEGER.UNSIGNED,
	},
	name: {
		type: DataTypes.STRING(12)
	},
	atLogin: {
		type: DataTypes.SMALLINT.UNSIGNED,
		field: 'at_login'
	}
}, {
	sequelize,
	modelName: 'characters',
	tableName: 'characters',
	timestamps: false
})

export class CharacterAccountData extends Model {}
CharacterAccountData.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_account_data',
	tableName: 'character_account_data',
	timestamps: false
})

export class CharacterAchievement extends Model {}
CharacterAchievement.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_achievement',
	tableName: 'character_achievement',
	timestamps: false
})

export class CharacterAchievementProgress extends Model {}
CharacterAchievementProgress.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_achievement_progress',
	tableName: 'character_achievement_progress',
	timestamps: false
})

export class CharacterAction extends Model {}
CharacterAction.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_action',
	tableName: 'character_action',
	timestamps: false
})

export class CharacterAura extends Model {}
CharacterAura.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_aura',
	tableName: 'character_aura',
	timestamps: false
})

export class CharacterDeclinedName extends Model {}
CharacterDeclinedName.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_declinedname',
	tableName: 'character_declinedname',
	timestamps: false
})

export class CharacterEquipmentSets extends Model {}
CharacterEquipmentSets.init({
	guid: {
		type: DataTypes.INTEGER
	},
	// SELECT MAX(setguid) FROM character_equipmentsets;
	setguid: {
		type: DataTypes.BIGINT,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_equipmentsets',
	tableName: 'character_equipmentsets',
	timestamps: false
})

export class CharacterGlyphs extends Model {}
CharacterGlyphs.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_glyphs',
	tableName: 'character_glyphs',
	timestamps: false
})

export class CharacterHomebind extends Model {}
CharacterHomebind.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_homebind',
	tableName: 'character_homebind',
	timestamps: false
})

export class CharacterInventory extends Model {}
CharacterInventory.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		unique: true
	},
	// See item_instance.guid.
	item: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_inventory',
	tableName: 'character_inventory',
	timestamps: false
})

export class CharacterPet extends Model {}
CharacterPet.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	},
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		field: 'owner'
	}
}, {
	sequelize,
	modelName: 'character_pet',
	tableName: 'character_pet',
	timestamps: false
})

export class CharacterPetDeclinedName extends Model {}
CharacterPetDeclinedName.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	},
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		field: 'owner'
	}
}, {
	sequelize,
	modelName: 'character_pet_declinedname',
	tableName: 'character_pet_declinedname',
	timestamps: false
})

export class CharacterQuestStatus extends Model {}
CharacterQuestStatus.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_queststatus',
	tableName: 'character_queststatus',
	timestamps: false
})

export class CharacterQuestStatusRewarded extends Model {}
CharacterQuestStatusRewarded.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_queststatus_rewarded',
	tableName: 'character_queststatus_rewarded',
	timestamps: false
})

export class CharacterReputation extends Model {}
CharacterReputation.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_reputation',
	tableName: 'character_reputation',
	timestamps: false
})

export class CharacterSkills extends Model {}
CharacterSkills.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_skills',
	tableName: 'character_skills',
	timestamps: false
})

export class CharacterSpell extends Model {}
CharacterSpell.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_spell',
	tableName: 'character_spell',
	timestamps: false
})

export class CharacterSpellCooldown extends Model {}
CharacterSpellCooldown.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_spell_cooldown',
	tableName: 'character_spell_cooldown',
	timestamps: false
})

export class CharacterTalent extends Model {}
CharacterTalent.init({
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	}
}, {
	sequelize,
	modelName: 'character_talent',
	tableName: 'character_talent',
	timestamps: false
})

export class Mail extends Model {}
Mail.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true
	},
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		field: 'receiver'
	}
}, {
	sequelize,
	modelName: 'mail',
	tableName: 'mail',
	timestamps: false
})

// Must be after `mail`.
export class MailItems extends Model {}
MailItems.init({
	itemGuid: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		field: 'item_guid'
	},
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		field: 'receiver'
	},
	mailId: {
		type: DataTypes.INTEGER.UNSIGNED,
		field: 'mail_id'
	}
}, {
	sequelize,
	modelName: 'mail_items',
	tableName: 'mail_items',
	timestamps: false
})

// Must be after character_pet.
export class PetAura extends Model {}
PetAura.init({
	// See character_pet.id.
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		field: 'guid'
	}
}, {
	sequelize,
	modelName: 'pet_aura',
	tableName: 'pet_aura',
	timestamps: false
})

// Must be after character_pet.
export class PetSpell extends Model {}
PetSpell.init({
	// See character_pet.id.
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		field: 'guid'
	}
}, {
	sequelize,
	modelName: 'pet_spell',
	tableName: 'pet_spell',
	timestamps: false
})

// Must be after character_pet.
export class PetSpellCooldown extends Model {}
PetSpellCooldown.init({
	// See character_pet.id.
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		field: 'guid'
	}
}, {
	sequelize,
	modelName: 'pet_spell_cooldown',
	tableName: 'pet_spell_cooldown',
	timestamps: false
})

// Must be after character_inventory and mail_items.
export class ItemInstance extends Model {}
ItemInstance.init({
	// See item_instance.id
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		field: 'guid'
	},
	guid: {
		type: DataTypes.INTEGER.UNSIGNED,
		field: 'owner_guid'
	}
}, {
	sequelize,
	modelName: 'item_instance',
	tableName: 'item_instance',
	timestamps: false
})

// Must be after item_instance.
export class CharacterGifts extends Model {}
CharacterGifts.init({
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		primaryKey: true,
		field: 'item_guid'
	},
	guid: {
		type: DataTypes.INTEGER.UNSIGNED
	}
}, {
	sequelize,
	modelName: 'character_gifts',
	tableName: 'character_gifts',
	timestamps: false
})
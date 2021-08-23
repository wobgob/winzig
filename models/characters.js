import Sequelize from 'sequelize'
import { CharactersDb } from '../db.js'

const { DataTypes, Model } = Sequelize;
const sequelize = CharactersDb;

export class Characters extends Model {}
Characters.init({
    guid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
	account: {
		type: DataTypes.INTEGER,
		unique: true
	},
	name: {
		type: DataTypes.STRING(12)
	},
	atLogin: {
		type: DataTypes.SMALLINT,
		unique: true,
		field: 'at_login'
	}
}, {
	sequelize,
	modelName: 'characters',
	tableName: 'characters',
	timestamps: false
})

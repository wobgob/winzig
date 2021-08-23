import Sequelize from 'sequelize'
import { AuthDb } from '../db.js'

const { DataTypes, Model } = Sequelize;
const sequelize = AuthDb;

export class Account extends Model {}
Account.init({
	username: {
		type: DataTypes.STRING(32)
	},
	salt: {
		type: DataTypes.STRING(32, true)
	},
	verifier: {
		type: DataTypes.STRING(32, true)
	},
    online: {
        type: DataTypes.INTEGER,
        unique: true
    }
}, {
	sequelize,
	modelName: 'account',
	tableName: 'account',
	timestamps: false
})
import Sequelize from 'sequelize'
import { AuthDb } from '../../db.js'
import { Account } from './account.js'

const { DataTypes, Model } = Sequelize;
const sequelize = AuthDb;

export class User extends Model {}
User.init({
	userId: {
		type: DataTypes.STRING
	}
}, {
	sequelize,
	modelName: 'user',
	tableName: 'user',
	timestamps: false
})

User.Account = User.belongsTo(Account, {
	foreignKey: {
		type: DataTypes.INTEGER.UNSIGNED
	}
})
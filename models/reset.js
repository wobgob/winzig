import Sequelize from 'sequelize'
import { AuthDb } from '../db.js'
import { User } from './user.js'

const { DataTypes, Model } = Sequelize;
const sequelize = AuthDb;

export class Reset extends Model {}
Reset.init({
	code: {
		type: DataTypes.STRING(6)
	}
},{
	sequelize,
	modelName: 'reset',
	tableName: 'reset'
})

Reset.User = Reset.belongsTo(User)
import Sequelize from 'sequelize'
import config from './config.js'

export const AuthDb = new Sequelize(config.DATABASES.AUTH)
export const TestCharactersDb = new Sequelize(config.DATABASES.TEST_CHARACTERS)
export const CharactersDb = new Sequelize(config.DATABASES.CHARACTERS)

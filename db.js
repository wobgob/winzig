import Sequelize from 'sequelize'
import config from './config.js'

export const AuthDb = new Sequelize(config.DISCORD_BOT_DB + '/acore_auth')
export const CharactersDb = new Sequelize(config.DISCORD_BOT_DB + '/acore_characters')
export const TestCharactersDb = new Sequelize(config.DISCORD_BOT_DB + '/' + config.REALMS.TEST.CHARACTERS)
import Sequelize from 'sequelize'
import config from './config.js'

export const AuthDb = new Sequelize(config.DISCORD_BOT_DB + '/' + config.REALMS.AUTH)
export const CharactersDb = new Sequelize(config.DISCORD_BOT_DB + '/' + config.REALMS.LIVE.CHARACTERS)

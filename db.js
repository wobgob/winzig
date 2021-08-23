import Sequelize from 'sequelize'

export const AuthDb = new Sequelize(process.env.DISCORD_BOT_DB + '/acore_auth')
export const CharactersDb = new Sequelize(process.env.DISCORD_BOT_DB + '/acore_characters')
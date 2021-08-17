import { Client, Intents } from 'discord.js'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import { InteractionResponseType, Routes } from 'discord-api-types/v9'
import Sequelize from 'sequelize'
import { makeRegistrationData } from './srp.js'

const { DataTypes, Model } = Sequelize

const maxAccountStr = 20
const nameTooLong = `Account name can't be longer than ${maxAccountStr} characters, account not created!`
const maxPassStr = 16
const passTooLong = `Account password can't be longer than ${maxPassStr} characters, account not created!`
const nameAlreadyExists = 'Account with this name already exists!'

const token = process.env.DISCORD_BOT_TOKEN
const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_GUILD_ID
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const rest = new REST({ version: '9' }).setToken(token)
const sequelize = new Sequelize('acore_auth', 'acore', 'acore', {
	host: 'localhost',
	dialect: 'mysql'
})

class Account extends Model {}
Account.init({
	username: {
		type: DataTypes.STRING(32)
	},
	salt: {
		type: DataTypes.STRING(32, true)
	},
	verifier: {
		type: DataTypes.STRING(32, true)
	}
}, {
	sequelize,
	modelName: 'account',
	tableName: 'account',
	timestamps: false
})

class User extends Model {}
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

try {
	await sequelize.authenticate()
	console.log('Connection has been established successfully.')
} catch (error) {
	console.error('Unable to connect to the database:', error)
}

client.once('ready', () => {
	console.log('Ready!')
})

const account = new SlashCommandBuilder()
	.setName('account')
	.setDescription('Manage your account')
	.addSubcommand(subcommand =>
		subcommand
			.setName('create')
			.setDescription('Create an account')
			.addStringOption(option => option.setName('username').setDescription('Enter your username').setRequired(true))
			.addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true)))
const commands = [account];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return

	if (interaction.commandName === 'account') {
		if (interaction.options.getSubcommand() === 'create') {
			let username = interaction.options.getString('username')
			let password = interaction.options.getString('password')
			let I = username.toUpperCase()
			let P = password.toUpperCase()
			let userId = interaction.member.user.id;

			if (username.length > maxAccountStr) {
				interaction.reply({ content: nameTooLong, ephemeral: true})
				return
			}

			if (password.length > maxPassStr) {
				interaction.reply({ content: passTooLong, ephemeral: true})
				return
			}

			let account = await Account.findOne({ where: { username: I }})
			if (account !== null) {
				interaction.reply({ content: nameAlreadyExists, ephemeral: true})
				return
			}

			let [salt, verifier] = makeRegistrationData(I, P)

			account = Account.build({
				username: I,
				salt: salt,
				verifier: verifier
			})
			await account.save()
			console.log(account.toJSON())

			await User.sync()
			let user = await User.findOne({ where: { userId: userId }})
			if (user !== null) {
				user.accountId = account.id
			} else {
				user = User.build({
					userId: userId,
					accountId: account.id
				})
			}
			await user.save()
			console.log(user.toJSON())

			interaction.reply({ content: `Account created: ${username}`, ephemeral: true })
		}
	}
})

client.login(token)
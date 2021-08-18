import { Client, Intents } from 'discord.js'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import { InteractionResponseType, Routes } from 'discord-api-types/v9'
import Sequelize from 'sequelize'
import { calculateVerifier, makeRegistrationData } from './srp.js'

const { DataTypes, Model } = Sequelize;

const maxAccountStr = 20
const nameTooLong = `Account name can't be longer than ${maxAccountStr} characters, account not created!`
const maxPassStr = 16
const passTooLong = `Account password can't be longer than ${maxPassStr} characters, account not created!`
const nameAlreadyExists = 'Account with this name already exists!'
const accountExists = 'You already have an account'
const passwordDoesntMatch = 'Password doesn\'t match!'
const wrongPassword = 'Wrong password!'
const passwordChanged = 'Password changed.'

const token = process.env.DISCORD_BOT_TOKEN
const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_GUILD_ID
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const rest = new REST({ version: '9' }).setToken(token)
const sequelize = new Sequelize(process.env.DISCORD_BOT_DB)

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
			.setDescription('Create account and set password to it.')
			.addStringOption(option => option.setName('username').setDescription('Enter your username').setRequired(true))
			.addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('password')
			.setDescription('Change your account password.')
			.addStringOption(option => option.setName('old').setDescription('Enter your old password').setRequired(true))
			.addStringOption(option => option.setName('new').setDescription('Enter your new password').setRequired(true))
			.addStringOption(option => option.setName('again').setDescription('Enter your new password again').setRequired(true)))
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

client.on('ready', async () => {
	await User.sync()
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

			let user = await User.findOne({ where: { userId: userId }})
			if (user !== null && user.accountId !== null) {
				interaction.reply({ content: accountExists, ephemeral: true })
				return
			}

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
		} else if (interaction.options.getSubcommand() === 'password') {
			let user = await User.findOne({ where: { userId: interaction.member.user.id }})
			let account = await Account.findByPk(user.accountId)
			let oldPassword = interaction.options.getString('old')
			let newPassword = interaction.options.getString('new')
			let againPassword = interaction.options.getString('again')
			let checkVerifier = calculateVerifier(account.username.toUpperCase(), oldPassword.toUpperCase(), account.salt)

			if (!checkVerifier.equals(account.verifier)) {
				interaction.reply({ content: wrongPassword, ephemeral: true })
				return
			}

			if (newPassword !== againPassword) {
				interaction.reply({ content: passwordDoesntMatch, ephemeral: true })
				return
			}

			let I = account.username.toUpperCase()
			let P = newPassword.toUpperCase()
			let [salt, verifier] = makeRegistrationData(I, P)

			account.salt = salt
			account.verifier = verifier
			await account.save()
			console.log(account.toJSON())
			interaction.reply({ content: passwordChanged, ephemeral: true })
		}
	}
})

client.login(token)
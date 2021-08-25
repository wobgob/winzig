import { Client, Intents } from 'discord.js'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Routes } from 'discord-api-types/v9'
import Email from 'email-templates'
import sequelize from 'sequelize'
import nodemailer from 'nodemailer'
import { makeRegistrationData } from './srp.js'
import { AtLoginFlags } from './character-tools.js'
import { Account } from './models/account.js'
import { User } from './models/user.js'
import { Reset } from './models/reset.js'
import { Characters } from './models/characters.js'
import { AuthDb, CharactersDb } from './db.js'
import config from './config.js'

const { Op } = sequelize

const maxAccountStr = 20
const nameTooLong = `Account name can't be longer than ${maxAccountStr} characters, account not created!`
const maxPassStr = 16
const passTooLong = `Account password can't be longer than ${maxPassStr} characters, account not created!`
const nameAlreadyExists = 'Account with this name already exists!'
const accountExists = 'You already have an account.'
const passwordDoesntMatch = 'Password doesn\'t match!'
const wrongCode = 'Wrong code!'
const passwordChanged = 'Password changed.'
const characterDoesntExist = 'Character does not exist!'
const createAccount = 'Please create an account.'
const flagged = 'Character flagged for customisation.'
const nameTaken = 'Name already taken.'
const accountNotFound = 'Account not found!'
const logoff = 'You must logoff before performing this action.'
const invalidEmail = 'Enter a valid email address.'
const emailSent = 'Email sent! If you do not receive it check your junk folder.'
const emailNotSent = `Email not sent! Contact a ${config.COMPANY} staff member.`
const tooSoon = 'You must wait 5 minutes between reset attempts.'
const resetInactive = 'No password reset in progress.'

const token = config.DISCORD_BOT_TOKEN
const clientId = config.DISCORD_CLIENT_ID
const guildId = config.DISCORD_GUILD_ID
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const rest = new REST({ version: '9' }).setToken(token)

try {
	await AuthDb.authenticate()
	await CharactersDb.authenticate()
	console.log('Connection has been established successfully.')
} catch (error) {
	console.error('Unable to connect to the database:', error)
}

client.once('ready', () => {
	console.log('Ready!')
})

const account = new SlashCommandBuilder()
	.setName('account')
	.setDescription('Manage your account.')
	.addSubcommand(subcommand =>
		subcommand
			.setName('create')
			.setDescription('Create account and set a password to it.')
			.addStringOption(option => option.setName('username').setDescription('Enter your username').setRequired(true))
			.addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('password')
			.setDescription('Change your account password.')
			.addStringOption(option => option.setName('code').setDescription('Enter your code').setRequired(true))
			.addStringOption(option => option.setName('password').setDescription('Enter your new password').setRequired(true))
			.addStringOption(option => option.setName('again').setDescription('Enter your new password again').setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('reset')
			.setDescription('Reset your password.')
			.addStringOption(option => option.setName('email').setDescription('Enter your email address').setRequired(true)))
const character = new SlashCommandBuilder()
	.setName('services')
	.setDescription('Character services.')
	.addSubcommand(subcommand =>
		subcommand
			.setName('name-change')
			.setDescription('Change a character\'s name.')
			.addStringOption(option => option.setName('old').setDescription('Enter your old character name').setRequired(true))
			.addStringOption(option => option.setName('new').setDescription('Enter your new character name').setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('race-change')
			.setDescription('Change a character\'s race (within your current faction).')
			.addStringOption(option => option.setName('name').setDescription('Enter your character\'s name').setRequired(true)))
	.addSubcommand(subcommand =>
		subcommand
			.setName('faction-change')
			.setDescription('Change a character\'s faction (Horde to Alliance or Alliance to Horde).')
			.addStringOption(option => option.setName('name').setDescription('Enter your character\'s name').setRequired(true)))
const commands = [account, character];

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
	await Reset.sync()
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
			interaction.reply({ content: `Account created: ${username}.`, ephemeral: true })
		} else if (interaction.options.getSubcommand() === 'password') {
			let user = await User.findOne({ where: { userId: interaction.member.user.id }})
			let account = await Account.findByPk(user.accountId)
			let reset = await Reset.findOne({ where: { userId: user.id }})
			let code = interaction.options.getString('code')
			let newPassword = interaction.options.getString('password')
			let againPassword = interaction.options.getString('again')

			if (reset === null || reset.updatedAt < (new Date() - 60 * 60 * 1000)) {
				interaction.reply({ content: resetInactive, ephemeral: true })
				return
			}

			if (reset.code !== code) {
				interaction.reply({ content: wrongCode, ephemeral: true })
				return
			}

			if (newPassword.length > maxPassStr) {
				interaction.reply({ content: passTooLong, ephemeral: true})
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
		} else if (interaction.options.getSubcommand() === 'reset') {
			let address = interaction.options.getString('email')
			let validEmail = (email) => {
				const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(email).toLowerCase());
			}

			if (!validEmail(address)) {
				interaction.reply({ content: invalidEmail, ephemeral: true })
				return
			}

			let userId = interaction.member.user.id
			let user = await User.findOne({ where: { userId: userId }})

			if (user === null || user.accountId === null) {
				interaction.reply({ content: createAccount, ephemeral: true })
				return
			}

			let reset = await Reset.findOne({
				where: {
					userId: user.id,
				}
			})

			if (reset !== null && reset.updatedAt > (new Date() - 5 * 60 * 1000)) {
				interaction.reply({ content: tooSoon, ephemeral: true })
				return
			}
			
			let transport = nodemailer.createTransport({
				host: config.SMTP_HOST,
				port: 587,
				secure: false,
				auth: {
					user: config.SMTP_USER,
					pass: config.SMTP_PASS
				}
			})

			let email = new Email({
				message: {
					from: config.EMAIL_ADDRESS
				},
				send: true,
				transport: transport
			})

			let code = Math.random().toString(10).slice(2, 8)
			let account = await Account.findByPk(user.accountId)

			email.send({
				template: 'reset',
				message: {
					to: address
				},
				locals: {
					name: account.username,
					company: config.COMPANY,
					website: config.WEBSITE,
					code: code
				}
			}).then(console.log).catch((err) => {
				console.error(err)
				interaction.reply({ content: emailNotSent, ephemeral: true })
				return
			})
			
			if (reset === null) {
				reset = Reset.build({
					code: code,
					userId: user.id,
				})
			} else {
				reset.code = code
			}
			await reset.save()

			interaction.reply({ content: emailSent, ephemeral: true })
		}
	}

	if (interaction.commandName === 'services') {
		let subcommand = interaction.options.getSubcommand()

		if (subcommand == 'name-change') {
			let userId = interaction.member.user.id;
			let user = await User.findOne({ where: { userId: userId }})

			if (user === null || user.accountId === null) {
				interaction.reply({ content: createAccount, ephemeral: true })
				return
			}

			let account = await Account.findByPk(user.accountId)

			if (account === null) {
				interaction.reply({ content: accountNotFound, ephemeral: true })
				return
			}

			if (account.online !== 0) {
				interaction.reply({ content: logoff, ephemeral: true })
				return
			}

			let oldName = interaction.options.getString('old')
			let character = await Characters.findOne({ where: { name: oldName }})

			if (character === null || character.account !== user.accountId) {
				interaction.reply({ content: characterDoesntExist, ephemeral: true })
				return
			}

			let newName = interaction.options.getString('new')
			let other = await Characters.findOne({ where: {name: newName }})

			if (other !== null) {
				interaction.reply({ content: nameTaken, ephemeral: true })
				return
			}

			character.name = newName;
			await character.save()
			console.log(character.toJSON())
			interaction.reply({ content: `Name changed: ${newName}.`, ephemeral: true })
		}

		let isFlag = (subcommand) => {
			return subcommand == 'race-change' || subcommand == 'faction-change'
		}

		if (isFlag(subcommand)) {
			let userId = interaction.member.user.id;
			let user = await User.findOne({ where: { userId: userId }})

			if (user === null) {
				interaction.reply({ content: createAccount, ephemeral: true })
				return
			}

			let account = await Account.findByPk(user.accountId)

			if (account === null) {
				interaction.reply({ content: accountNotFound, ephemeral: true })
				return
			}

			if (account.online !== 0) {
				interaction.reply({ content: logoff, ephemeral: true })
				return
			}

			let name = interaction.options.getString('name')
			let character = await Characters.findOne({ where: { name: name }})

			if (character === null || character.account !== user.accountId) {
				interaction.reply({ content: characterDoesntExist, ephemeral: true })
				return
			}

			if (subcommand == 'race-change') {
				character.atLogin = AtLoginFlags.AT_LOGIN_CHANGE_RACE;
			} else if (subcommand == 'faction-change') {
				character.atLogin = AtLoginFlags.AT_LOGIN_CHANGE_FACTION;
			}

			await character.save()
			console.log(character.toJSON());
			interaction.reply({ content: flagged, ephemeral: true })
		}
	}
})

client.login(token)
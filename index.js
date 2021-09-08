import { Client, Intents } from 'discord.js'
import { REST } from '@discordjs/rest'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Routes } from 'discord-api-types/v9'
import Email from 'email-templates'
import sequelize, { Sequelize } from 'sequelize'
import nodemailer from 'nodemailer'
import { makeRegistrationData } from './srp.js'
import { AtLoginFlags } from './character-tools.js'
import initAuth from './models/auth/init-models.js'
import initCharacters from './models/characters/init-models.js'
import { AuthDb, CharactersDb, TestCharactersDb } from './db.js'
import config from './config.js'

const { Op } = sequelize

const live = {
	auth: initAuth(AuthDb),
	characters: initCharacters(CharactersDb)
}
const test = {
	characters: initCharacters(TestCharactersDb)
}

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
const copyError = 'We could not complete the character copy.'
const copySuccess = 'We have completed the character copy.'

const token = config.DISCORD_BOT_TOKEN
const clientId = config.DISCORD_CLIENT_ID
const guildId = config.DISCORD_GUILD_ID
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const rest = new REST({ version: '9' }).setToken(token)

const CharTable = [
	'character_account_data', 'character_achievement',
	'character_achievement_progress', 'character_action', 'character_aura',
	'character_declinedname', 'character_glyphs', 'character_homebind',
	'character_queststatus', 'character_queststatus_rewarded',
	'character_reputation', 'character_skills', 'character_spell',
	'character_spell_cooldown', 'character_talent'
]
const EqSetTable = ['character_equipmentsets']
const Inventory = ['character_inventory']
const Pet = ['character_pet', 'character_pet_declinedname']
const Mail = ['mail']
const MailItems = ['mail_items']
const PetTable = ['pet_aura', 'pet_spell', 'pet_spell_cooldown']
const Item = ['item_instance']
const ItemGift = ['character_gifts']

try {
	await AuthDb.authenticate()
	await CharactersDb.authenticate()
	await TestCharactersDb.authenticate()

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
			.setName('customise')
			.setDescription('Change a character\'s appearance or gender.')
			.addStringOption(option => option.setName('name').setDescription('Enter your character\'s name').setRequired(true)))
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
const copy = new SlashCommandBuilder()
	.setName('copy')
	.setDescription('Copy a character to the live realm.')
	.setDefaultPermission(false)
	.addIntegerOption(option => option.setName('account-id').setDescription('Enter the account ID').setRequired(true))
	.addStringOption(option => option.setName('name').setDescription('Enter the character name').setRequired(true))
const commands = [account, character, copy];

const ROLE = 1
const permissions = {
	permissions: [
		{
			id: `${config.ROLES.INNKEEPER}`,
			type: ROLE,
			permission: true,
		}
	]
};

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    )

	let cmds = await rest.get(
	  Routes.applicationGuildCommands(clientId, guildId)
	)

	let cmd = cmds.find(c => c.name === 'copy')

	await rest.put(
		Routes.applicationCommandPermissions(clientId, guildId, cmd.id),
		{ body: permissions }
	)

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

client.on('ready', async () => {
	await live.auth.user.sync()
	await live.auth.reset.sync()
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

			let user = await live.auth.user.findOne({ where: { userId: userId }})
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

			let account = await live.auth.account.findOne({ where: { username: I }})
			if (account !== null) {
				interaction.reply({ content: nameAlreadyExists, ephemeral: true})
				return
			}

			let [salt, verifier] = makeRegistrationData(I, P)

			account = live.auth.account.build({
				username: I,
				salt: salt,
				verifier: verifier
			})
			await account.save()
			console.log(account.toJSON())

			if (user !== null) {
				user.accountId = account.id
			} else {
				user = live.auth.user.build({
					userId: userId,
					accountId: account.id
				})
			}
			await user.save()
			console.log(user.toJSON())
			interaction.reply({ content: `Account created: ${username}.`, ephemeral: true })
		} else if (interaction.options.getSubcommand() === 'password') {
			let user = await live.auth.user.findOne({ where: { userId: interaction.member.user.id }})
			let account = await live.auth.account.findByPk(user.accountId)
			let reset = await live.auth.reset.findOne({ where: { userId: user.id }})
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
			let user = await live.auth.user.findOne({ where: { userId: userId }})

			if (user === null || user.accountId === null) {
				interaction.reply({ content: createAccount, ephemeral: true })
				return
			}

			let reset = await live.auth.reset.findOne({ where: { userId: user.id, }})

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
				reset = live.auth.reset.build({
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

	if (interaction.commandName === 'copy') {
		let accountId = interaction.options.getInteger('account-id')
		let account = await live.auth.account.findByPk(accountId)

		if (account === null) {
			interaction.reply({ content: accountNotFound, ephemeral: true })
			return
		}

		if (account.online !== 0) {
			interaction.reply({ content: logoff, ephemeral: true })
			return
		}

		let toTitleCase = phrase => {
			return phrase
				.toLowerCase()
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
		}
		let name = toTitleCase(interaction.options.getString('name'))
		let character = await test.characters.characters.findOne({
			where: { name: name },
			raw: true
		})

		if (character === null || character.account !== accountId) {
			interaction.reply({ content: characterDoesntExist, ephemeral: true })
			return
		}

		try {
			await CharactersDb.transaction(async (t) => {
				let itemInstances = []
				let guid = await live.characters.characters.max('guid', { transaction: t }) + 1
				let copy = Object.assign({}, character)

				copy.guid = guid
				await live.characters.characters.create(copy, { transaction: t })

				for (let table of CharTable) {
					let row = await test.characters[table].findOne({
						where: { guid: character.guid },
						raw: true
					})

					if (row !== null) {
						row.guid = guid
						await live.characters[table].create(row, { transaction: t})
					}
				}

				for (let table of EqSetTable) {
					let rows = await test.characters[table].findAll({
						where: { guid: character.guid },
						raw: true
					})

					for (let row of rows) {
						row.guid = guid
						row.setguid = await live.characters.character_equipmentsets.max('setguid', { transaction: t }) + 1
						await live.characters[table].create(row, { transaction: t })
					}
				}

				for (let table of Inventory) {
					let rows = await test.characters[table].findAll({
						where: { guid: character.guid },
						order: [['bag', 'ASC']],
						raw: true
					})

					let prev = 0
					let bag = 0
					for (let row of rows) {
						if (prev != row.bag) {
							prev = row.bag
							bag = await live.characters[table].max('bag', { transaction: t }) + 1
						}

						let item = await test.characters.item_instance.findByPk(row.item, { raw: true })
						let itemGuid = await live.characters.item_instance.max('guid', { transaction: t }) + 1
						itemInstances.push(itemGuid)

						item.guid = itemGuid
						item.owner_guid = guid
						await live.characters.item_instance.create(item, { transaction: t })

						row.guid = guid
						row.bag = bag
						row.item = itemGuid
						await live.characters[table].create(row, { transaction: t })
					}
				}

				for (let table of ItemGift) {
					let rows = await test.characters[table].findAll({
						where: { guid: character.guid },
						raw: true
					})

					for (let row of rows) {
						let item = await test.characters.item_instance.findByPk(row.item)
						let itemGuid = await live.characters.item_instance.max('guid', { transaction: t }) + 1
						itemInstances.push(itemGuid)

						item.guid = itemGuid
						item.owner_guid = guid
						await live.characters.item_instance.create(item, { transaction: t })

						row.guid = guid
						row.item_id = itemGuid
						await live.characters[table].create(row, { transaction: t })
					}
				}

				for (let table of Pet) {
					let rows = await test.characters[table].findAll({
						where: { owner: character.guid },
						raw: true
					})

					for (let row of rows) {
						row.id = await live.characters[table].max('id', { transaction: t }) + 1
						row.owner = guid
						await live.characters[table].create(row, { transaction: t })

						for (let table of PetTable) {
							let pet = await test.characters[table].findAll({
								where: { id: row.id },
								raw: true
							})

							for (let p of pet) {
								p.id = row.id
								await live.characters[table].create(p, { transaction: t })
							}
						}
					}
				}

				for (let table of Mail) {
					let rows = await test.characters[table].findAll({
						where: { receiver: guid },
						raw: true
					})

					for (let row of rows) {
						let mailId = row.id

						row.id = await live.characters[table].max('id', { transaction: t }) + 1
						row.receiver = guid

						for (let mailItems of MailItems) {
							let items = await test.characters[mailItems].findAll({
								where: {
									mail_id: mailId,
									receiver: guid
								},
								raw: true
							})

							for (let item of items) {
								let instance = await test.characters.item_instance.findByPk(item.guid, { raw: true })
								let itemGuid = await live.characters.item_instance.max('guid', { transaction: t }) + 1
								itemInstances.push(itemGuid)

								instance.guid = itemGuid
								instance.owner_guid = guid
								await live.characters.item_instance.create(item, { transaction: t })

								item.mail_id = mailId
								item.item_guid = itemGuid
								item.receiver = guid
								await live.characters[mailItems].create(row, { transaction: t })
							}
						}
						await live.characters[table].create(row, { transaction: t })
					}
				}

				for (let table of Item) {
					let rows = await test.characters[table].findAll({
						where: { guid: guid },
						raw: true
					})
					let items = rows.filter(item => !itemInstances.includes(item.guid))

					for (let item of items) {
						item.guid = await live.characters.item_instance.max('guid', { transaction: t }) + 1
						item.owner_guid = guid
						await live.characters.item_instance.create(item, { transaction: t })
					}
				}
			})

			interaction.reply({ content: copySuccess, ephemeral: true })
			return
		} catch(err) {
			console.log(err)
			interaction.reply({ content: copyError, ephemeral: true })
			return
		}
	}

	if (interaction.commandName === 'services') {
		let subcommand = interaction.options.getSubcommand()


		if (subcommand === 'name-change') {
			let userId = interaction.member.user.id;
			let user = await live.auth.user.findOne({ where: { userId: userId }})

			if (user === null || user.accountId === null) {
				interaction.reply({ content: createAccount, ephemeral: true })
				return
			}

			let account = await live.auth.account.findByPk(user.accountId)

			if (account === null) {
				interaction.reply({ content: accountNotFound, ephemeral: true })
				return
			}

			if (account.online !== 0) {
				interaction.reply({ content: logoff, ephemeral: true })
				return
			}

			let oldName = interaction.options.getString('old')
			let character = await live.characters.characters.findOne({ where: { name: oldName }})

			if (character === null || character.account !== user.accountId) {
				interaction.reply({ content: characterDoesntExist, ephemeral: true })
				return
			}

			let newName = interaction.options.getString('new')
			let other = await live.characters.characters.findOne({ where: {name: newName }})

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
			return subcommand === 'customise' || subcommand === 'race-change' || subcommand === 'faction-change'
		}

		if (isFlag(subcommand)) {
			let userId = interaction.member.user.id;
			let user = await live.auth.user.findOne({ where: { userId: userId }})

			if (user === null) {
				interaction.reply({ content: createAccount, ephemeral: true })
				return
			}

			let account = await live.auth.account.findByPk(user.accountId)

			if (account === null) {
				interaction.reply({ content: accountNotFound, ephemeral: true })
				return
			}

			if (account.online !== 0) {
				interaction.reply({ content: logoff, ephemeral: true })
				return
			}

			let name = interaction.options.getString('name')
			let character = await live.characters.characters.findOne({ where: { name: name }})

			if (character === null || character.account !== user.accountId) {
				interaction.reply({ content: characterDoesntExist, ephemeral: true })
				return
			}

			if (subcommand === 'customise') {
				character.atLogin = AtLoginFlags.AT_LOGIN_CUSTOMIZE
			} else if (subcommand === 'race-change') {
				character.atLogin = AtLoginFlags.AT_LOGIN_CHANGE_RACE
			} else if (subcommand === 'faction-change') {
				character.atLogin = AtLoginFlags.AT_LOGIN_CHANGE_FACTION
			}

			await character.save()
			console.log(character.toJSON());
			interaction.reply({ content: flagged, ephemeral: true })
		}
	}
})

client.login(token)
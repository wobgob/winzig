import { Client, Intents, MessageEmbed } from 'discord.js'
import { REST } from '@discordjs/rest'
import { channelMention, SlashCommandBuilder } from '@discordjs/builders'
import { Routes } from 'discord-api-types/v9'
import Email from 'email-templates'
import sequelize, { Sequelize } from 'sequelize'
import nodemailer from 'nodemailer'
import { makeRegistrationData } from './srp.js'
import { AtLoginFlags } from './character-tools.js'
import initAuth from './models/auth/init-models.js'
import initCharacters from './models/characters/init-models.js'
import initTestCharacters from './models/test_characters/init-models.js'
import { AuthDb, CharactersDb, TestCharactersDb } from './db.js'
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
const unknownCommand = 'Unknown command.'
const waitOneDay = 'You must wait one day between faction changes.'

const token = config.DISCORD.BOT_TOKEN
const clientId = config.DISCORD.CLIENT_ID
const guildId = config.DISCORD.GUILD_ID
const intents = new Intents()
intents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS)
const client = new Client({ intents: intents })
const rest = new REST({ version: '9' }).setToken(token)

try {
    await AuthDb.authenticate()
    await CharactersDb.authenticate()
    await TestCharactersDb.authenticate()

    console.log('Connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

const auth = initAuth(AuthDb)
const characters = initCharacters(CharactersDb)
const test_characters = initTestCharacters(TestCharactersDb)

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
            .addStringOption(option => option.setName('password').setDescription('Enter your password').setRequired(true))
            .addStringOption(option => option.setName('again').setDescription('Enter your password again').setRequired(true)))
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
const commands = [account, character];

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()

const red = '#FF0000'
const yellow = '#FFFF00'
const green = '#00FF00'

let log = (color, command, subcommand, user, msg) => {
    let username = client.user.username

    if (user !== null)
        username = user.username

    let embed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${command} ${subcommand}`)
        .setAuthor(username)
        .setDescription(msg)
    client.channels.cache.get(config.DISCORD.LOG_ID).send({ embeds: [embed ]})
}

client.on('ready', async () => {
    await auth.user.sync()
    await auth.reset.sync()
    await characters.faction_change.sync()
    console.log(`Logged in as ${client.user.tag}!`)
    log(green, 'Ready', '', null, `Logged in as ${client.user.tag}`)
})

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    let user = await auth.user.findOne({ where: { userId: oldMember.user.id }})
    if (user === null) {
        user = await auth.user.findOne({ where: { userId: newMember.user.id }})
        
        if (user === null) {
            console.log(`User ${oldMember.user.id} and ${newMember.user.id} not found`)
            return
        }
    }

	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.some(role => role.name === 'Member')) {
        await auth.account_access.destroy({ where: { id: user.accountId, RealmID: config.TEST_REALM_ID }})
        log(yellow, 'guildMemberUpdate', '', oldMember.user, 'Removed Member role')
    }

	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.some(role => role.name === 'Member')) {
        await auth.account_access.destroy({ where: { id: user.accountId, RealmID: config.TEST_REALM_ID }})
        await auth.account_access.create({
            id: user.accountId,
            gmlevel: 2,
            RealmID: config.TEST_REALM_ID,
            comment: 'Set by Winzig'
        })
        log(green, 'guildMemberUpdate', '', oldMember.user, 'Added Member role')
    }
});

let copyInProgress = false

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand())
        return

    if (interaction.member !== null) {
        let msg = 'Direct Message Winzig with your application command.'
        interaction.reply({ content: msg, ephemeral: true })
        log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, msg)
        return
    }

    if (interaction.user === null) {
        let msg = 'Unable to determine Discord user.'
        interaction.reply({ content: msg, ephemeral: true })
        log(red, interaction.commandName, interaction.options.getSubcommand(), interaction.user, msg)
        return
    }

    if (interaction.commandName === 'account') {
        if (interaction.options.getSubcommand() === 'create') {
            let username = interaction.options.getString('username')
            let password = interaction.options.getString('password')
            let again = interaction.options.getString('again')
            let I = username.toUpperCase()
            let P = password.toUpperCase()
            let userId = interaction.user.id

            let user = await auth.user.findOne({ where: { userId: userId } })
            if (user !== null && user.accountId !== null) {
                interaction.reply({ content: accountExists, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, accountExists)
                return
            }

            if (username.length > maxAccountStr) {
                interaction.reply({ content: nameTooLong, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, nameTooLong)
                return
            }

            if (password.length > maxPassStr) {
                interaction.reply({ content: passTooLong, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, passTooLong)
                return
            }

            if (password !== again) {
                interaction.reply({ content: passwordDoesntMatch, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, passwordDoesntMatch)
                return
            }

            let account = await auth.account.findOne({ where: { username: I } })
            if (account !== null) {
                interaction.reply({ content: nameAlreadyExists, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, nameAlreadyExists)
                return
            }

            let [salt, verifier] = makeRegistrationData(I, P)

            account = auth.account.build({
                username: I,
                salt: salt,
                verifier: verifier
            })
            await account.save()
            console.log(account.toJSON())

            if (user !== null) {
                user.accountId = account.id
            } else {
                user = auth.user.build({
                    userId: userId,
                    accountId: account.id
                })
            }
            await user.save()
            console.log(user.toJSON())
            interaction.reply({ content: `Account created: ${username}.`, ephemeral: false })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.user, `Account created: ${username}.`)
            return
        } else if (interaction.options.getSubcommand() === 'password') {
            let user = await auth.user.findOne({ where: { userId: interaction.user.id } })
            let account = await auth.account.findByPk(user.accountId)
            let reset = await auth.reset.findOne({ where: { userId: user.id } })
            let code = interaction.options.getString('code')
            let newPassword = interaction.options.getString('password')
            let againPassword = interaction.options.getString('again')

            if (reset === null || reset.updatedAt < (new Date() - 60 * 60 * 1000)) {
                interaction.reply({ content: resetInactive, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, resetInactive)
                return
            }

            if (reset.code !== code) {
                interaction.reply({ content: wrongCode, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, wrongCode)
                return
            }

            if (newPassword.length > maxPassStr) {
                interaction.reply({ content: passTooLong, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, passTooLong)
                return
            }

            if (newPassword !== againPassword) {
                interaction.reply({ content: passwordDoesntMatch, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, passwordDoesntMatch)
                return
            }

            let I = account.username.toUpperCase()
            let P = newPassword.toUpperCase()
            let [salt, verifier] = makeRegistrationData(I, P)

            account.salt = salt
            account.verifier = verifier
            await account.save()
            console.log(account.toJSON())
            interaction.reply({ content: passwordChanged, ephemeral: false })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.user, passwordChanged)
            return
        } else if (interaction.options.getSubcommand() === 'reset') {
            let address = interaction.options.getString('email')
            let validEmail = (email) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }

            if (!validEmail(address)) {
                interaction.reply({ content: invalidEmail, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, invalidEmail)
                return
            }

            let userId = interaction.user.id
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null || user.accountId === null) {
                interaction.reply({ content: createAccount, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, createAccount)
                return
            }

            let reset = await auth.reset.findOne({ where: { userId: user.id } })

            if (reset !== null && reset.updatedAt > (new Date() - 5 * 60 * 1000)) {
                interaction.reply({ content: tooSoon, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, tooSoon)
                return
            }

            let transport = nodemailer.createTransport({
                host: config.SMTP.HOST,
                port: 587,
                secure: false,
                auth: {
                    user: config.SMTP.USER,
                    pass: config.SMTP.PASS
                }
            })

            let email = new Email({
                message: {
                    from: config.EMAIL
                },
                send: true,
                transport: transport
            })

            let code = Math.random().toString(10).slice(2, 8)
            let account = await auth.account.findByPk(user.accountId)

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
                interaction.reply({ content: emailNotSent, ephemeral: false })
                log(red, interaction.commandName, interaction.options.getSubcommand(), interaction.user, emailNotSent)
                return
            })

            if (reset === null) {
                reset = auth.reset.build({
                    code: code,
                    userId: user.id,
                })
            } else {
                reset.code = code
            }
            await reset.save()

            interaction.reply({ content: emailSent, ephemeral: false })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.user, emailSent)
            return
        }
    }

    if (interaction.commandName === 'services') {
        let subcommand = interaction.options.getSubcommand()

        let isFlag = (subcommand) => {
            return subcommand === 'customise' || subcommand === 'race-change' || subcommand === 'faction-change'
        }

        if (isFlag(subcommand)) {
            let userId = interaction.user.id;
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null) {
                interaction.reply({ content: createAccount, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, createAccount)
                return
            }

            let account = await auth.account.findByPk(user.accountId)

            if (account === null) {
                interaction.reply({ content: accountNotFound, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, accountNotFound)
                return
            }

            if (account.online !== 0) {
                interaction.reply({ content: logoff, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, logoff)
                return
            }

            let name = interaction.options.getString('name')
            let character = await characters.characters.findOne({ where: { name: name } })

            if (character === null || character.account !== user.accountId) {
                interaction.reply({ content: characterDoesntExist, ephemeral: false })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, characterDoesntExist)
                return
            }

            if (subcommand === 'customise') {
                character.at_login = AtLoginFlags.AT_LOGIN_CUSTOMIZE
            } else if (subcommand === 'race-change') {
                character.at_login = AtLoginFlags.AT_LOGIN_CHANGE_RACE
            } else if (subcommand === 'faction-change') {
                let changed = await characters.faction_change.findOne({ where: { guid: character.guid, account: character.account } })

                if (changed === null) {
                    changed = await characters.faction_change.create({ guid: character.guid, account: character.account })
                } else if (changed.updatedAt > (new Date() - 24 * 60 * 60 * 1000)) {
                    interaction.reply({ content: waitOneDay, ephemeral: false })
                    log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.user, waitOneDay)
                    return
                }

                changed.changed('updatedAt', true)
                await changed.update({ updatedAt: new Date() })
                character.at_login = AtLoginFlags.AT_LOGIN_CHANGE_FACTION
            }

            await character.save()
            console.log(character.toJSON());
            interaction.reply({ content: flagged, ephemeral: false })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.user, flagged)
            return
        }
    }

    interaction.reply({ content: unknownCommand, ephemeral: false })
    log(red, interaction.commandName, interaction.options.getSubcommand(), interaction.user, unknownCommand)
    return
})

client.login(token)

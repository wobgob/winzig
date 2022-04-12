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
    .addSubcommand(subcommand =>
        subcommand
            .setName('id')
            .setDescription('Get your account ID.'))
const character = new SlashCommandBuilder()
    .setName('services')
    .setDescription('Character services.')
    .addSubcommand(subcommand =>
        subcommand
            .setName('name-change')
            .setDescription('Change a character\'s name.')
            .addStringOption(option => option.setName('name').setDescription('Enter your character\'s name').setRequired(true)))
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
    .addSubcommand(subcommand =>
        subcommand
            .setName('link')
            .setDescription('Link with another account.')
            .addIntegerOption(option => option.setName('id').setDescription('Enter their account ID.').setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('copy')
            .setDescription('Copy a character from live to test.')
            .addStringOption(option => option.setName('live').setDescription('Character to copy from.').setRequired(true))
            .addStringOption(option => option.setName('test').setDescription('Character to copy to.').setRequired(true)))
const commands = [account, character];

const restricted = []
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

        for (let cmd in cmds) {
            if (restricted.includes(cmd.name)) {
                await rest.put(
                    Routes.applicationCommandPermissions(clientId, guildId, cmd.id),
                    { body: permissions }
                )
            }
        }

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
    if (!interaction.isCommand()) return

    if (interaction.commandName === 'account') {
        if (interaction.options.getSubcommand() === 'create') {
            let username = interaction.options.getString('username')
            let password = interaction.options.getString('password')
            let again = interaction.options.getString('again')
            let I = username.toUpperCase()
            let P = password.toUpperCase()
            let userId = interaction.member.user.id;

            let user = await auth.user.findOne({ where: { userId: userId } })
            if (user !== null && user.accountId !== null) {
                interaction.reply({ content: accountExists, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, accountExists)
                return
            }

            if (username.length > maxAccountStr) {
                interaction.reply({ content: nameTooLong, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, nameTooLong)
                return
            }

            if (password.length > maxPassStr) {
                interaction.reply({ content: passTooLong, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, passTooLong)
                return
            }

            if (password !== again) {
                interaction.reply({ content: passwordDoesntMatch, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, passwordDoesntMatch)
                return
            }

            let account = await auth.account.findOne({ where: { username: I } })
            if (account !== null) {
                interaction.reply({ content: nameAlreadyExists, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, nameAlreadyExists)
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
            interaction.reply({ content: `Account created: ${username}.`, ephemeral: true })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, `Account created: ${username}.`)
            return
        } else if (interaction.options.getSubcommand() === 'password') {
            let user = await auth.user.findOne({ where: { userId: interaction.member.user.id } })
            let account = await auth.account.findByPk(user.accountId)
            let reset = await auth.reset.findOne({ where: { userId: user.id } })
            let code = interaction.options.getString('code')
            let newPassword = interaction.options.getString('password')
            let againPassword = interaction.options.getString('again')

            if (reset === null || reset.updatedAt < (new Date() - 60 * 60 * 1000)) {
                interaction.reply({ content: resetInactive, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, resetInactive)
                return
            }

            if (reset.code !== code) {
                interaction.reply({ content: wrongCode, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, wrongCode)
                return
            }

            if (newPassword.length > maxPassStr) {
                interaction.reply({ content: passTooLong, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, passTooLong)
                return
            }

            if (newPassword !== againPassword) {
                interaction.reply({ content: passwordDoesntMatch, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, passwordDoesntMatch)
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
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, passwordChanged)
            return
        } else if (interaction.options.getSubcommand() === 'reset') {
            let address = interaction.options.getString('email')
            let validEmail = (email) => {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            }

            if (!validEmail(address)) {
                interaction.reply({ content: invalidEmail, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, invalidEmail)
                return
            }

            let userId = interaction.member.user.id
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null || user.accountId === null) {
                interaction.reply({ content: createAccount, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, createAccount)
                return
            }

            let reset = await auth.reset.findOne({ where: { userId: user.id } })

            if (reset !== null && reset.updatedAt > (new Date() - 5 * 60 * 1000)) {
                interaction.reply({ content: tooSoon, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, tooSoon)
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
                interaction.reply({ content: emailNotSent, ephemeral: true })
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

            interaction.reply({ content: emailSent, ephemeral: true })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, emailSent)
            return
        } else if (interaction.options.getSubcommand() === 'id') {
            let userId = interaction.member.user.id;
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null) {
                interaction.reply({ content: createAccount, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, createAccount)
                return
            }

            let msg = `Your account ID is \`${user.accountId}\`.`
            interaction.reply({ content: msg, ephemeral: true})
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
            return
        }
    }

    if (interaction.commandName === 'services') {
        let subcommand = interaction.options.getSubcommand()

        let isFlag = (subcommand) => {
            return subcommand === 'name-change' || subcommand === 'customise'
                || subcommand === 'race-change' || subcommand === 'faction-change'
        }

        if (subcommand === 'copy') {
            if (copyInProgress) {
                let msg = 'The server is currently busy. Please try again in a few seconds.'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            let userId = interaction.member.user.id;
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null) {
                interaction.reply({ content: createAccount, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, createAccount)
                return
            }

            let account = await auth.account.findByPk(user.accountId)

            if (account === null) {
                interaction.reply({ content: accountNotFound, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, accountNotFound)
                return
            }

            if (account.online !== 0) {
                interaction.reply({ content: logoff, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, logoff)
                return
            }

            let src = interaction.options.getString('live')
            let dest = interaction.options.getString('test')
            let live = await characters.characters.findOne({ where: { name: src }})
            let test = await test_characters.characters.findOne({ where: { name: dest }})

            if (live === null || live.account !== user.accountId) {
                let msg = 'Live character does not exist!'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            if (test === null || test.account !== user.accountId) {
                let msg = 'Test character does not exist!'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            if (live.class !== test.class) {
                let msg = 'The live character is not the same class as the test character.'
                interaction.reply({ content: msg, ephmeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            if (live.race !== test.race) {
                let msg = 'The live character is not the same race as the test character.'
                interaction.reply({ content: msg, ephmeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            if (test.cinematic === 1) {
                let msg = 'Test character has been logged into.'
                interaction.reply({ content: msg, ephmeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            copyInProgress = true
            await interaction.deferReply({ ephemeral: true });

            test.level = live.level
            test.xp = live.xp
            test.money = live.money
            test.taximask = live.taximask
            test.totaltime = live.totaltime
            test.leveltime = live.leveltime
            test.stable_slots = live.stable_slots
            test.health = live.health
            test.power1 = live.power1
            test.power2 = live.power2
            test.power3 = live.power3
            test.power4 = live.power4
            test.power5 = live.power5
            test.power6 = live.power6
            test.power7 = live.power7
            test.talentGroupsCount = live.talentGroupsCount
            test.exploredZones = live.exploredZones
            test.cinematic = 1

            await test.save()

            let liveHomebind = await characters.character_homebind.findByPk(live.guid)

            if (liveHomebind === null) {
                let msg = 'Live character\'s homebind does not exist!'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            let testHomebind = test_characters.character_homebind.build({
                guid: test.guid,
                mapId: liveHomebind.mapId,
                zoneId: liveHomebind.zoneId,
                posX: liveHomebind.posX,
                posY: liveHomebind.posY,
                posZ: liveHomebind.posZ,
            })

            await testHomebind.save()

            let maxPet = await test_characters.character_pet.max('id')
            if (live.class === 3) {
                let livePet = await characters.character_pet.findOne(
                    { where: { owner: live.guid }
                })

                if (livePet !== null) {
                    maxPet += 1
                    let testPet = await test_characters.character_pet.create({
                        id: maxPet,
                        entry: livePet.entry,
                        owner: test.guid,
                        modelid: livePet.modelid,
                        CreatedBySpell: livePet.CreatedBySpell,
                        PetType: livePet.PetType,
                        level: livePet.level,
                        exp: livePet.exp,
                        Reactstate: livePet.Reactstate,
                        name: livePet.name,
                        renamed: livePet.renamed,
                        slot: livePet.slot,
                        curhealth: livePet.curhealth,
                        curmana: livePet.curmana,
                        curhappiness: livePet.curhappiness,
                        savetime: livePet.savetime,
                        abdata: livePet.abdata
                    })

                    let petSpells = await characters.pet_spell.findAll(
                        { where: { guid: livePet.id }
                    })

                    for (let liveRow of petSpells) {
                        await test_characters.pet_spell.create({
                            guid: testPet.id,
                            spell: liveRow.spell,
                            active: liveRow.active
                        })
                    }
                }
            }

            let quests = await characters.character_queststatus_rewarded.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of quests) {
                let testRow = await test_characters.character_queststatus_rewarded.findOne({
                    where: {
                        guid: test.guid,
                        quest: liveRow.quest
                    }
                })

                if (testRow !== null) {
                    await testRow.update({
                        active: liveRow.active
                    })
                } else {
                    await test_characters.character_queststatus_rewarded.create({
                        guid: test.guid,
                        quest: liveRow.quest,
                        active: liveRow.active
                    })
                }
            }

            let reputation = await characters.character_reputation.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of reputation) {
                let testRow = await test_characters.character_reputation.findOne({
                    where: {
                        guid: test.guid,
                        faction: liveRow.faction
                    }
                })

                if (testRow !== null) {
                    await testRow.update({
                        standing: liveRow.standing,
                        flags: liveRow.flags
                    })
                } else {
                    await test_characters.character_reputation.create({
                        guid: test.guid,
                        faction: liveRow.faction,
                        standing: liveRow.standing,
                        flags: liveRow.flags
                    })
                }
            }

            let skills = await characters.character_skills.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of skills) {
                let testRow = await test_characters.character_skills.findOne({
                    where: {
                        guid: test.guid,
                        skill: liveRow.skill
                    }
                })

                if (testRow !== null) {
                    await testRow.update({
                        value: liveRow.value,
                        max: liveRow.max
                    })
                } else {
                    await test_characters.character_skills.create({
                        guid: test.guid,
                        skill: liveRow.skill,
                        value: liveRow.value,
                        max: liveRow.max
                    })
                }
            }

            let spells = await characters.character_spell.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of spells) {
                let testRow = await test_characters.character_spell.findOne({
                    where: {
                        guid: test.guid,
                        spell: liveRow.spell
                    }
                })

                if (testRow !== null) {
                    await testRow.update({
                        specMask: liveRow.specMask
                    })
                } else {
                    await test_characters.character_spell.create({
                        guid: test.guid,
                        spell: liveRow.spell,
                        specMask: liveRow.specMask,
                    })
                }
            }

            let talents = await characters.character_talent.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of talents) {
                let testRow = await test_characters.character_talent.findOne({
                    where: {
                        guid: test.guid,
                        spell: liveRow.spell,
                        specMask: liveRow.specMask
                    }
                })

                if (testRow === null) {
                    await test_characters.character_talent.create({
                        guid: test.guid,
                        spell: liveRow.spell,
                        specMask: liveRow.specMask,
                    })
                }
            }

            let glyphs = await characters.character_glyphs.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of glyphs) {
                let testRow = await test_characters.character_glyphs.findOne({
                    where: {
                        guid: test.guid,
                        talentGroup: liveRow.talentGroup
                    }
                })

                if (testRow !== null) {
                    await testRow.update({
                        glyph1: liveRow.glyph1,
                        glyph2: liveRow.glyph2,
                        glyph3: liveRow.glyph3,
                        glyph4: liveRow.glyph4,
                        glyph5: liveRow.glyph5,
                        glyph6: liveRow.glyph6
                    })
                } else {
                    await test_characters.character_glyphs.create({
                        guid: test.guid,
                        talentGroup: liveRow.talentGroup,
                        glyph1: liveRow.glyph1,
                        glyph2: liveRow.glyph2,
                        glyph3: liveRow.glyph3,
                        glyph4: liveRow.glyph4,
                        glyph5: liveRow.glyph5,
                        glyph6: liveRow.glyph6
                    })
                }
            }

            let actions = await characters.character_action.findAll(
                { where: { guid: live.guid }
            })

            for (let liveRow of actions) {
                let testRow = await test_characters.character_action.findOne({
                    where: {
                        guid: test.guid,
                        spec: liveRow.spec,
                        button: liveRow.button
                    }
                })

                if (testRow !== null) {
                    await testRow.update({
                        action: liveRow.action,
                        type: liveRow.type
                    })
                } else {
                    await test_characters.character_action.create({
                        guid: test.guid,
                        spec: liveRow.spec,
                        button: liveRow.button,
                        action: liveRow.action,
                        type: liveRow.type
                    })
                }
            }

            await test_characters.item_instance.destroy({
                where: {
                    owner_guid: live.guid,
                    itemEntry: {
                        [Op.not]: 6948
                    }
                }
            })

            let hearthstone = await test_characters.item_instance.findOne({
                where: {
                    owner_guid: test.guid,
                    itemEntry: 6948
                }
            })

            await test_characters.character_inventory.destroy({
                where: {
                    guid: test.guid,
                    item: {
                        [Op.not]: hearthstone.guid
                    }
                }
            })

            let max = await test_characters.item_instance.max('guid')

            let liveInventory = await characters.character_inventory.findAll({
                where: {
                    guid: live.guid,
                    bag: 0,
                    slot: {
                        [Op.lte]: 18
                    }
                },
                limit: 18
            })

            for (let row of liveInventory) {
                await characters.item_instance.findByPk(row.item).then(async instance => {
                    if (instance === null)
                        return

                    max += 1
                    let testInstance = test_characters.item_instance.build({
                        guid: max,
                        itemEntry: instance.itemEntry,
                        owner_guid: test.guid,
                        creatorGuid: instance.creatorGuid,
                        duration: instance.duration,
                        charges: instance.charges,
                        flags: 1,
                        enchantments: instance.enchantments,
                        randomPropertyId: instance.randomPropertyId,
                        durability: instance.durability
                    })

                    let testInventory = test_characters.character_inventory.build({
                        guid: test.guid,
                        bag: row.bag,
                        slot: row.slot,
                        item: testInstance.guid
                    })

                    await testInstance.save()
                    await testInventory.save()
                })
            }

            copyInProgress = false
            let msg = "Character copy complete."
            interaction.editReply({ content: msg, ephemeral: true })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
            return
        }

        if (subcommand === 'link') {
            let userId = interaction.member.user.id;
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null) {
                interaction.reply({ content: createAccount, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, createAccount)
                return
            }

            let account = await auth.account.findByPk(user.accountId)

            if (account === null) {
                interaction.reply({ content: accountNotFound, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, accountNotFound)
                return
            }

            if (account.online !== 0) {
                interaction.reply({ content: logoff, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, logoff)
                return
            }

            let id = interaction.options.getInteger('id')

            if (id === 0) {
                let msg = 'You have unlinked your account.'
                interaction.reply({ content: msg, ephemeral: true })
                log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            if (id < 0) {
                let msg = 'Account ID must be a positive number.'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            if (id === account.id) {
                let msg = 'You cannot link with yourself.'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            let recruiter = await auth.account.findByPk(id)

            if (recruiter !== null && recruiter.recruiter == account.id) {
                let msg = 'Other account is already linked with you.'
                interaction.reply({ content: msg, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
                return
            }

            account.recruiter = id
            await account.save()
            let msg = `Linked to account ID ${id}.`
            interaction.reply({ content: msg, ephemeral: true })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, msg)
            return
        } else if (isFlag(subcommand)) {
            let userId = interaction.member.user.id;
            let user = await auth.user.findOne({ where: { userId: userId } })

            if (user === null) {
                interaction.reply({ content: createAccount, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, createAccount)
                return
            }

            let account = await auth.account.findByPk(user.accountId)

            if (account === null) {
                interaction.reply({ content: accountNotFound, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, accountNotFound)
                return
            }

            if (account.online !== 0) {
                interaction.reply({ content: logoff, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, logoff)
                return
            }

            let name = interaction.options.getString('name')
            let character = await characters.characters.findOne({ where: { name: name } })

            if (character === null || character.account !== user.accountId) {
                interaction.reply({ content: characterDoesntExist, ephemeral: true })
                log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, characterDoesntExist)
                return
            }

            if (subcommand === 'name-change') {
                character.at_login = AtLoginFlags.AT_LOGIN_RENAME
            } else if (subcommand === 'customise') {
                character.at_login = AtLoginFlags.AT_LOGIN_CUSTOMIZE
            } else if (subcommand === 'race-change') {
                character.at_login = AtLoginFlags.AT_LOGIN_CHANGE_RACE
            } else if (subcommand === 'faction-change') {
                let changed = await characters.faction_change.findOne({ where: { guid: character.guid, account: character.account } })

                if (changed === null) {
                    changed = await characters.faction_change.create({ guid: character.guid, account: character.account })
                } else if (changed.updatedAt > (new Date() - 24 * 60 * 60 * 1000)) {
                    interaction.reply({ content: waitOneDay, ephemeral: true })
                    log(yellow, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, waitOneDay)
                    return
                }

                changed.changed('updatedAt', true)
                await changed.update({ updatedAt: new Date() })
                character.at_login = AtLoginFlags.AT_LOGIN_CHANGE_FACTION
            }

            await character.save()
            console.log(character.toJSON());
            interaction.reply({ content: flagged, ephemeral: true })
            log(green, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, flagged)
            return
        }
    }

    interaction.reply({ content: unknownCommand, ephemeral: true })
    log(red, interaction.commandName, interaction.options.getSubcommand(), interaction.member.user, unknownCommand)
    return
})

client.login(token)

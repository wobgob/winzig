import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandNumericOptionMinMaxValueMixin } from "discord.js"
import { makeRegistrationData } from "../srp"
import { Command } from "../command"
import { Database } from "../database"

export const Create: Command = {
    name: "create",
    description: "Create an account",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "username",
        description: "Enter your username",
        type: ApplicationCommandOptionType.String,
        required: true,
        maxLength: 20
    }, {
        name: "password",
        description: "Enter your password",
        type: ApplicationCommandOptionType.String,
        required: true,
        maxLength: 16
    }],
    run: async (client: Client, auth: Database, interaction: CommandInteraction) => {
        const username = interaction.options.get("username", true).value?.toString().toUpperCase()
        const password = interaction.options.get("password", true).value?.toString().toUpperCase()

        if (!username) {
            interaction.reply({ content: "No username provided "})
            return
        }

        if (!password) {
            interaction.reply({ content: "No password provided" })
            return
        }

        const userId = interaction.user.id
        let user = await auth.user.findOne({ where: { userId: userId }})

        if (user) {
            interaction.reply({ content: "You already have an account" })
            return
        }

        let account = await auth.account.findOne({ where: { username: username }})

        if (account) {
            interaction.reply({ content: "Account already exists" })
            return
        }

        try {
            const [salt, verifier] = makeRegistrationData(username, password)

            account = auth.account.build({
                username: username,
                salt: salt,
                verifier: verifier
            })

            await account.save()

            user = auth.user.build({
                userId: userId,
                accountId: account.id
            })

            await user.save()

            interaction.reply({ content: "Account created"})
            return
        } catch (e) {
            interaction.reply({ content: "An error has occurred" })
            console.log(e)
            return
        }
    }
}
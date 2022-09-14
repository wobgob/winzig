import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandNumericOptionMinMaxValueMixin } from "discord.js"
import { makeRegistrationData } from "../srp"
import { Command } from "../command"
import { Database } from "../database"

export const Reset: Command = {
    name: "reset",
    description: "Reset your password",
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: "password",
        description: "Enter your password",
        type: ApplicationCommandOptionType.String,
        required: true,
        maxLength: 16
    }],
    run: async (client: Client, auth: Database, interaction: CommandInteraction) => {
        const password = interaction.options.get("password", true).value?.toString().toUpperCase()

        if (!password) {
            interaction.reply({ content: "No password provided" })
            return
        }

        const userId = interaction.user.id
        let user = await auth.user.findOne({ where: { userId: userId }})

        if (!user) {
            interaction.reply({ content: "No user found" })
            return
        }

        let account = await auth.account.findByPk(user!.accountId)

        if (!account) {
            interaction.reply({ content: "No account found" })
            return
        }

        try {
            const [salt, verifier] = makeRegistrationData(account!.username, password)

            account!.salt = salt
            account!.verifier = verifier
            await account!.save()

            interaction.reply({ content: "Password changed"})
            return
        } catch (e) {
            interaction.reply({ content: "An error has occurred" })
            console.log(e)
            return
        }
    }
}
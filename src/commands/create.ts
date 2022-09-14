import { CommandInteraction, Client, ApplicationCommandType } from "discord.js"
import { Command } from "../command"

export const Create: Command = {
    name: "create",
    description: "Create an account",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Hello there!"

        await interaction.followUp({
            ephemeral: true,
            content
        })
    }
}
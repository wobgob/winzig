import { CommandInteraction, Client, Interaction } from "discord.js"
import { Database } from "../database"
import { Commands } from "../commands"

export default (client: Client, db: Database): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            if (interaction.member) {
                const content = "Direct message Winzig"
                interaction.reply({ ephemeral: true, content })
                return
            }

            if (!interaction.user) {
                interaction.reply({ content: "No Discord user found" })
                return
            }

            await handleCommand(client, db, interaction)
        }
    })
}

const handleCommand = async (client: Client, db: Database, interaction: CommandInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName);

    if (!command) {
        interaction.reply({ content: "An error has occurred" })
        return
    }

    command.run(client, db, interaction)
}
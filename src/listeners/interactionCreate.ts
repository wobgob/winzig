import { CommandInteraction, Client, Interaction } from "discord.js"
import { Commands } from "../commands"

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleCommand(client, interaction)
        }
    })
}

const handleCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
    const command = Commands.find(c => c.name === interaction.commandName);

    if (!command) {
        interaction.followUp({ content: "An error has occurred" })
        return
    }

    await interaction.deferReply()
    command.run(client, interaction)
}
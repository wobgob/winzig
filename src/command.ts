import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js"
import { Database } from "./database"

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, db: Database, interaction: CommandInteraction) => void
}
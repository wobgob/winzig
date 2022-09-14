import "dotenv/config"
import { Client } from "discord.js"
import interactionCreate from "./listeners/interactionCreate"
import ready from "./listeners/ready"
import sync from "./database"

const uri = process.env.DATABASE_URI || ''
const client = new Client({
    intents: []
})
const token = process.env.DISCORD_BOT_TOKEN

sync(uri)
ready(client)
interactionCreate(client)

client.login(token)
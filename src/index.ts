import "dotenv/config"
import { Client } from "discord.js"
import init from "./database"
import ready from "./listeners/ready"
import interactionCreate from "./listeners/interactionCreate"

const uri = process.env.DATABASE_URI || ''
const client = new Client({
    intents: []
});

const auth = init(uri); (async () => await auth.sequelize.sync())()
ready(client)
interactionCreate(client, auth)

const token = process.env.DISCORD_BOT_TOKEN
client.login(token)
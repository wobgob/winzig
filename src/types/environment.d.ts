declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_BOT_TOKEN: string
            DATABASE_URI: string
        }
    }
}

export {}
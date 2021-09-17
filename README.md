# Winzig
Requests the presence of Winzig, the perfect goblin barmaid, who will attend to your needs.

## Usage
Create the file `config.js` in the root of the repository.

```
config.js:
    export default
    {
        "DISCORD_BOT_TOKEN": "<bot-token>",
        "DISCORD_CLIENT_ID": "<client-id>",
        "DISCORD_GUILD_ID": "<guild-id>",
        "DISCORD_BOT_DB": "mysql://<user>:<password>@<host>:<port>"
    }
```

Then run `npm install` followed by `npm run build`.

Use [`sequelize-auto`](https://github.com/sequelize/sequelize-auto) to auto generate models.
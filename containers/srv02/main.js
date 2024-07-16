const { Client, GatewayIntentBits, Events } = require('discord.js')
require('dotenv').config()
 
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
})

client.on('ready', () => {
    console.log('Bot is ready')
})

client.login(process.env.TOKEN)
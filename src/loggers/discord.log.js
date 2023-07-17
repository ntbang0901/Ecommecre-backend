"use strict"

const { Client, GatewayIntentBits } = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.on("ready", () => {
    console.log(`Logged is as ${client.user.tag}!`)
})

const token =
    "MTEyOTc5NDkwMDA1Mzk5OTcwNw.GGRHi-.1rQscUcHjo7hlikbFF4LdJy8qUQikCEk4grK3s"
client.login(token)

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return
    if (msg.content === "hello") {
        msg.reply("Hello, Can i help you")
    }
})

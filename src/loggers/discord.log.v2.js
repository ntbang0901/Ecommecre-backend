const { Client, GatewayIntentBits } = require("discord.js")
const {
    logger: { discord },
} = require("../configs/config")

class LoggerDiscordService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        })

        // add channelID
        this.channelId = discord.channelId

        this.client.on("ready", () => {
            console.log(`Logged is as ${this.client.user.tag}!`)
        })

        this.client.login(discord.token)
    }

    sendToFormatCode(logData) {
        // product and dev
        if (1 === 1) {
        }

        const {
            code,
            message = "This is some additional information about the code.",
            title = "Code Example",
        } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt("00ff00", 16), // Convert hexadecimal color code to integer
                    title,
                    description:
                        "```json\n" + JSON.stringify(code, null, 2) + "\n```",
                },
            ],
        }

        this.sendToMessage(codeMessage)
    }

    sendToMessage(message = "message") {
        console.log("123")
        const channel = this.client.channels.cache.get(this.channelId)
        if (!channel) {
            console.error(`counldn't find the channel...`, this.channelId)
            return
        }

        channel.send(message).catch((e) => console.error(e))
    }
}

module.exports = new LoggerDiscordService()

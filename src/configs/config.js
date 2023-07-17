"use strict"

// level 0

// const config = {
//   app: {
//     port: 3100,
//   },
//   db: {
//     host: "0.0.0.0",
//     port: 27017,
//     name: "db",
//   },
// }

// level 1

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052,
    },
    db: {
        host: process.env.DEV_DB_HOST || "0.0.0.0",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "shopDEV",
    },
    redis: {
        enable: process.env.REDIS_ENABLE,
        port: process.env.DEV_REDIS_PORT,
        host: process.env.DEV_REDIS_HOST,
        username: process.env.DEV_REDIS_USERNAME,
        password: process.env.DEV_REDIS_PASSWORD,
    },
    logger: {
        discord: {
            channelId: process.env.DISCORD_CHANNELID,
            token: process.env.DISCORD_TOKEN,
        },
    },
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3052,
    },
    db: {
        host: process.env.PRO_DB_HOST || "0.0.0.0",
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || "shopPRO",
    },
    redis: {
        enable: process.env.REDIS_ENABLE,
        port: process.env.PRO_REDIS_PORT,
        host: process.env.PRO_REDIS_HOST,
        username: process.env.PRO_REDIS_USERNAME,
        password: process.env.PRO_REDIS_PASSWORD,
    },
}

const config = { dev, pro }

const env = process.env.NODE_ENV || "dev"

module.exports = config[env]

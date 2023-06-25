"use strict"

const { promisify } = require("util")
const redisClient = require("../configs/redis.config")
const { setnx } = require("../utils/redis.util")

const acquirelock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTime = 10
    const expireTime = 3 // 3 seconds tạm lock

    for (let i = 0; i < retryTime.length; i++) {
        // tạo 1 key, ai nắm giữ được vào thanh toán
        const result = await setnx(key, expireTime)
        console.log(result)
        if (result === 1) {
            // thao tác với inventory
            const isRevervation = await revervationInventory({
                productId,
                quantity,
                cartId,
            })
            if (isRevervation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keylock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keylock)
}

module.exports = {
    acquirelock,
    releaseLock,
}

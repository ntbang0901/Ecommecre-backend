const redisPubSubService = require("../services/redisPubsub.service")

class InventoryServiceTest {
    constructor() {
        redisPubSubService.subscribe("purchase_events", (channel, message) => {
            console.log("Received message:", message, "channel:", channel)
            InventoryServiceTest.updateInventory(JSON.parse(message))
        })
    }

    static updateInventory({ productId, quantity }) {
        console.log(`updated inventory ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()

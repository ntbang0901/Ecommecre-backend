const redisPubSubService = require("../services/redisPubsub.service")

class ProductServiceTest {
    purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity,
        }
        console.log(`test::Test`)
        redisPubSubService.publish("purchase_events", JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()

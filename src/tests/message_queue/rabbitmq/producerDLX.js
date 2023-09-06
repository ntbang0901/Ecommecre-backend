const amqp = require("amqplib")
const messages = "new a product Title: Áo 3 lỗ"

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://ntbang:1@localhost")
        const channel = await connection.createChannel()

        const notificationExchange = "notificationEx" // notificationEx direct
        const notificationQueue = "notificationQueueProcess" // assertQueue
        const notificationExchangeDLX = "notificationExDLX" // notificationEx direct
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX" // assert

        // 1. create Exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        })

        // 2. create queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false, // cho phép các kết nối truy cập vào cùng 1 lúc hàng đợi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        })

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4. Send message
        const msg = "a new product"
        console.log("producer message::", msg)

        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000",
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(() => console.error)

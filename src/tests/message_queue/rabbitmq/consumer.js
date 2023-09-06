const amqp = require("amqplib")
const messages = "Hello, RabbitMQ for NTBANG"

const runConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:1@localhost")
        const channel = await connection.createChannel()
        const queueName = "test-topic"
        await channel.assertQueue(queueName, {
            durable: true,
        })

        // send messages to consumer channel
        channel.consume(
            queueName,
            (messages) => {
                console.log(`Received ${messages.content.toString()}`)
            },
            {
                noAck: true,
            }
        )
        console.log(`message sent: `, messages)
    } catch (error) {
        console.error(error)
    }
}

runConsumer().catch(() => console.error)

"use strict"
const amqp = require("amqplib")

async function consumerOrderedMessage() {
    const connection = await amqp.connect("amqp://ntbang:1@localhost")
    const channel = await connection.createChannel()

    const queueName = "ordered-queued-message"

    await channel.assertQueue(queueName, {
        durable: true,
    })

    // set prefetch to 1 to ensure only one ack at the time
    channel.prefetch(1)

    channel.consume(queueName, async (msg) => {
        const message = msg.content.toString()
        msg.properties.replyTo
        setTimeout(() => {
            console.log(`processed: `, message)
            channel.ack(msg)
        }, Math.random() * 1000)
    })
}

consumerOrderedMessage().catch((err) => console.error(err))

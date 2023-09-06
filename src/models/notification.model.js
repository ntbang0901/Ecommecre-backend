"use strict"
const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Notification"
const COLECTION_NAME = "Notifications"

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
    {
        noti_type: {
            type: String,
            enum: [
                "ORDER-001",
                "ORDER-002",
                "PROMOTION-001",
                "PROMOTION-002",
                "SHOP-001",
            ],
            required: true,
        },
        noti_senderId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        noti_receivedId: { type: Number, required: true },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLECTION_NAME,
    }
)

//Export the model
module.exports = {
    noti: model(DOCUMENT_NAME, cartSchema),
}

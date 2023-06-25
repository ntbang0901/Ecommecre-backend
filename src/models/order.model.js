"use strict"
const { model, Schema, Types } = require("mongoose") // Erase if already required

const DOCUMENT_NAME = "Order"
const COLECTION_NAME = "Orders"

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
    {
        order_user_id: { type: Number, required: true },
        order_checkout: { type: Object, default: {} },
        /*
            order_checkout = {
                totalPrice,
                totalApplyDiscount,
                feeShip
            }
        */
        order_shiping: { type: Object, default: {} },
        /*
            order_shiping = {
                street,
                city,
                state,
                country
            }
        */
        order_payment: { type: Object, default: {} },
        order_products: { type: Array, required: true }, // shop_order_ids_new
        order_trackingNumber: { type: String, default: "#000125062023" },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: COLECTION_NAME,
    }
)

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, orderSchema),
}

"use strict"

const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Inventory"
const COLECTION_NAME = "Inventories"

const InventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
        inven_location: { type: String, default: "unknown" },
        inven_stock: { type: Number, required: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
        inven_reservations: { type: Array, default: [] },
        /*
            cartId:,
            stock:1.
            createdOn:,
        */
    },
    {
        collection: COLECTION_NAME,
        timestamps: true,
    }
)

module.exports = model(DOCUMENT_NAME, InventorySchema)

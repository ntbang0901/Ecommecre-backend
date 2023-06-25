"use strict"
const { convertToObjectIdMongodb } = require("../../utils")
const inventoryModel = require("../inventory.model")

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "unknown",
}) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_location: location,
        inven_stock: stock,
    })
}

const revervationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
            inven_productId: convertToObjectIdMongodb(productId),
            inven_stock: { $gte: quantity },
        },
        updateSet = {
            $inc: {
                inven_stock: -quantity,
            },
            $push: {
                inven_reservations: {
                    quantity,
                    cartId,
                    createdOn: new Date(),
                },
            },
        },
        options = {
            upsert: true,
            new: true,
        }

    return await inventoryModel.updateOne(query, updateSet)
}

const addStockToInventory = async ({ shopId, productId, location, stock }) => {
    const query = {
            inven_shopId: shopId,
            inven_productId: productId,
        },
        updateSet = {
            $inc: {
                inven_stock: stock,
            },
            $set: {
                inven_location: location,
            },
        },
        options = {
            upsert: true,
            new: true,
        }
    return await inventoryModel.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
    insertInventory,
    revervationInventory,
    addStockToInventory,
}

"use strict"

const { Api400Error } = require("../core/error.response")
const { addStockToInventory } = require("../models/repositories/inventory.repo")
const { getProductById } = require("../models/repositories/product.repo")

class InVentoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "HCM city",
    }) {
        const product = await getProductById(productId)
        if (!product) throw new Api400Error("product does not exist ")

        return await addStockToInventory({ shopId, productId, stock, location })
    }
}

module.exports = InVentoryService

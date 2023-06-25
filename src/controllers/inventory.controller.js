"use strict"

const { CREATED, SuccessResponse } = require("../core/success.response")
const InVentoryService = require("../services/inventory.service")
class InventoryController {
    /**
     *@desc add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method POST
     * @url /v1/api/cart/user
     * @return {
     * }
     */
    addStockToInventory = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "OK!",
            metadata: await InVentoryService.addStockToInventory(req.body),
        }).send(res)
    }
}

module.exports = new InventoryController()

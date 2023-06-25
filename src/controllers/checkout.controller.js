"use strict"
const { CREATED, SuccessResponse } = require("../core/success.response")
const CheckoutService = require("../services/checkout.service")
class CheckoutController {
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
    checkoutReview = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "OK!",
            metadata: await CheckoutService.checkReview(req.body),
        }).send(res)
    }
}

module.exports = new CheckoutController()

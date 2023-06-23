"use strict"
const { CREATED, SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")
class CartController {
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
    addToCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "create new cart success!",
            metadata: await CartService.addToCart(req.body),
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "update cart success!",
            metadata: await CartService.addToCartV2(req.body),
        }).send(res)
    }

    deleteCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "delete cart success!",
            metadata: await CartService.deleteUserCart(req.body),
        }).send(res)
    }

    listCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "get List cart success!",
            metadata: await CartService.getListCart(req.query),
        }).send(res)
    }
}

module.exports = new CartController()

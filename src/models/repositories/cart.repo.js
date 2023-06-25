"use strict"

const { convertToObjectIdMongodb } = require("../../utils")
const { cart } = require("../cart.model")

/// START REPO CART SERVICE ///
const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: "active" },
        updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        },
        options = {
            upsert: true,
            new: true,
        }

    return await cart.findOneAndUpdate(query, updateOrInsert, options)
}

// update quantity
const updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
            cart_userId: userId,
            "cart_products.productId": convertToObjectIdMongodb(productId),
            cart_state: "active",
        },
        updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity,
            },
        },
        options = {
            upsert: true,
            new: true,
        }

    return await cart.findOneAndUpdate(query, updateSet, options)
}

const deleteUserCart = async ({ userId, productId }) => {
    const query = {
            cart_userId: convertToObjectIdMongodb(userId),
            cart_state: "active",
        },
        updateSet = {
            $pull: {
                cart_products: {
                    productId,
                },
            },
        }
    const deleteCart = await cart.updateOne(query, updateSet)

    return deleteCart
}

const findCartById = async (cartId) => {
    return await cart.findOne({
        _id: convertToObjectIdMongodb(cartId),
        cart_state: "active",
    })
}

const removeProductInCart = async ({ userId, productIds }) => {
    const query = {
            cart_userId: convertToObjectIdMongodb(userId),
            cart_state: "active",
        },
        updateSet = {
            $pull: {
                cart_products: {
                    productId: { $in: productIds },
                },
            },
        }
    const deleteCart = await cart.updateOne(query, updateSet)

    return deleteCart
}

/// END REPO CART SERVICE ///

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart,
    findCartById,
    removeProductInCart,
}

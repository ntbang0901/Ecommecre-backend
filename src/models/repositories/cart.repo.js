"use strict"

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
            "cart_products.productId": productId,
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
            cart_userId: userId,
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
/// END REPO CART SERVICE ///

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart,
}

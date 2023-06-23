"use strict"

const { Api404Error } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const {
    createUserCart,
    updateUserCartQuantity,
    deleteUserCart,
} = require("../models/repositories/cart.repo")
const { getProductById } = require("../models/repositories/product.repo")

/*
    Key features: Cart Service
    - add product to cart [user]
    - reduce product quantity by one [user]
    - increment product quantity by one [user]
    - decrease product quantity by one [user]
    - get cart [user]
    - Delete cart [user]
    - Delete cart item [user]
*/

class CartService {
    static async addToCart({ userId, product = {} }) {
        // check cart exists
        const { productId } = product
        const userCart = await cart.findOne({ cart_userId: userId })
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new Api404Error("Product not exist")
        }

        product = {
            ...product,
            name: foundProduct.product_name,
            price: foundProduct.product_price,
        }

        if (!userCart) {
            // create new cart
            return await createUserCart({ userId, product })
        }

        // nếu có giỏ hàng rồi nhưng chưa có sản phẩm
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // giỏ hàng tồn tại và không có có sàn phẩm này thì add product vào cart_products
        if (userCart.cart_products.length !== 0) {
            return await createUserCart({ userId, product })
        }

        // giỏ hàng tồn tại và có sàn phẩm này thì update quantity
        return await updateUserCartQuantity({ userId, product })
    }

    // update cart
    /*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        old_quantity,
                        price,
                        shopId,
                        productId
                    }
                ]
                version
            }
        ]
    */
    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0].item_products[0]

        // check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) {
            throw new Api404Error("Product not exist")
        }
        //compare product
        if (
            foundProduct.product_shop.toString() !==
            shop_order_ids[0].item_products[0].shopId
        ) {
            throw new Api404Error("Product do not belong to the shop")
        }

        if (quantity === 0) {
            // delete
        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
        })
    }

    static async deleteUserCart({ userId, productId }) {
        console.log({ userId, productId })
        return deleteUserCart({ userId, productId })
    }

    static async getListCart({ userId }) {
        return await cart.findOne({ cart_userId: userId }).lean()
    }
}

module.exports = CartService

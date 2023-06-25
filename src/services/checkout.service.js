"use strict"

const {
    findCartById,
    removeProductInCart,
} = require("../models/repositories/cart.repo")
const { Api400Error, Api404Error } = require("../core/error.response")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const discountModel = require("../models/discount.model")
const { checkDiscountExists } = require("../models/repositories/discount.repo")
const { convertToObjectIdMongodb } = require("../utils")
const { acquirelock, releaseLock } = require("./redis.service")
const { order } = require("../models/order.model")

class CheckoutService {
    /*
        {
            cartId,
            userId,
            shop_order_ids:[
                {
                    shopId,
                    shop_discount:[]
                    item_products:[
                        {
                            productId,
                            price,
                            quantity
                        }
                    ]
                },
                {
                    shopId,
                    shop_discount:[]
                    item_products:[
                        {
                            productId,
                            price,
                            quantity
                        }
                    ]
                }
            ]
        }
    */

    static async checkReview({ userId, cartId, shop_order_ids }) {
        //check cartId có tồn tại hay không
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new Api400Error("cart does not exist")
        const checkout_order = {
                totalPrice: 0, // Tổng tiền hàng
                feeShip: 0, // Phí vận chuyển
                totalDiscount: 0, // Togn63 tiền discount giảm giá
                totalCheckout: 0, // Tổng thanh toán
            },
            shop_order_ids_new = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount, item_products } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer:::`, checkProductServer)

            if (!checkProductServer.length) throw new Api400Error("wrong")

            // tổng tiền đơn hàng
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.quantity * product.price
            }, 0)

            // tổng tiền trước khi xử lý
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice, // tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            //nếu shop_discount tồn tại > 0, check xem có hợp lệ hay không
            if (shop_discount.length > 0) {
                // giả sử chỉ có 1 discount
                // get amount discount

                const { discount_product_ids } = await checkDiscountExists({
                    filter: {
                        discount_code: shop_discount[0].code,
                        discount_shopId: convertToObjectIdMongodb(
                            shop_discount[0].shop_id
                        ),
                    },
                    model: discountModel,
                })

                const newProduct = checkProductServer.filter((product) => {
                    if (discount_product_ids.includes(product.productId)) {
                        return product
                    }
                })

                if (newProduct.length > 0) {
                    const { totalPrice = 0, discount = 0 } =
                        await getDiscountAmount({
                            code: shop_discount[0].code,
                            userId,
                            shopId,
                            products: newProduct,
                        })

                    // tổng cộng discount giảm giá
                    checkout_order.totalDiscount += discount

                    if (discount > 0) {
                        itemCheckout.priceApplyDiscount =
                            checkoutPrice - discount
                    }
                }
            }

            // tổng thanh toán cuối cùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }
    }

    // order
    static async orderByUser({
        userId,
        cartId,
        shop_order_ids,
        user_address,
        user_payment,
    }) {
        const { shop_order_ids_new, checkout_order } =
            await CheckoutService.checkReview({
                cartId,
                userId,
                shop_order_ids,
            })

        // check lại 1 lần nữa xem có vượt tồn kho hay không
        const products = shop_order_ids_new.flatMap(
            (order) => order.item_products
        )
        console.log(`[1]:::`, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquirelock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        // check nếu có 1 sản phẩm hết hàng trong kho
        if (acquireProduct.includes(false))
            throw new Api400Error(
                "một số sản phẩm d94 được cập nhật vui lòng quay lại vỏ hàng"
            )

        const newOrder = order.create({
            order_user_id: userId,
            order_checkout: checkout_order,
            order_shiping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        // trường hợp: nếu insert thành công thì remove products có trong cart
        if (newOrder) {
            // remove product in my cart
            const productIds = products.map((p) => p.productId)
            await removeProductInCart({ userId, productIds })
        }
        return newOrder
    }

    /*
        1 - Query Orders [USER]
    */
    static async getOrdersByUser() {}

    /*
        2 - Query one Order using Id [USER]
    */
    static async getOneOrderByUser() {}

    /*
        3 - CALCEL Order [USER]
    */
    static async cancelOrderByUser() {}

    /*
        4 - Update Order status by  [SHOP | ADMIN]
    */
    static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService

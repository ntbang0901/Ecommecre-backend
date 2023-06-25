"use strict"

const { Api400Error, Api404Error } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { product } = require("../models/product.model")
const {
    updateDiscountById,
    checkDiscountExists,
    findAllDiscountCodesUnSelect,
} = require("../models/repositories/discount.repo")
const {
    findAllProducts,
    getProductById,
    checkProductByServer,
} = require("../models/repositories/product.repo")
const {
    convertToObjectIdMongodb,
    removeUndefinedObject,
    updateNestedObjectParser,
} = require("../utils")

/*
    Discount Services
    1 - Generator Discount Code [Shop | Admin] 
    2 - Get Discount amount [User]
    3 - Get All Discount Codes [User | Shop]
    4 - Verify Discount Code [ User ]
    5 - Delete Discount Code [Shop | Admin]
    6 - Cancel Discount Code [User]
*/

class DiscountService {
    static async createDiscountCode(payload) {
        console.log({ payload })
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            users_used,
            uses_count,
            max_uses_per_user,
        } = payload

        console.log(new Date(start_date))

        if (
            new Date() < new Date(start_date) ||
            new Date() > new Date(end_date)
        ) {
            throw new Api400Error("Discount code has not expired")
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new Api400Error("start_date must be before end_date")
        }

        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: discountModel,
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new Api400Error("Discount exists!")
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_shopId: shopId,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        })

        return newDiscount
    }

    //update Discount
    static async updateDiscountCode(discountId, bodyUpdate) {
        console.log(`[1]:::`, bodyUpdate)
        const objectParams = removeUndefinedObject(bodyUpdate)
        console.log(`[2]:::`, objectParams)
        return await updateDiscountById({
            discountId,
            bodyUpdate: updateNestedObjectParser(objectParams),
        })
    }

    /*
        Get all discount codes avialible with products
    */

    static async getAllDiscountCodesWithProducts({
        code,
        shopId,
        userId,
        limit = 50,
        page = 1,
    }) {
        // create Index for discount_code
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: discountModel,
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new Api404Error("Discount not exists")
        }

        const { discount_product_ids, discount_applies_to } = foundDiscount
        let products
        if (discount_applies_to === "all") {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            })
        }

        if (discount_applies_to === "specific") {
            // get the product ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            })
        }

        return products
    }

    /*
        Get all discount code of shop
    */

    static async getAllDiscountCodesByShop({ limit = 50, page = 1, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            limit: +limit,
            page: +page,
            unSelect: ["__v", "discount_shopId"],
            model: discountModel,
        })

        return discounts
    }

    /*
        Apply discount Code
        products = [
            {
                productId:
                shopId,
                quantity,
                name,
                price
            },
            {
                productId:
                shopId,
                quantity,
                name,
                price
            }
        ]
    */

    static async getDiscountAmount({ code, shopId, userId, products }) {
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: discountModel,
        })

        if (!foundDiscount) throw new Api404Error("discount not exists")
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundDiscount

        if (!discount_is_active) throw new Api404Error("Discount expired")

        if (!discount_max_uses) throw new Api404Error("Discount are out")

        if (
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new Api404Error("Discount code has not expired")
        }

        // const checkProductServer = await checkProductByServer(products)
        // if (!checkProductServer.length) throw new Api400Error("wrong")

        console.log(products)

        // check xem có set giá trị tối thiểu hay chưa
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new Api404Error(
                    `Discount requires a minimum order value of ${discount_min_order_value}`
                )
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(
                (user) => user.userId === userId
            )

            if (userDiscount) {
                // ...
            }
        }

        // check type discount
        const amount =
            discount_type === "fixed_amount"
                ? discount_value
                : totalOrder * (discount_value / 100)

        const totalPrice = totalOrder - amount < 0 ? 0 : totalOrder - amount

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalPrice,
        }
    }

    static async deleteDiscountCode({ shopId, code }) {
        return await discountModel.findByIdAndDelete({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        })
    }

    /*
        Calcel Discount Code
    */
    static async cancelDiscountCode(shopId, code, userId) {
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
            model: discountModel,
        })

        if (!foundDiscount) throw new Api404Error("discount not exists")
        const result = await discountModel.findByIdAndUpdate(
            foundDiscount._id,
            {
                $pull: {
                    discount_users_used: userId,
                },
                $inc: {
                    discount_max_uses: 1,
                    discount_uses_count: -1,
                },
            }
        )

        return result
    }
}

module.exports = DiscountService

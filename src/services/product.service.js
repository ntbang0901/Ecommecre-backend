"use strict"

const { Api400Error } = require("../core/error.response")
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchPeoductByUser,
    findAllProducts,
    findProduct,
} = require("../models/repositories/product.repo")

// define Factory class for create product
class ProductService {
    static productRegistry = {}
    static registryProductType(type, classRef) {
        ProductService.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductService.productRegistry[type]
        if (!productClass)
            throw new Api400Error(`Invalid product types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        console.log(ProductService.productRegistry)
        const productClass = ProductService.productRegistry[type]
        if (!productClass)
            throw new Api400Error(`Invalid product types ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // PUT //

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // ENDPUT //

    // query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static getListSearchProducts = async ({ keySearch }) => {
        return await searchPeoductByUser({ keySearch })
    }

    static findAllProducts = async ({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) => {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: [
                "product_name",
                "product_price",
                "product_thumb",
                "product_shop",
            ],
        })
    }

    static findProduct = async ({ product_id }) => {
        return await findProduct({
            product_id,
            unSelect: ["__v", "product_variations"],
        })
    }
}

/*
    product_name
    product_thumb
    product_description,
    product_price
    product_quantity
    product_type
    product_shop
    product_attributes
*/

module.exports = ProductService

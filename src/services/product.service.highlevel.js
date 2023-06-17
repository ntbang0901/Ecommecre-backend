"use strict"

const { Api400Error } = require("../core/error.response")
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchPeoductByUser,
} = require("../models/repositories/product.repo")

// define Factory class for create product
class ProductService {
    static productRegistry = {}
    static registryProductType(type, classRef) {
        ProductService.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        console.log(ProductService.productRegistry)
        const productClass = ProductService.productRegistry[type]
        if (!productClass)
            throw new Api400Error(`Invalid product types ${type}`)

        return new productClass(payload).createProduct()
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

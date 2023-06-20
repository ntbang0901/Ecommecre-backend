const { clothing } = require("../models/product.model")
const { updateProductById } = require("../models/repositories/product.repo")
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils")
const { Product } = require("./product.factory")

// define class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) throw new Api400Error("create new clothing error")
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new Api400Error("create new product error")

        return newProduct
    }

    // update product
    async updateProduct(productId) {
        /*
       {
        a:null,
        b:undefined,
       } 
       */
        // 1- remove attributes has null undefined
        // 2- check xem update chỗ nào ?

        console.log(`[1];::`, this)
        const objectParams = removeUndefinedObject(this)
        console.log(`[2];::`, objectParams)

        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(
                    objectParams.product_attributes
                ),
                model: clothing,
            })
        }
        //update parent

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        )
        return updateProduct
    }
}
module.exports = {
    Clothing,
}

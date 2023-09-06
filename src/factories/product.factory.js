const { product } = require("../models/product.model")
const { insertInventory } = require("../models/repositories/inventory.repo")
const { updateProductById } = require("../models/repositories/product.repo")
const NotificationService = require("../services/notification.service")

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
// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })

        if (newProduct) {
            // add product stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })
        }
        // push notification to system collection
        NotificationService.pushNotiToSystem({
            type: "SHOP-001",
            receivedId: 1,
            senderId: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_shop,
            },
        })
            .then((rs) => console.log(rs))
            .catch(console.error)

        return newProduct
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({
            productId,
            bodyUpdate,
            model: product,
        })
    }
}

module.exports = {
    Product,
}

const { clothing } = require("../models/product.model")
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
}
module.exports = {
  Clothing,
}

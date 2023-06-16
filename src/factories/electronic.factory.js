const { electronic } = require("../models/product.model")
const { Product } = require("./product.factory")

// define class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElictronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElictronic) throw new Api400Error("create new electronic error")
    const newProduct = await super.createProduct(newElictronic._id)
    if (!newProduct) throw new Api400Error("create new product error")

    return newProduct
  }
}

module.exports = {
  Electronic,
}

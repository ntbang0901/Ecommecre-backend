const { furniture } = require("../models/product.model")
const { Product } = require("./product.factory")

// define class for different product types furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newFurniture) throw new Api400Error("create new cloting error")
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new Api400Error("create new product error")

    return newProduct
  }
}
module.exports = {
  Furniture,
}

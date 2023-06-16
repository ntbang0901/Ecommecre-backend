"use strict"

const { clothing, electronic, product } = require("../models/product.model")
const { Api400Error } = require("../core/error.response")

// define Factory class for create product
class ProductFactory {
  static async createProduct(type, payload) {
    console.log({ type, payload })
    switch (type) {
      case "Electronics":
        return new Electronics(payload).createProduct()
      case "Clothing":
        return new Cloting(payload).createProduct()
      default:
        new Api400Error(`Invalid product types ${type}`)
    }
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
    return await product.create({ ...this, _id: product_id })
  }
}

// define class for different product types Clothing
class Cloting extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newClothing) throw new Api400Error("create new cloting error")
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new Api400Error("create new product error")

    return newProduct
  }
}

// define class for different product types Electronic
class Electronics extends Product {
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

module.exports = ProductFactory

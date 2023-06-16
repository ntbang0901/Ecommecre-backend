"use strict"

const { clothing, electronic, product } = require("../models/product.model")
const { Api400Error } = require("../core/error.response")

// define Factory class for create product
class ProductService {
  static productRegistry = {}
  static registryProductType(type, classRef) {
    ProductService.productRegistry[type] = classRef
  }
  static async createProduct(type, payload) {
    console.log(ProductService.productRegistry)
    const productClass = ProductService.productRegistry[type]
    if (!productClass) throw new Api400Error(`Invalid product types ${type}`)

    return new productClass(payload).createProduct()
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

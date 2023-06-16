const { CREATED, SussessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")

class AccessController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body
    new SussessResponse({
      message: "create new Product success!!",
      metadata: await ProductService.createProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res)
  }
}

module.exports = new AccessController()

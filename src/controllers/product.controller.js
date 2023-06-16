const { CREATED, SussessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.highlevel")

class AccessController {
  createProduct = async (req, res, next) => {
    const { product_type } = req.body
    // new SussessResponse({
    //   message: "create new Product success!!",
    //   metadata: await ProductService.createProduct(product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res)

    new SussessResponse({
      message: "create new Product success!!",
      metadata: await ProductServiceV2.createProduct(product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res)
  }
}

module.exports = new AccessController()

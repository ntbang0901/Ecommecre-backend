const { CREATED, SussessResponse } = require("../core/success.response")
const ProductServiceV2 = require("../services/product.service")

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

    updateProduct = async (req, res, next) => {
        new SussessResponse({
            message: "create new Product success!!",
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SussessResponse({
            message: "publishProductByShop success!!",
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SussessResponse({
            message: "unPublishProductByShop success!!",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res)
    }

    // QUERY //

    /**
     * @desc Get all drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SussessResponse({
            message: "get list Draft success!!",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new SussessResponse({
            message: "get list Publish success!!",
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SussessResponse({
            message: "get list search Product success!!",
            metadata: await ProductServiceV2.getListSearchProducts({
                keySearch: req.params.keySearch,
            }),
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SussessResponse({
            message: "get all Products success!!",
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SussessResponse({
            message: "get Product success!!",
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res)
    }

    // END QUERY //
}

module.exports = new AccessController()

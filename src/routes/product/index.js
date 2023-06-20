"use strict"

const express = require("express")
const productsController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

router.get(
    "/search/:keySearch",
    asyncHandler(productsController.getListSearchProduct)
)

router.get("", asyncHandler(productsController.findAllProducts))
router.get("/:product_id", asyncHandler(productsController.findProduct))

// authentication
router.use(authenticationV2)
router.post("", asyncHandler(productsController.createProduct))
router.patch("/:productId", asyncHandler(productsController.updateProduct))
router.post(
    "/publish/:id",
    asyncHandler(productsController.publishProductByShop)
)
router.post(
    "/unpublish/:id",
    asyncHandler(productsController.unPublishProductByShop)
)

// QUERY //

router.get("/drafts/all", asyncHandler(productsController.getAllDraftsForShop))
router.get(
    "/published/all",
    asyncHandler(productsController.getAllPublishForShop)
)

module.exports = router

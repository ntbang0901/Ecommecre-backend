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

// authentication
router.use(authenticationV2)
router.post("", asyncHandler(productsController.createProduct))
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

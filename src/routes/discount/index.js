"use strict"

const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const discountController = require("../../controllers/discount.controller")
const router = express.Router()

router.post("/amount", asyncHandler(discountController.getDiscountAmount))
router.get(
    "/list_product_code",
    asyncHandler(discountController.getAllDiscountCodesWithProducts)
)

// authentication
router.use(authenticationV2)
router.post("", asyncHandler(discountController.createDiscountCode))
router.get("", asyncHandler(discountController.getAllDiscountCodes))
router.patch(
    "/:discountId",
    asyncHandler(discountController.updateDiscountCode)
)

// QUERY //

module.exports = router

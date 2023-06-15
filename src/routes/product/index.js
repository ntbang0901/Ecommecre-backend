"use strict"

const express = require("express")
const productsController = require("../../controllers/product.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()

// authentication
router.use(authenticationV2)
router.post("", asyncHandler(productsController.createProduct))

module.exports = router

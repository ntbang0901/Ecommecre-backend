"use strict"

const express = require("express")
const accessController = require("../../controllers/access.controller")
const asyncHandler = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")
const router = express.Router()

// Sign up

router.post("/shops/signup", asyncHandler(accessController.signUp))
router.post("/shops/login", asyncHandler(accessController.login))

// authentication
router.use(authentication)
router.post("/shops/logout", asyncHandler(accessController.logout))
router.post(
  "/shops/handlerRefreshToken",
  asyncHandler(accessController.handlerRefreshToken)
)

module.exports = router

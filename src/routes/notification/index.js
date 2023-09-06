"use strict"

const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const motificationController = require("../../controllers/motification.controller")
const router = express.Router()

// authentication
router.use(authenticationV2)
router.get("", asyncHandler(motificationController.listNotiByUser))

// QUERY //

module.exports = router

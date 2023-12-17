"use strict"

const express = require("express")
const asyncHandler = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const uploadController = require("../../controllers/upload.controller")
const { uploadDisk } = require("../../configs/multer.config")
const router = express.Router()

// authentication
// router.use(authenticationV2)
router.get("/product", asyncHandler(uploadController.uploadFile))
router.get("/product/thumb", uploadDisk.single("file"), asyncHandler(uploadController.uploadFileThumb))

// QUERY //

module.exports = router

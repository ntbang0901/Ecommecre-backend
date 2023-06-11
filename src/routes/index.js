"use strict"

const express = require("express")
const { apiKey, permission, asyncHandler } = require("../auth/checkAuth")
const router = express.Router()

// check api key
router.use(asyncHandler(apiKey))
router.use(asyncHandler(permission("1111")))

// check permissions

router.use("/v1/api", require("./access"))

// router.get("/", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome!!!",
//   })
// })

module.exports = router

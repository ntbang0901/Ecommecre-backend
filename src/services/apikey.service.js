"use strict"

const apikeyModel = require("../models/apikey.model")
const crypto = require("crypto")

const findById = async (key) => {
  // const newObj = await apikeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ["0000"],
  // })
  // console.log(newObj)
  const objKey = await apikeyModel.findOne({ key, status: true }).lean()
  return objKey
}

module.exports = {
  findById,
}

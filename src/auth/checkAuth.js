"use strict"

const { Api403Error } = require("../core/error.response")
const { findById } = require("../services/apikey.service")

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
}

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()
  if (!key) {
    throw new Api403Error("Forbidden error")
  }

  // check objKey
  const objKey = await findById(key)
  if (!objKey) {
    throw new Api403Error("Forbidden error")
  }

  req.objKey = objKey
  return next()
}

const permission = (permission) => {
  return (req, res, next) => {
    console.log(req.objKey)

    if (!req.objKey.permissions) {
      throw new Api403Error("Permission denied")
    }

    console.log("Permissions::", req.objKey.permissions)

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      throw new Api403Error("Permission denied")
    }
    return next()
  }
}

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  apiKey,
  permission,
  asyncHandler,
}

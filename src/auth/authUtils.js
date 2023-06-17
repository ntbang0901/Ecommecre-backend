"use strict"

const JWT = require("jsonwebtoken")
const {
  Api401rror,
  Api404Error,
  Api400Error,
} = require("../core/error.response")
const asyncHandler = require("../helpers/asyncHandler")

//service
const { findByUserId } = require("../services/keyToken.service")

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    // level xxx
    // const accessToken = await JWT.sign(payload, privateKey, {
    //   algorithm: "RS256",
    //   expiresIn: "2 days",
    // })

    // const refreshToken = await JWT.sign(payload, privateKey, {
    //   algorithm: "RS256",
    //   expiresIn: "7 days",
    // })

    // level 0 1 2
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    })

    verifyJwt(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err)
      } else {
        console.log(`decode verify::`, decode)
      }
    })

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {}
}

// authentication
/*
        1 - check userid missing
        2 - get ACCESS_TOKEN
        3 - verify token
        4 = check user in db
        5 - check keystore with this userId
        6 - OK all return next
    */

const authentication = asyncHandler(async (req, res, next) => {
  // 1 - check userId
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new Api401rror("Invalid Request")

  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new Api404Error("Not found keyStore")

  // 2 - get ACCESS_TOKEN
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
  if (!accessToken) throw new Api401rror("Invalid Request")

  try {
    // 3- verify token
    const decodeUser = JWT.verify(
      accessToken,
      keyStore.publicKey,
      (err, decode) => {
        if (err) throw new Api401rror("Invalid Request")
        return decode
      }
    )

    //5 - check keystore with this userId

    if (userId !== decodeUser.userId) throw new Api401rror("Invalid UserId")
    req.keyStore = keyStore

    // 6 - OK all return next
    return next()
  } catch (error) {
    throw error
  }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
  console.log("check")
  // 1 - check userId
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new Api401rror("Invalid Request")

  const keyStore = await findByUserId(userId)
  if (!keyStore) throw new Api404Error("Not found keyStore")

  const refreshToken = req.headers[HEADER.REFRESHTOKEN]
  if (refreshToken && req.url.includes("refreshToken")) {
    try {
      // 3- verify token
      const decodeUser = JWT.verify(
        refreshToken,
        keyStore.privateKey,
        (err, decode) => {
          if (err) throw new Api401rror("Invalid Request")
          return decode
        }
      )

      //5 - check keystore with this userId

      if (userId !== decodeUser.userId) throw new Api401rror("Invalid UserId")
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken

      // 6 - OK all return next
      return next()
    } catch (error) {
      throw error
    }
  }

  // 2 - get ACCESS_TOKEN
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new Api401rror("Invalid Request")

  try {
    // 3- verify token
    const decodeUser = JWT.verify(
      accessToken,
      keyStore.publicKey,
      (err, decode) => {
        if (err) throw new Api401rror("Invalid Request")
        return decode
      }
    )

    //5 - check keystore with this userId

    if (userId !== decodeUser.userId) throw new Api401rror("Invalid UserId")
    req.keyStore = keyStore
    req.user = decodeUser
    // 6 - OK all return next
    return next()
  } catch (error) {
    throw error
  }
})

const verifyJwt = async (token, keySecrect) => {
  return await JWT.verify(token, keySecrect)
}

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJwt,
}

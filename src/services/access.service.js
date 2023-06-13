const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJwt } = require("../auth/authUtils")
const { getInfoData, generateKey } = require("../utils")
const {
  Api400Error,
  Api401rror,
  Api403Error,
} = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
}

class AccessService {
  /*
      Check token used
  */

  static handlerRefreshToken = async ({ refreshToken }) => {
    // check xem token đã được sử dụng chưa
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    )
    console.log(foundToken)
    // nếu có
    if (foundToken) {
      // decode xem user nao`
      const { userId, email } = await verifyJwt(
        refreshToken,
        foundToken.privateKey
      )
      console.log(`1--`, { userId, email })
      //xoá tất cả token strong keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw new Api403Error("Something wrong happened !! please relogin")
    }

    const holderToken = await KeyTokenService.findByRefreshToke(refreshToken)
    if (!holderToken) throw new Api401rror("Shop not registered 1 ")

    console.log(holderToken)
    //verify Token
    const { userId, email } = await verifyJwt(
      refreshToken,
      holderToken.privateKey
    )
    console.log(`2--`, { userId, email })
    //check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new Api401rror("Shop not registered 2")

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    )
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    })

    return {
      user: { userId, email },
      tokens,
    }
  }

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new Api403Error("Something wrong happened !! please relogin")
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new Api401rror("Shop not registered 1 ")

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new Api401rror("Shop not registered 2")

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    )
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    })

    return {
      user,
      tokens,
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log({ delKey })
    return delKey
  }

  /*
      1 - check email db
      2 - match password
      3 - create AT vs FR and save
      4 - generate token
      5 - get data return login
  */

  static login = async ({ email, password, refreshToken = null }) => {
    // 1-
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new Api400Error("Shop not Registered")

    // 2
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw Api401rror("Authentication error")

    // 3- create publuckey and privateKey
    const { publicKey, privateKey } = generateKey()

    console.log({ publicKey, privateKey })

    // 4 - generate tokens

    const { _id: userId } = foundShop

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    })

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    }
  }

  static signUp = async ({ name, email, password }) => {
    //step 1: check email exists ??
    const hodelShop = await shopModel.findOne({ email }).lean()
    if (hodelShop) {
      throw new Api400Error("Error: Shop already registered")
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    })

    if (newShop) {
      // created privateKey , publucKey level xxx
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // }) // save colection KeyStore
      //  const keyStore = await KeyTokenService.createKeyToken({
      //    userId: newShop._id,
      //    publicKey: publicKey.toString(),
      //    privateKey: privateKey.toString(),
      //  })

      // created privateKey , publucKey level 0 1 2
      const { publicKey, privateKey } = generateKey()
      const { _id: userId } = newShop

      console.log({ privateKey, publicKey })
      //save colection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId,
        publicKey,
        privateKey,
      })

      if (!keyStore) {
        throw new Api400Error("keyStore error")
        // return {
        //   code: "xxx",
        //   message: "keyStore error",
        // }
      }

      // level xxx
      // convert publicKeyString to publicKeyObject
      // const publicKeyObject = crypto.createPublicKey(publicKeyString)
      // console.log("publicKeyObject", publicKeyObject)
      // const tokens = await createTokenPair(
      //   { userId: newShop._id, email },
      //   publicKeyObject,
      //   privateKey
      // )

      //level 0 1 2
      const tokens = await createTokenPair(
        { userId, email },
        publicKey,
        privateKey
      )

      console.log("Created tokens success::", tokens)

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      }
    }
  }
}

module.exports = AccessService

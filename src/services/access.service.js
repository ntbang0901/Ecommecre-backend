const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { Api400Error } = require("../core/error.response")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITER: "EDITER",
  ADMIN: "ADMIN",
}

class AccessService {
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
      const publicKey = crypto.randomBytes(64).toString("hex")
      const privateKey = crypto.randomBytes(64).toString("hex")

      console.log({ privateKey, publicKey })
      //save colection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
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
        { userId: newShop._id, email },
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

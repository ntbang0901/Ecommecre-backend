"use strict"

const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Key"
const COLECTION_NAME = "Keys"

const KeyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "shop",
    },
    privateKey: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLECTION_NAME,
    timestamps: true,
  }
)

module.exports = model(DOCUMENT_NAME, KeyTokenSchema)

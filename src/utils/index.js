"use strict"
const _ = require("lodash")
const crypto = require("crypto")

const generateKey = () => {
  const publicKey = crypto.randomBytes(64).toString("hex")
  const privateKey = crypto.randomBytes(64).toString("hex")
  return {
    publicKey,
    privateKey,
  }
}

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

module.exports = {
  getInfoData,
  generateKey,
}

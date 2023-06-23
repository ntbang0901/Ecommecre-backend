"use strict"
const _ = require("lodash")
const crypto = require("crypto")
const { Types } = require("mongoose")

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

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object")
            removeUndefinedObject(obj[key])

        if (!obj[key]) {
            delete obj[key]
        }
    })
    return obj
}

const updateNestedObjectParser = (obj) => {
    console.log(`[1]:::`, obj)
    const final = {}
    Object.keys(obj).forEach((key) => {
        console.log(`[3]::`, obj[key])
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key])
            console.log("response::", response)
            Object.keys(response).forEach((a) => {
                console.log(`[4]::`, a)
                final[`${key}.${a}`] = response[a]
            })
        } else {
            final[key] = obj[key]
        }
    })
    console.log(`[2]::`, final)
    return final
}

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id)

module.exports = {
    getInfoData,
    generateKey,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
}

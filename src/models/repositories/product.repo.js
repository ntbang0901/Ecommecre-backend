"use strict"

const { Types } = require("mongoose")
const { product, clothing, electronic, furniture } = require("../product.model")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchPeoductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    console.log(regexSearch)
    const result = await product
        .find(
            {
                isPublished: true,
                $text: {
                    $search: regexSearch,
                },
            },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean()

    return result
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    console.log({ product_shop, product_id })
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })

    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })

    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchPeoductByUser,
}

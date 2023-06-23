"use strict"

const { Types } = require("mongoose")
const { product, clothing, electronic, furniture } = require("../product.model")
const { getSelectData, unGetSelectData } = require("../../utils")
const { Api400Error } = require("../../core/error.response")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const searchPeoductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    try {
        return await product
            .findById(product_id)
            .select(unGetSelectData(unSelect))
    } catch (error) {
        throw new Api400Error("product not found")
    }
}

const updateProductById = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true,
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew,
    })
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

const getProductById = async (productId) => {
    try {
        return await product.findOne({ _id: productId }).lean()
    } catch (error) {
        throw new Api400Error("product not found")
    }
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchPeoductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
}

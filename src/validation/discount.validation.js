"use strict"

const { Api404Error, Api400Error } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { checkDiscountExists } = require("../models/repositories/discount.repo")
const { convertToObjectIdMongodb } = require("../utils")

class DiscountBuilder {
    constructor(start_date, end_date, is_active, max_uses) {
        this.start_date = start_date
        this.end_date = end_date
        this.is_active = is_active
        this.max_uses = max_uses
    }

    checkExpiredDiscount(start_date, end_date) {
        if (
            new Date() < new Date(start_date) ||
            new Date() > new Date(end_date)
        ) {
            throw new Api400Error("Discount code has not expired")
        }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new Api400Error("start_date must be before end_date")
        }
        return this
    }

    checkIsActive(is_active) {
        if (!is_active) throw new Api404Error("Discount expired")
        return this
    }

    checkMaxUsed(max_uses) {
        if (!max_uses) throw new Api404Error("Discount are out")
        return this
    }

    checkDiscountExists(foundDiscount) {
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new Api400Error("Discount exists!")
        }

        return this
    }

    checkDiscountNotExist(foundDiscount) {
        if (!foundDiscount) {
            throw new Api400Error("Discount not exists!")
        }

        return this
    }
}

module.exports = DiscountBuilder

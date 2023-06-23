const { CREATED, SussessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new CREATED({
            message: "DiscountCode created",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res)
    }

    updateDiscountCode = async (req, res, next) => {
        new SussessResponse({
            message: "DiscountCode updated",
            discountId: req.params.discountId,
            metadata: await DiscountService.updateDiscountCode(
                req.params.discountId,
                {
                    ...req.body,
                }
            ),
        }).send(res)
    }

    // QUERY //

    /**
     * @desc Get all drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return { JSON }
     */
    getAllDiscountCodes = async (req, res, next) => {
        new SussessResponse({
            message: "DiscountCode created",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        console.log(req.query)
        new SussessResponse({
            message: "DiscountCode created",
            metadata: await DiscountService.getAllDiscountCodesWithProducts({
                ...req.query,
            }),
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SussessResponse({
            message: "DiscountCode created",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res)
    }

    // END QUERY //
}
module.exports = new DiscountController()

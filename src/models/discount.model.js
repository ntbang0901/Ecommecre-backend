"use strict"

const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Discount"
const COLECTION_NAME = "discounts"

const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String, required: true },
        discount_type: { type: String, default: "fixed_amount" }, // percentage
        discount_value: { type: Number, required: true },
        discount_code: { type: String, required: true },
        discount_start_date: { type: Date, required: true }, // ngày bắt dầu
        discount_end_date: { type: Date, required: true }, // ngày kết thúc
        discount_max_uses: { type: Number, required: true }, // số lượng discount được áo dụng
        discount_uses_count: { type: Number, required: true }, //số discont đã sử dụng
        discount_users_used: { type: Array, default: [] }, // user sử dụng
        discount_max_uses_per_user: { type: Number, required: true }, //số lượng cho phép tối đa được sử dụng mỗi user
        discount_min_order_value: { type: Number, required: true },
        discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },

        discount_is_active: { type: Boolean, default: true },
        discount_applies_to: {
            type: String,
            required: true,
            enum: ["all", "specific"],
        },
        discount_product_ids: { type: Array, default: [] }, // số sảng phẩm được áp dụng
    },
    {
        collection: COLECTION_NAME,
        timestamps: true,
    }
)

module.exports = model(DOCUMENT_NAME, discountSchema)

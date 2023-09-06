"use strict"

const { Api404Error } = require("../core/error.response")
const Comment = require("../models/comment.model")
const { findProduct } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils/index")

class CommentService {
    /**
     Key features Comment Servicce
     + add comment [User, Shop]
     + get list of comments [User,Shop]
     + Delete a comment [User | Shop | Admin]
     */

    static async createComment({
        productId,
        userId,
        content,
        parentCommentId = null,
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId,
        })

        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            console.log(parentComment)
            if (!parentComment)
                throw new Api404Error("parent comment not found")

            rightValue = parentComment.comment_right

            // updateMany comments
            await Comment.updateMany(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                    comment_right: { $gte: rightValue },
                },
                {
                    $inc: { comment_right: 2 },
                }
            )
            // updateMany comments
            await Comment.updateMany(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                    comment_left: { $gt: rightValue },
                },
                {
                    $inc: { comment_left: 2 },
                }
            )
        } else {
            const maxRightValue = await Comment.findOne(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                },
                "comment_right",
                {
                    sort: { comment_right: -1 },
                }
            )
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentByParentId({
        productId,
        parentcommentId = null,
        limit = 50,
        offset = 0,
    }) {
        if (parentcommentId) {
            const parent = await Comment.findById(parentcommentId)
            if (!parent) throw new Api404Error("not found comment for product")
            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_parentId: convertToObjectIdMongodb(parentcommentId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right },
            })
                .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_parentId: 1,
                })
                .sort({
                    comment_left: 1,
                })
            console.log("comments::", comments)
            const newComment = await Promise.all(
                comments.map(async (comment) => {
                    const countComments = await Comment.count({
                        comment_parentId: convertToObjectIdMongodb(comment._id),
                    }).count()

                    const newComment = { ...comment._doc, countComments }
                    return newComment
                })
            )
            return {
                comments: newComment,
            }
        }

        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentId: parentcommentId,
        })
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            })
            .sort({
                comment_left: 1,
            })

        const newComment = await Promise.all(
            comments.map(async (comment) => {
                const countComments = await Comment.count({
                    comment_parentId: convertToObjectIdMongodb(comment._id),
                }).count()

                const newComment = { ...comment._doc, countComments }
                return newComment
            })
        )
        return {
            comments: newComment,
        }
    }

    static async deleteComments({ commentId, productId }) {
        const foundProduct = await findProduct({ product_id: productId })

        if (!foundProduct) throw new Api404Error("Product not found")

        const comment = await Comment.findById(commentId)
        if (!comment) throw new Api404Error("comment not found")

        // 1. Xác định left, right của commentId
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // 2. tính width
        const width = rightValue - leftValue + 1

        //3.  xoá tất cả commentId con
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: {
                $gte: leftValue,
                $lte: rightValue,
            },
        })

        // cập nhật giá trị width right còn lại
        await Comment.updateMany(
            {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: {
                    $gt: rightValue,
                },
            },
            {
                $inc: {
                    comment_right: -width,
                },
            }
        )

        await Comment.updateMany(
            {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: {
                    $gt: rightValue,
                },
            },
            {
                $inc: {
                    comment_left: -width,
                },
            }
        )

        return true
    }
}

module.exports = CommentService

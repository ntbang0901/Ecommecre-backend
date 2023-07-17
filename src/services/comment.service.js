"use strict"

const { Api404Error } = require("../core/error.response")
const Comment = require("../models/comment.model")
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

            console.log("comments + parentcommentId", comments)
            return comments
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

        console.log("comments", comments)
        return comments
    }
}

module.exports = CommentService

"use strict"

const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Comment created",
            metadata: await CommentService.createComment(req.body),
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        console.log(req.query)
        new SuccessResponse({
            message: "get comments successfully!",
            metadata: await CommentService.getCommentByParentId(req.query),
        }).send(res)
    }
}

module.exports = new CommentController()

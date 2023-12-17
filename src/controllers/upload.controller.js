"use strict"
const { Api400Error } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const UploadService = require("../services/upload.service")

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "upload successfully uploaded",
            metadata: await UploadService.uploadImageFromUrl(),
        }).send(res)
    }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new Api400Error("File missing")
        }

        new SuccessResponse({
            message: "upload successfully uploaded",
            metadata: await UploadService.uploadImageFromLocal({
                path: file.path,
            }),
        }).send(res)
    }
}

module.exports = new UploadController()

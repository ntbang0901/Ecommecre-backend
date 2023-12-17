"use strict"

const cloudinary = require("../configs/cloudinary.config")

class UploadService {
    static async uploadImageFromUrl() {
        try {
            const urlImage = "https://cdn.tgdd.vn/Products/Images/42/267212/samsung-galaxy-s21-fe-1.jpg"
            const folderName = "product/shopId",
                newFileName = "testdemo"

            const result = await cloudinary.v2.uploader.upload(urlImage, {
                // public_id:newFileName,
                folder: folderName,
            })

            console.log(result)

            return result
        } catch (error) {
            console.log("error uploading image: " + error)
        }
    }

    static async uploadImageFromLocal({ path, folderName = "product/8049" }) {
        try {
            const result = await cloudinary.v2.uploader.upload(path, {
                public_id: "thumb",
                // public_id:newFileName,
                folder: folderName,
            })

            console.log(result)

            return {
                image_url: result.secure_url,
                shopId: 8049,
                thumb_url: await cloudinary.v2.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: "jpg",
                }),
            }
        } catch (error) {
            console.log("error uploading image: " + error)
        }
    }
}

module.exports = UploadService

// UploadService.uploadImageFromUrl().catch()

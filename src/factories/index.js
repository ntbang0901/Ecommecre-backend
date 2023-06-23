const fs = require("fs")
const ProductService = require("../services/product.service")

const files = fs.readdirSync("./src/factories")

const SUB_FIX_FACTORIES = ".factory.js"
const DOT_SLASH = "./"

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

files.forEach((fileName) => {
    if (fileName.includes(SUB_FIX_FACTORIES)) {
        const moduleName = fileName.replaceAll(SUB_FIX_FACTORIES, "")
        const className = capitalizeFirstLetter(moduleName)
        const obj = require(DOT_SLASH + fileName)
        console.log(obj)
        ProductService.registryProductType(className, obj[className])
    }
})

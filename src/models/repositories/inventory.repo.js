const inventoryModel = require("../inventory.model")

const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "unknown",
}) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_location: location,
        inven_stock: stock,
    })
}
module.exports = {
    insertInventory,
}

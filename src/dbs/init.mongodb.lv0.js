"use strict"

const mongoose = require("mongoose")

const connectString = `mongodb://0.0.0.0:27017/shopDEV`
mongoose
  .connect(connectString)
  .then((_) => {
    return console.log(`Connected mongodb success `)
  })
  .catch((err) => console.log(`Error connect!`, err.message))

module.exports = mongoose

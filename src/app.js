const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const compression = require("compression")
const { checkOverload } = require("./helpers/check.connect")
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// init db

require("./dbs/init.mongodb")
checkOverload()
// init routes

app.get("/", (req, res, next) => {
  const strCompress = "Hellooooo!!"
  return res.status(500).json({
    message: "Welcome!!!",
    metadata: strCompress.repeat(10000),
  })
})

//handle error

module.exports = app

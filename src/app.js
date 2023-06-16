require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const compression = require("compression")
const { checkOverload } = require("./helpers/check.connect")
const { Api404Error } = require("./core/error.response")
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

// init db

require("./dbs/init.mongodb")
checkOverload()

// init routes

app.use(require("./routes"))

//handling error

app.use((req, res, next) => {
  const error = new Api404Error("Resource not found")
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500

  return res.status(statusCode).json({
    status: "error",
    error: statusCode,
    message: error.message || "Internal Server Error",
  })
})

// init factory
const configFactories = require("./factories")
console.log(configFactories)

module.exports = app

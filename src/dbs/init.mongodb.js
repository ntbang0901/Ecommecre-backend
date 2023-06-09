"use strict"

const mongoose = require("mongoose")
const { countConnect } = require("../helpers/check.connect")
const {
  db: { host, name, port },
} = require("../configs/config")
const connectString = `mongodb://${host}:${port}/${name}`

console.log(connectString)

class Database {
  constructor() {
    this.connect()
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true)
      mongoose.set("debug", { color: true })
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        try {
          countConnect()
        } catch (error) {
          console.log(error)
        }
        return console.log(`Connected mongodb success PRO`)
      })
      .catch((err) => console.log(`Error connect!`, err.message))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb

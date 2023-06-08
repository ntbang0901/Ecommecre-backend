"use strict"

const mongoose = require("mongoose")
const process = require("process")
const os = require("os")

const _SECONDS = 5000
// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections: ${numConnection}`)
}

// check overload connect

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCore = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum number of connections based on number of cores

    console.log(`Active connections: ${numConnection}`)
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)

    const maxConnections = numCore * 5
    if (numConnection > maxConnections) {
      console.log("Connection overload detected")
      // notify.send(...)
    }
  }, _SECONDS) // Moniter every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload,
}

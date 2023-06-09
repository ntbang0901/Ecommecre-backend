const app = require("./src/app")

const {
  app: { port },
} = require("./src/configs/config")

const server = app.listen(port, () => {
  console.log(`WSV Ecommerce start with port::${port}`)
})

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server Express"))
  //notify.send("ping.....")
})

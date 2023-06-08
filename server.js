const app = require("./src/app")

const PORT = 3050

const server = app.listen(PORT, () => {
  console.log(`WSV Ecommerce start with port::${PORT}`)
})

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server Express"))
  //notify.send("ping.....")
})

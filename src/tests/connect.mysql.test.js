const mysql = require("mysql2")

// create connection to pool server

const pool = mysql.createConnection({
    host: "localhost",
    user: "ntbang",
    password: "1",
    database: "shopDEV",
})

// perform a sample operation
pool.query("SELECT * from users", function (error, results) {
    if (error) throw error
    console.log("query result: ", results)
    pool.end((err) => {
        if (err) throw err
        console.log("connection closed")
    })
})

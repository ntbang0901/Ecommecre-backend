const mysql = require("mysql2")

// create connection to pool server

const pool = mysql.createConnection({
    host: "localhost",
    user: "ntbang",
    password: "1",
    database: "shopDEV",
})

const batchSize = 100000 // adjust batch size
const totalSize = 10_000_000 // Adjust total size

let currentId = 1

console.time(":::::::::::::TIMER")

const insertBatch = () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++
    }

    if (!values.length) {
        console.timeEnd(":::::::::::::TIMER")

        pool.end((err) => {
            if (err) {
                console.log(`error occurred while running batch`)
            } else {
                console.log(`Connection pool closed successfully`)
            }
        })

        return
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async function (error, results) {
        if (error) throw error

        console.log(`Inserted ${results.affectedRows} records`)
        await insertBatch()
    })
}
insertBatch()
// perform a sample operation
// pool.query("SELECT * from users", function (error, results) {
//     if (error) throw error
//     console.log("query result: ", results)
//     pool.end((err) => {
//         if (err) throw err
//         console.log("connection closed")
//     })
// })

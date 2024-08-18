import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import * as database from "./config/database"
import mainV1Routes from "./api/v1/routes/index.route"

dotenv.config()

database.connect()

const app: Express = express()
const port: number | string = process.env.PORT || 3000

// const corsOptions = {
//     origin: 'http://example.com',
//     optionSuccessStatus: 200
// }

// app.use(cors(corsOptions))

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mainV1Routes(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
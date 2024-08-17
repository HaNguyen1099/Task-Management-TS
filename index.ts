import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import * as database from "./config/database"
import Task from "./models/task.model"

dotenv.config()

database.connect()

const app: Express = express()
const port: number | string = process.env.PORT || 3000

app.get("/tasks", async (req: Request, res: Response) => {
    const tasks = await Task.find({
        deleted: false
    })

    res.json(tasks)
})

app.get("/tasks/detail/:id", async (req: Request, res: Response) => {
    const id = req.params.id

    const task = await Task.find({
        _id: id,
        deleted: false
    })

    res.json(task)
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
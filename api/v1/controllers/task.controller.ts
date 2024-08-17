import { Request, Response } from "express"
import Task from "../models/task.model"

export const index = async (req: Request, res: Response) => {
    interface find {
        deleted: boolean,
        status?: string
    }

    const find: find = {
        deleted: false
    }

    // Filter
    if (req.query.status) {
        find.status = req.query.status.toString()
    }

    // Sort 
    const sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString()
        sort[sortKey] = req.query.sortValue
    }

    const tasks = await Task.find(find).sort(sort)

    res.json(tasks)
}

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id

    const task = await Task.findOne({
        _id: id,
        deleted: false
    })

    res.json(task)
}
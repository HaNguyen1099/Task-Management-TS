import { Request, Response } from "express"
import Task from "../models/task.model"

import paginationHelper from "../../../helpers/pagination"
import searchHelper from "../../../helpers/search"

export const index = async (req: Request, res: Response) => {
    interface find {
        deleted: boolean,
        status?: string,
        title?: RegExp
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

    // Search 
    let objectSearch = searchHelper(req.query)

    if (req.query.keyword) {
        find.title = objectSearch.regex 
    }

    // Pagination 
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    }

    const countTasks = await Task.countDocuments(find)
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTasks
    )

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)

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
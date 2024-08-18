import { Request, Response } from "express"
import Task from "../models/task.model"

import paginationHelper from "../../../helpers/pagination"
import searchHelper from "../../../helpers/search"

// [GET] /api/v1/tasks/
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

// [GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id

    const task = await Task.findOne({
        _id: id,
        deleted: false
    })

    res.json(task)
}

// [PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id 
        const status: string = req.body.status 

        await Task.updateOne({_id: id}, {status: status})

        res.json({
            code: "200",
            message: "Cập nhật trạng thái thành công!"
        })
    } catch (error) {
        res.json({
            code: "400",
            message: "Không tồn tại!"
        })
    }
}

// [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids
        const key: string = req.body.key 
        const value: string = req.body.value 

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                })
                res.json({
                    code: "200",
                    message: "Cập nhật trạng thái thành công!"
                })
                break;
        
            default:
                res.json({
                    code: "400",
                    message: "Không tồn tại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: "400",
            message: "Không tồn tại!"
        })
    }
}

// [POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
    try {
        const product = new Task(req.body)
        const data = await product.save()

        res.json({
            code: "200",
            message: "Tạo thành công!",
            data: data
        })
    } catch (error) {
        res.json({
            code: "400",
            message: "Không tồn tại!"
        })
    }
}
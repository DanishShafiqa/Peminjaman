import { error } from "console";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createBorrowSchema = Joi.object({
    
    user_id: Joi.number().min(1).required(),
    item_id: Joi.number().min(1).required(),
    borrow_date: Joi.date().required(),
    return_date: Joi.date().required()
})

const createBorrowValidation = (req: Request, res: Response, next: NextFunction): any=>{
    console.log(error)
    const validate = createBorrowSchema.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    return next()
}

export{createBorrowValidation}
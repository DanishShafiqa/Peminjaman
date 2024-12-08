import Joi from "joi";
import path from "path";
import { ROOT_DIRECTORY } from "../config";
import fs from "fs"
import { NextFunction, Request, Response } from "express";
import { error } from "console";
console.log(error)
const createSchema = Joi.object({
    
    name: Joi.string().required(),
    category: Joi.string().required(),
    location: Joi.string().required(),
    quantity: Joi.number().min(1).required()
})

const createValidation = (req: Request, res: Response, next: NextFunction):any=>{
    const validation = createSchema.validate(req.body) 
   if(validation.error){
    return res.status(400).json({
        message: validation.error.details.map(item=> item.message).join()
    })
   }
   return next()
}

const updateSchema = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    location: Joi.string().optional(),
    quantity: Joi.number().min(1).optional()
})

const updateValidation = (req: Request, res: Response, next: NextFunction): any=>{
    const validation = updateSchema.validate(req.body)
    if(validation.error){
        return res.status(400).json({
            message: validation.error.details.map(item=>item.message).join()
        })
    }
    return next()
}

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

const createReturnSchema = Joi.object({
    
    borrow_id: Joi.number().min(1).required(),
    return_date: Joi.date().required()
})

const createReturnValidation = (req: Request, res: Response, next: NextFunction): any=>{
    console.log(error)
    const validate = createReturnSchema.validate(req.body)
    if (validate.error) {
        return res.status(400).json({
            message: validate.error.details.map(it => it.message).join()
        })
    }
    return next()
}

const usageReport = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    group_by: Joi.string().valid("category", "location").required(),
});

const usageValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validate = usageReport.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};


export{createValidation, updateValidation, createBorrowValidation, createReturnValidation, usageValidation}

    

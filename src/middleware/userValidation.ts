import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { it } from "node:test";
import { join } from "path";

const createSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(7).required(),
    role: Joi.string().required()
})

const createValidation = (req: Request, res: Response, next: NextFunction): any=>{
   const validation = createSchema.validate(req.body) 
   if(validation.error){
    return res.status(400).json({
        message: validation.error.details.map(item=> item.message).join()
    })
   }
   return next()
}

const updateSchema = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().min(7).optional()
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

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    
})

const authValidation = (req:Request, res: Response, next: NextFunction): any=>{
    const validation = authSchema.validate(req.body)
    if(validation.error){
        return res.status(400).json({
            message: validation.error.details.map(item=> item.message).join()
        })
    }
    return next()
}

export {createValidation, updateValidation, authValidation}
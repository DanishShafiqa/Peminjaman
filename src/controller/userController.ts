import { PrismaClient, user, userRole } from "prisma/prisma-client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { hash } from "crypto";

const prisma = new PrismaClient({ errorFormat: "minimal" })
const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const username : string = req.body.username
        const password : string = req.body.password
        const role     : userRole = req.body.role

        // const username: string = req.body.username
        // const password: string = req.body.password
        const findUsername = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

            
        if (findUsername) {
            return res.status(400).json({  message: `User is already registered`})
        }

        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashPassword,
                role
            }
        })
        return (res.status(200).json({
            message: `new user has been created`,
            data: newUser
        }))
    } catch (error) {
        return res.status(500).json(error)
    }
}

const readUser = async (req: Request, res: Response): Promise<any>=> {
    try {
        const search = req.query.search
        //get all medicine
        const allUser = await prisma.user.findMany({
            where: {
                OR: [
                    { username: {contains: search?.toString() || "" } },
                ]
            }
        })
        return res.status(200).json({
            message: `User has been retrived`,
            data: allUser
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        const findUser = await prisma.user.findFirst(
            { where: { id: Number(id)}
        })
    if(!findUser) {
        return res.status(200).json({
            message: `User is not found`
        })
    }
    const {username, password } = req.body
    const saveUser = await prisma.user
        .update({
            where: { id: Number(id) },
            data: {
                username: username ? username: findUser.username,
                password: password ? await bcrypt.hash(password, 7)
                : findUser.password
            }
        })
        return res.status(200).json({ 
            message: `User has been updated`,
            data: saveUser
        })
    } catch (error) {
        return res.status(500).json(error)
    }

}

const deleteUser = async (req: Request, res: Response):Promise<any> => {
        try {
            const id = req.params.id
            const findUser= await prisma.user
        .findFirst({
            where: { id: Number(id) }
        })
    if (!findUser) { //! not
        return res.status(200)
        .json({ message: `User is not found` })
    }

    const saveUser= await prisma.user.delete({
        where: { id: Number(id) }
    })
    return res.status(200).json({
        message: `User has been removed`,
        data: saveUser
    })
    } catch (error) {
        return res.status(500).json(error)
    }
}



const authentication = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body
        const findUser = await prisma.user.findFirst({ where: { username } })
        if (!findUser) {
            return res.status(200).json({
                message: `User in not registered`
            })
        }

        const matchPassword = await bcrypt.compare(password, findUser.password)
        if (!matchPassword) {
            return res.status(200).json({
                message: `Invalid Password`
            })
        }
        const payload = {
            username: findUser.username,
            role: findUser.role
        }

        const signature = process.env.SECRET || ``
        const token = await jwt.sign(payload, signature)

        return res.status(200).json({
            message: "login berhasil",
            id: findUser.id,
            username: findUser.username,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


export{createUser, readUser, updateUser, deleteUser, authentication}
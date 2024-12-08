import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { Request, Response } from "express";

const prisma = new PrismaClient({errorFormat: "minimal"})

const createInventory = async(req: Request, res: Response): Promise<any>=>{
    try {
        const name: string = req.body.name
        const category: string = req.body.category
        const location: string = req.body.location
        const quantity: number = Number(req.body.quantity)

        const newInventory = await prisma.inventory.create({
            data: {name, category, location, quantity}
        })
        return res.status(200).json({
            status: `Success`,
            message: `Barang berhasil ditambahkan`,
            data: newInventory
        })
    } catch (error) {
        return res.status(500).json((error as Error).message)
    }
}

const updateInventory = async (req: Request, res: Response): Promise<any>=>{
    try {
        const id = req.params.id
        const findInventory = await prisma.inventory.findFirst({where:{id: Number(id)}})
        if(!findInventory){
            return res.status(200).json({
                message: `Inventory is not found`
            })
        }

        const {name, category, location, quantity}=req.body

        const saveInventory = await prisma.inventory.update({
            where:{id:Number(id)},
            data:{
                name: name?name:findInventory.name,
                category: category? category:findInventory.category,
                location: location? location:findInventory.location,
                quantity: quantity?Number(quantity): findInventory.quantity
            }
        })

        return res.status(200).json({
            status: `Success`,
            message: `Barang berhasil diubah`,
            data: saveInventory
        })
    } catch (error) {
        return res.status(500).json((error as Error).message)
    }
}

const readInventory = async(req: Request, res: Response): Promise<any>=>{
    try {
        const search = req.query.search
        const allInventory = await prisma.inventory.findMany({
            where:{
                OR: [{name: {contains: search?.toString()||""}}]
            }
        })

        return res.status(200).json({
            status: `Success`,
            data: allInventory
        })
    } catch (error) {
        return res.status(500).json((error as Error).message)
    }
}

const deleteInventory = async(req: Request, res: Response): Promise<any>=>{
    try {
        const id = req.params.id
        const findInventory = await prisma.inventory.findFirst({
            where: {id: Number(id)}
        })

        if(!findInventory){
            return res.status(404).json({
                message: `item is not found`
            })
        }

        await prisma.inventory.delete({
            where:{id:Number(id)}
        })

        return res.status(200).json({
            message: `item has been deleted`
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}




export {createInventory, updateInventory, readInventory, deleteInventory}
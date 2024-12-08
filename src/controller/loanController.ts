import exp from "constants";
import { Request, Response } from "express";
import { PrismaClient } from "prisma/prisma-client";

const prisma =new PrismaClient({errorFormat: `minimal`})

const createBorrow = async (req: Request, res: Response): Promise<any>=>{
    try {
        const{user_id, item_id, borrow_date, return_date}= req.body

        const allBorrow = await prisma.loan.create({
            data: {
                user_id: user_id,
                item_id: item_id,
                borrow_date: new Date(borrow_date),
                return_date: new Date(return_date),
            }
        })
        return res.status(200).json({
            message:"peminjaman berhasil dicatat",
            data: allBorrow
        })

    } catch (error) {
        return res.status(500).json(error)
    }
}

const createReturn = async(req: Request, res: Response): Promise<any>=>{
    console.log()
        try {
            const borrow_id = req.body.borrow_id

            const findBorrow = await prisma.loan.findFirst({
                where: {borrow_id: Number(borrow_id)}
            })

            if(!findBorrow){
                return res.status(400).json({message: "Peminjaman tidak tersedia"})
            }

            const return_date : Date = new Date(req.body.return_date)
            const createReturn = await prisma.returnn.create({
                data: {
                    borrow_id: Number(borrow_id),
                    actual_return_date: return_date,
                    user_id: findBorrow.user_id,
                    item_id: findBorrow.item_id
                }
            })

            return res.status(200).json({
                message: `Pengembalian berhasil dicatat`,
                data: createReturn
            })
    
            
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    

export {createBorrow, createReturn}
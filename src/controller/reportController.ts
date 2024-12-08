import { Request, Response } from "express";
import { object } from "joi";
import { PrismaClient } from "prisma/prisma-client";

const prisma =new PrismaClient({errorFormat: `minimal`})

const analyzeUsage = async(req:Request, res: Response): Promise<any>=>{
    try {
        const{start_date, end_date, qroup_by}= req.body

        const borrowDate = await prisma.loan.findMany({
            where: {
                borrow_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                }
            },
            include: {item_detail: true}
        })

        const returnDate = await prisma.returnn.findMany({
            where: {
                actual_return_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                }
            }
        })

        const groupedData = borrowDate.reduce((acc: Record<string, any>, borrow): any => {
            const group = borrow.item_detail[qroup_by as keyof typeof borrow.item_detail] as string; // Type assertion
            if (!acc[group]) {
                acc[group] = {
                    group,
                    total_borrowed: 0,
                    total_returned: 0,
                    items_in_use: 0,
                };
            }

            acc[group].total_borrowed++;
            if (returnDate.some((r) => r.borrow_id === borrow.borrow_id)) {
                acc[group].total_returned++;
            } else {
                acc[group].items_in_use++;
            }

            return acc;
        }, {});

        // Ubah objek menjadi array
        const usageAnalysis = Object.values(groupedData);

        // Format respons
        res.status(200).json({
            status: "success",
            data: {
                analysis_period: {
                    start_date,
                    end_date,
                },
                usage_analysis: 
                usageAnalysis,
            },
        });
       
    } catch (error) {
        return res.status(500).json(error)
    }
}

const analyzeItemUsage = async(req: Request, res: Response):Promise<any>=>{
    try {
        const {start_date, end_date}= req.body

        const borrowDate = await prisma.loan.findMany({
            where: {
                borrow_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                }
            },
            include: {
                item_detail: true
            }
        })

        const  returnDate = await prisma.returnn.findMany({
            where: {
                actual_return_date: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                }
            }
        })

        const frequentlyBorrowed: Record<number,any> ={}
        borrowDate.forEach((borrow)=>{
            const item_id = borrow.item_id
            if(!frequentlyBorrowed[item_id]){
                frequentlyBorrowed[item_id]={
                    item_id: item_id,
                    name: borrow.item_detail.name,
                    category: borrow.item_detail.category,
                    total_borrowed: 0
                }
            }
            frequentlyBorrowed[item_id].total_borrowed
        })

        const inefficientItem: Record<number, any>={}
        borrowDate.forEach((borrow)=>{
            const item_id = borrow.item_id
            if (!inefficientItem[item_id]){
                inefficientItem[item_id]={
                    item_id: item_id,
                    name: borrow.item_detail.name,
                    category: borrow.item_detail.category,
                    total_borrowed: 0,
                    total_late_returns: 0
                }
            }

            inefficientItem[item_id].total_borrowed++

            const returnn = returnDate.find((r)=>r.borrow_id === borrow.borrow_id)
            if (returnn&&new Date(returnn.actual_return_date)> new Date(borrow.return_date)){
                inefficientItem[item_id].total_late_returns
            }
        })
        const frequentlyBorrowedArray = Object.values(frequentlyBorrowed)
        const inefficientItemArray = Object.values(inefficientItem).filter(
            (item: any)=> item.total_late_returns>0
        )

        return res.status(200).json({
            data:{
                analysis_period : {
                    start_date,
                    end_date
                },
                frequently_Borrowed_items: frequentlyBorrowedArray,
                inefficient_Items: inefficientItemArray
            }
        })
    
    } catch (error) {
        return res.status(500).json(error)
    }
}

export{ analyzeUsage, analyzeItemUsage}
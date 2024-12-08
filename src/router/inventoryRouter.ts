import { Router } from "express";
import { createInventory, deleteInventory, readInventory, updateInventory } from "../controller/inventoryController";
import { createBorrowValidation, createReturnValidation, createValidation, updateValidation, usageValidation } from "../middleware/inventoryValidation";
import { createBorrow, createReturn } from "../controller/loanController";
import { analyzeItemUsage, analyzeUsage } from "../controller/reportController";
import { authorizeAdmin, verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`,[authorizeAdmin ,createValidation], createInventory)
router.put(`/:id`,[authorizeAdmin ,updateValidation], updateInventory)
router.get(`/`, [authorizeAdmin],readInventory)
router.delete(`/:id`,[authorizeAdmin], deleteInventory)
router.post(`/borrow`,[createBorrowValidation], createBorrow)
router.post(`/return`,[createReturnValidation], createReturn)
router.post(`/usage-report`,[authorizeAdmin ,usageValidation], analyzeUsage)
router.post(`/borrowAnalysis`, [authorizeAdmin],analyzeItemUsage)

export default router
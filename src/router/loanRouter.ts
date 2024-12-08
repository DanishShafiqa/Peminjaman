import { Router } from "express";
import { createBorrow } from "../controller/loanController";
// import { createValidation } from "../middleware/loanValidation";

const router = Router()
// router.post(`/`,[createValidation], createBorrow)

export default router
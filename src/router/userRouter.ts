import { Router } from "express";
import { authentication, createUser, deleteUser, readUser, updateUser} from "../controller/userController";
import { verifyToken } from "../middleware/authorization";
import { authValidation, createValidation, updateValidation } from "../middleware/userValidation";

const router = Router()
router.post(`/`, [createValidation], createUser)
router.get(`/`, [verifyToken],readUser)
router.put(`/:id`,[verifyToken], updateUser)
router.delete(`/:id`, [verifyToken],deleteUser)
router.post(`/auth`, [authValidation], authentication)

export default router
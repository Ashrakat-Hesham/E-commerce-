import { Router } from "express";
import * as userController from'./controller/user.js'
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./user.endPoint.js";
const router = Router()




router.get('/', userController.getUsers)
router.delete('/:id',auth(endPoint.deleteUser),userController.deleteUser)



export default router
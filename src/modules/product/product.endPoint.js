import { roles } from "../../middleware/auth.js";



export const endPoint={
    create:roles.admin,
    update:roles.admin,
    wishList:roles.user
}
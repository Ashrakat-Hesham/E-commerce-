import { roles } from "../../middleware/auth.js";

export const endPoint={
    create:[roles.admin],
    update:[roles.admin],
    delete:[roles.admin]
}
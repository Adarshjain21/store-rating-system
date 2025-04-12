import { db } from "../index.js";

export const storeOwner = async (req,res,next) => {
    try {
        const userId = req.userId

        const user =  await db.user.findUnique({
            where: { id: userId }
        });

        if(user.role !== 'STORE_OWNER'){
            return res.status(400).json({
                message: "Permission denial",
                error: true,
                success: false
            })
        }

        req.userId = user.id
        next()
    } catch (error) {
        return res.status(500).json({
            message: 'Permission denial',
            error: true,
            success: false
        })
    }
}
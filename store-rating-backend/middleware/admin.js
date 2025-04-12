import { db } from "../index.js";

export const admin = async (req,res,next) => {
    try {
        const userId = req.userId

        const user =  await db.user.findUnique({
            where: { id: userId }
        });

        if(user.role !== 'SYSTEM_ADMIN'){
            return res.status(400).json({
                message: "Permission denial",
                error: true,
                success: false
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message: 'Permission denial',
            error: true,
            success: false
        })
    }
}
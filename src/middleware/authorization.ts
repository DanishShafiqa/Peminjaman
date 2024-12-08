import exp from "constants"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const header = req.headers.authorization
        const [type, token] = header?
        header.split(""): []

        //verify 
        const signature = process.env.SECRET || '';
        const isVerified = jwt.sign(token,signature)
        if (!isVerified){
            return res.status(401).json({
                message: `Token tidak valid`
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

interface JwtPayload {
    id: number;
    role: string;
}
const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized, token is missing" });
            return;
        }
        const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer"
        const signature = process.env.SECRET || "" // Ganti dengan kunci rahasia JWT Anda
        // Verifikasi dan decode token
        const decoded = jwt.verify(token, signature) as JwtPayload;
        // Periksa role dari payload
        if (decoded.role != "Admin") {
            res.status(403).json({ message: "Forbidden, only admins can perform this action" });
            return;
        }
        // Lolos validasi, lanjut ke handler berikutnya
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error });
    }
};

export{verifyToken, authorizeAdmin}
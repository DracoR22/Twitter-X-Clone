import jwt from "jsonwebtoken"
import { Response } from "express"

export const generateTokenAndSetCookie = (userId: any, res: Response, jwtSecret: string) => {
    const token = jwt.sign({ userId }, jwtSecret, {
        expiresIn: '15d'
    })

    res.cookie('jwt', token, {
        maxAge: 15 * 14 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
}
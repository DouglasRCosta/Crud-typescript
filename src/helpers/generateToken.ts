import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()
export default {
    generateToken():string {
        return jwt.sign({}, process.env.JWT_SECRET || '', { expiresIn: "600h" })
    }
}
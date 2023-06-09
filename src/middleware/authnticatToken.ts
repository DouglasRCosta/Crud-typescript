import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            console.error(err);
            return res.sendStatus(401);
        }
        next();
    });
}

export default authenticateToken
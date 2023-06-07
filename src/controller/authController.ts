import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../model/userModel";
import hashPass from "../helpers/hashPass";

import generateId from "../helpers/generateId";
import tokenGenerate from "../helpers/generateToken";
import { userModel } from "../types";




export default {
    signUp: async (req: Request, res: Response) => {

        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(402).json({ error: error.array() });
        }
        //verificar sem vem dados no body-------------------------------

        const { firstName, lastName, email, password } = req.body;
        if (!(firstName && lastName && email && password)) {
            return res.json({ access: false });
        }

        // verificar se email já está cadastrado--------
        const result = await User.findOne({ where: { email: email } })
        if (result) {
            return res.json({ email: false });
        }


        // criar hash passWord e user =----------------

        const hashPassword = await hashPass.encript(password)
        const ids = await generateId.generateUserId()

        const user = {
            private_id: ids[0],
            public_id: ids[1],
            firstName,
            lastName,
            email,
            password: hashPassword,
            token: tokenGenerate.generateToken(),
        };

        //salvar user--------------------------------------------------
        const save = await User.create(user);


        const token = save.token;
        const expiryDate = new Date(Date.now() + 60 * 100000000);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 60 * 100000000,
            expires: expiryDate,
        });
        res.json({token})

    },
    signIn: async (req: Request, res: Response) => {

        // verificar se existe email e password no body-------
        const { email, password } = req.body
        if (!(email && password)) {
            return res.json({ err: 'precisa de email e senha' })

        }
        //verificar se existe cadastro --------------------
        const result: userModel | null = await User.findOne({ where: { email: email } })

        if (!result) {
            return res.json({ err: 'email não cadastrado' })

        }
        /// comparar password--------------------------
        const verificar = await hashPass.compararHash(password, result.password)
        if (!verificar) {
            return res.json({ err: 'email e/ou senha incorretos' })
        }
        //gerar novo token -----------------------
        result.token = tokenGenerate.generateToken()
        await result.save()

        // token-----------------------------------
        let token = result.token;
        const expiryDate = new Date(Date.now() + 60 * 100000000);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 60 * 100000000,
            expires: expiryDate,
        });
        return res.json({token});

    }
}
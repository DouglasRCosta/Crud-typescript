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
            return res.status(400).json({ error: error.array() });
        }
        try {

            //verificar sem vem dados no body-------------------------------

            const { firstName, lastName, email, password } = req.body;
            if (!(firstName && lastName && email && password)) {
                return res.status(400).json({ err: ' Dados obrigatórios não fornecidos' });
            }

            // verificar se email já está cadastrado--------
            const result = await User.findOne({ where: { email: email } })
            if (result) {
                return res.status(409).json({ err: 'Email já cadastrado' });
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
            res.cookie("p_id", save.public_id, {
                httpOnly: true,
                maxAge: 60 * 100000000,
                expires: expiryDate,
            });
            res.cookie("U_name", save.firstName, {
                httpOnly: true,
                maxAge: 60 * 100000000,
                expires: expiryDate,
            });


            res.json({ token })

        } catch (err) {
            console.log('<catch signUp authController>'+ err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }

    },
    signIn: async (req: Request, res: Response) => {
        try {
            // verificar se existe email e password no body-------
            const { email, password } = req.body
            if (!(email && password)) {
                return res.status(400).json({ err: ' Dados obrigatórios não fornecidos' })

            }
            //verificar se existe cadastro --------------------
            const result: userModel | null = await User.findOne({ where: { email: email } })

            if (!result) {
                return res.status(404).json({ err: 'email não cadastrado' })

            }
            /// comparar password--------------------------
            const verificar = await hashPass.compararHash(password, result.password)
            if (!verificar) {
                return res.status(422).json({ err: 'email e/ou senha incorretos' })
            }
            //gerar novo token -----------------------
            result.token = tokenGenerate.generateToken()
            await result.save()

            // cookies-----------------------------------
           
            const expiryDate = new Date(Date.now() + 60 * 100000000);
            res.cookie("jwt", result.token, {
                httpOnly: true,
                maxAge: 60 * 100000000,
                expires: expiryDate,
            });
            res.cookie("p_id", result.public_id, {
                httpOnly: true,
                maxAge: 60 * 100000000,
                expires: expiryDate,
            });
            res.cookie("U_name", result.firstName, {
                httpOnly: true,
                maxAge: 60 * 100000000,
                expires: expiryDate,
            });
            return res.json({ token:result.token });


        } catch (err) {
            console.log('<catch signIn authController>'+err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }

    }
}
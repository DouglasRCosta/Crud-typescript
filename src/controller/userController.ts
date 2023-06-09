import { Request, Response } from "express";
import User from "../model/userModel";
import { userModel } from "../types";
import { validationResult } from "express-validator";

import hashPass from "../helpers/hashPass";


export default {
    /** ******************
* 
* Método abaixo
*/
    async getUser(req: Request, res: Response) {
        try {
            //obter usuario de modo publico-------------------------------------
            let id = req.params.id || req.query.id || 0;
            const result: userModel | null = await User.findOne({ where: { public_id: id } });

            if (!result) return res.status(404).json({ error: "usuario nao encontrado" });

            return res.json({ firstName: result.firstName, lastName: result.lastName });
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }

    },
    /** ******************
* 
* Método abaixo
*/
    async me(req: Request, res: Response) {
        try {
            // obter usuario com dados pessoais------------------------------------
            const token = req.cookies.jwt;
            const result: userModel | null = await User.findOne({ where: { token } });
            if (!result) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            return res.json({
                id: result.public_id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
            });
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }

    },
    /** ******************
* 
* Método abaixo
*/
    async editMe(req: Request, res: Response) {

        try {
            // lidar com error validation
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({ error: error.array() });
            }
            interface type { firstName?: string, lastName?: string, email?: string, password?: string | boolean }
            const { firstName, lastName, email, password }: type = req.body;
            const json: type = {}
            const token = req.cookies.jwt

            //verificar se existe User pelo token
            const result = await User.findOne({ where: { token } })
            if (!result) {
                return res.status(404).json({ error: 'Usuário não encontrado.' })
            }
            // alterar dados 
            if (firstName) {
                result.firstName = firstName
                json.firstName = firstName
            }
            if (lastName) {
                result.lastName = lastName
                json.lastName = lastName
            }

            if (email) {
                const temp = await User.findOne({ where: { email } })
                if (temp) return res.status(409).json({ error: 'email já cadastrado' })

                result.email = email
                json.email = email
            }
            if (password && typeof password == 'string') {
                result.password = await hashPass.encript(password)
                json.password = true
            }
            await result.save()
            res.json(json)
        } catch (err) {
            console.error(err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }
    },
    /** ******************
* 
*  Método abaixo
*/
    async deleteUser(req: Request, res: Response) {
        try {
            // extrai os dados
            const token = req.cookies.jwt
            const { email, password }: { email: string, password: string } = req.body

            // verifica se estão presente
            if (!token ||!email || !password) {
                res.status(400).json({ error: 'Dados não enviados corretamente.' })
                return
            }
            // verifica a existencia do Usuario : User sequelize
            const result = await User.findOne({ where: { token } })
            if (!result) {
                res.status(404).json({ error: 'Usuário não encontrado.' })
                return
            }
            // verifica se email e password são iguais  :: compararHash usa bcrypt
            if(email == result?.email && await hashPass.compararHash(password, result.password)){
                await result.destroy()
                return
            }
            res.status(422).json({error:'Dados fornecidos incorretos'})
            return

        } catch (err) {
            console.error(err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }
    }
}
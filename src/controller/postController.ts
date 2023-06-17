import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Post from "../model/postModel";
import User from "../model/userModel";
import Like from "../model/likeModel";
import hashPass from "../helpers/hashPass";
import { isArrayBufferView } from "util/types";

//// event Emiter


export default {
    /** ******************
* 
* Método abaixo
*/
    async get(req: Request, res: Response) {
        try {
            // verifica se possui um id e buscar por id
            const { id, page } = req.query
            if (id) {
                const resultByid = await Post.findOne({ where: { post_id: id } })
                if (resultByid) {
                    res.json(resultByid)
                    return
                }
                res.status(404).json({ error: 'post não encontrado!' })
                return
            }

            if (page) {

                let limit = 15
                // busca por pagina ----   o sinal de -  no if função de inverter o numero negativos assim como verificar se é um NaN
                // o -1 na conversão para colocar ajustar o offset corretamente
                let pageInt: number = (parseInt(page.toString()) - 1)

                if (isNaN(pageInt)) {
                    pageInt = 0;
                } else if (pageInt < 0) {
                    pageInt = -pageInt;
                }

                const resultByPage = await Post.findAll({ offset: pageInt * limit, limit, order: [['createdAt', 'DESC']] })
                if (resultByPage.length < 1) {
                    res.status(404).json({ erro: 'sem dados' });
                    return
                }
                res.json(resultByPage)
                return
            }
            const result = await Post.findAll({ offset: 0, limit: 15, order: [['createdAt', 'DESC']] })
            res.json(result)
            return

        } catch (err) {
            console.error("<catch get postController>" + err)
            res.status(500).json({ err: 'Ocorreu um erro interno ' })
        }
    },
    /** ******************
* 
* Método abaixo
*/
    async getMy(req: Request, res: Response) {
        try {
            // obter todos seus post
            const token = req.cookies.jwt
            const { page } = req.query
            const result = await User.findOne({ where: { token } })
            if (result) {
                let pag = page || 0
                let pageInt: number = (parseInt(pag.toString()))

                if (isNaN(pageInt)) {
                    pageInt = 0;
                } else if (pageInt < 0) {
                    pageInt = -pageInt;
                }
                const posts = await Post.findAll({ offset: pageInt * 15, limit: 15, order: [['createdAt', 'DESC']], where: { user: result.public_id } })
                if (posts.length < 1) {
                    res.json({ msg: 'não há posts aqui !' })
                    return
                }
                res.json(posts)
                return
            }
            res.status(404).json({ error: 'usuário não encontrado!' })
            return
        } catch (err) {
            console.error("<catch getMy postController>" + err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }
    },
    /** ******************
* 
* Método abaixo
*/
    async like(req: Request, res: Response) {
        try {
            const { id } = req.body
            const token = req.cookies.jwt
            

            // verifica a presença do token e id

            if (!(id && token)) {
                return res.status(400).json({ err: ' Dados obrigatórios não fornecidos' })
            }

            // verifica se há post com esse id
            const post = await Post.findOne({ where: { post_id: id }, attributes: ['likes','post_id'] })
            if (!post) {
                return res.status(404).json({ err: 'Post não encontrado !' })
            }

            // verifica se há Usuário com o token
            const user = await User.findOne({ where: { token }, attributes: ['public_id'] })
            if (!user) {
                return res.status(404).json({ err: 'Usuário não encontrado !' })
            }

            // verifica se já a um like se tiver ele remove caso contrário adiciona
            const like = await Like.findOne({ where: { user: user.public_id } })
            if (like) {
                await like.destroy()
                post.likes = post.likes - 1
                await post.save()

                res.json({ like: false })
                return
            }
            await Like.create({ user: user.public_id, post: id})
            post.likes++
            await post.save()
            res.json({ like: true })
            return

        } catch (err) {
            console.error("<catch like postController>" + err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }
    },
    /** ******************
* 
* Método abaixo
*/
    async create(req: Request, res: Response) {
        //validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            //obtendo token, title e content
            const token = req.cookies.jwt
            const { title, content }: { title: string, content: string } = req.body
            const result = await User.findOne({ where: { token } })

            //verificando existencia do usuario,title e content  
            if (result && token && title && content.length < 250) {
                let post = {
                    title,
                    content,
                    user: result.public_id,
                    likes: 0
                }

                // salvando post
                const save = await Post.create(post)
                res.status(200).json(save)
                return
            }

            res.status(400).json({ err: ' Dados obrigatórios não fornecidos' })
            return
        } catch (err) {
            console.error("<catch Post postController>" + err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }

    },
    /** ******************
* 
* Método abaixo
*/
    async deletePost(req: Request, res: Response) {
        try {
            const token = req.cookies.jwt
            const { password, postId }: { password: string, postId: number } = req.body

            if (!(token && password)) {
                res.status(400).json({ err: ' Dados obrigatórios não fornecidos' })
                return
            }
            const result = await User.findOne({ where: { token } })
            if (!result) {
                res.status(404).json({ err: 'Usuário não encontrado.' })
                return
            }
            if (!(await hashPass.compararHash(password, result.password))) {
                res.status(404).json({ err: 'Senha incorreta.' })
                return
            }
            const post = await Post.findOne({ where: { post_id: postId } })
            if (!post) {
                res.status(404).json({ err: 'Post não encontrado.' })
                return
            }
            await post.destroy()
            res.json({ deleted: true })
            return

        } catch (err) {
            console.error("<catch deletePost postController>" + err)
            res.status(500).json({ err: 'Ocorreu um erro interno' })
        }
    }
}
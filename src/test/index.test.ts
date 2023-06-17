import { describe, before, after, it } from 'node:test'
import assert from 'node:assert'
import db from '../database/mysql/index'
import User from '../model/userModel';
import Post from '../model/postModel';
import Like from '../model/likeModel';

let url = 'http://localhost:4000/';

let _server = {}
let _token = ''
let _postid = ''

async function makeRequestGET(url: string) {
    const request = await fetch(url,{
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `jwt=${_token}`
        }
    })

    return request.json()
}
async function makeRequest(url: string, method: string = 'POST', data: {}) {
    const request = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `jwt=${_token}`
        },
        body: JSON.stringify(data)
    })

    return request.json()
}
/* ***********
*
*
*/
describe('API tests------------------------------------------------------------------------', async () => {

    before(async () => {
        await User.sync()
        await Post.sync()
        await Like.sync()
        _server = (await import('../server'))
    })

    it('<<<<<<<<<<<<- deve retornar pong true', async () => {
        const request = await makeRequestGET(`${url}ping`)

        assert.deepEqual(request.pong, 1)
    })
    it('<<<<<<<<<<<<- deve negar o post ', async () => {
        const request = await makeRequest(`${url}user/signup`, undefined, {})

        assert.notDeepEqual(request.error.length, 0)
    })
    it('<<<<<<<<<<<<- deve criar um user e retornar um token  ', async () => {
        const request = await makeRequest(`${url}user/signup`, 'POST', { firstName: "douglas", lastName: "rodrigues", email: "teste@teste.com", password: "123456" })
        _token = request.token

        assert.deepEqual(('token' in request), true)
    })
    it('<<<<<<<<<<<<- deve logar e retornar um token  ', async () => {
        const request = await makeRequest(`${url}user/signin`, 'POST', { email: "teste@teste.com", password: "123456" })
        _token = request.token

        assert.deepEqual(('token' in request), true)
    })
    it('<<<<<<<<<<<- deve editar email,firstName e lastName', async () => {
        const put = { firstName: "douglasAlterado", lastName: "rodriguesAlterado", email: "testeAlterado@teste.com" }
        const request = await makeRequest(`${url}user/me`, 'PUT', put)

        assert.deepEqual(put, request)
    })
    it('<<<<<<<<<<<- deve editar o password', async () => {
        const put = { password: '654321' }
        const request = await makeRequest(`${url}user/me`, 'PUT', put)

        assert.deepEqual(request.password, true)
    })
    it('<<<<<<<<<<<<-deve criar um post ', async () => {

        const request = await makeRequest(`${url}post`, 'POST', { title: 'teste', content: 'conteudo do post' })
        _postid = request.post_id
        assert.deepEqual(request.title, 'teste')
    })
    it('<<<<<<<<<<<<-deve buscar um post por query', async () => {
        const request = await makeRequestGET(`${url}post?id=${_postid}`)

        assert.deepEqual(_postid, request.post_id)
    })
    it('<<<<<<<<<<<<-deve buscar um post por query page', async () => {
        const request = await makeRequestGET(`${url}post?page=1`)
        assert.ok(request.length > 0)
    })
    it('<<<<<<<<<<<<-deve buscar post dos usuários', async () => {
        const request = await makeRequestGET(`${url}post/my`)
        assert.ok(request.length > 0)
    })
    it('<<<<<<<<<<<<-deve dar like no post', async () => {
        const request = await makeRequest(`${url}post/like`,'POST',{id:_postid})
        assert.ok(request.like)
    })
    it('<<<<<<<<<<<<-deve delertar o post', async () => {
        const request = await makeRequest(`${url}post`,'DELETE',{password:'654321',postId:_postid})
        assert.ok(request.deleted)
    })
    it('<<<<<<<<<<<- deve deletar o usuario', async () => {
        const put = { email: "testeAlterado@teste.com", password: '654321' }
        const request = await makeRequest(`${url}user/me`, 'DELETE', put)

        assert.deepEqual(request.delete, true)
        assert.deepEqual(request.msg, "Usuário deletado com sucesso.")
    })

})  
/* ***********
*
*
*/
describe('database', async () => {
    before(async () => {
        await User.sync()
        await Post.sync()
        await Like.sync()
    })

    it('<<<<<<<<<<<<-deve autenticar o database', async () => {
        let info
        try {
            await db.authenticate();
            info = true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            info = false
        }

        assert.deepEqual(info, 1)
    })


})
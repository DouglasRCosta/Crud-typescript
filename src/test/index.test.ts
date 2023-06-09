import { describe, before, after, it } from 'node:test'
import assert from 'node:assert'
import db from '../database/mysql/index'

let url = 'http://localhost:4000/';
let _server = {}
let _token = ''

async function makeRequestGET(url: string) {
    const request = await fetch(url)

    return request.json()
}
async function makeRequestPOST(url: string, data: {}) {
    const request = await fetch(url, {
        method: 'POST',
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
describe('API tests', async () => {
 
    before(async () => {
        _server = (await import('../server'))
    })

    it('<<<<<<<<<<<<- deve retornar pong true', async () => {
        const request = await makeRequestGET(`${url}ping`)

        assert.deepEqual(request.pong, 1)
    })
    it('<<<<<<<<<<<<- deve negar o post ', async () => {
        const request = await makeRequestPOST(`${url}user/signup`, {})

        assert.notDeepEqual(request.error.length, 0)
    })
    it('<<<<<<<<<<<<- deve criar um user e retornar um token  ', async () => {
        const request = await makeRequestPOST(`${url}user/signup`, { firstName: "douglas", lastName: "rodrigues", email: "teste@teste.com", password: "123456" })
        _token = request.token
   
        assert.deepEqual(('token' in request), true)
    })
    it('<<<<<<<<<<<<- deve logar e retornar um token  ', async () => {
        const request = await makeRequestPOST(`${url}user/signin`, {email: "teste@teste.com",  password: "123456" })
        _token = request.token
   
        assert.deepEqual(('token' in request), true)
    })

})
/* ***********
*
*
*/
describe('database', async () => {
    before(async () => {

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
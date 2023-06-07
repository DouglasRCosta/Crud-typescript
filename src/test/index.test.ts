import { describe, before, after, it } from 'node:test'
import assert from 'node:assert'
import db from '../database/mysql/index'

let url = 'http://localhost:4000/';

async function makeRequestGET(url: string) {
    const request = await fetch(url)

    return request.json()
}
async function makeRequestPOST(url: string, data: {}) {
    const request = await fetch(url, { method: 'POST', body: JSON.stringify(data) })

    return request.json()
}

describe('API tests', async () => {
    let _server = {}

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
    it('<<<<<<<<<<<<- deve criar um user  ', async () => {
        const request = await makeRequestPOST(`${url}user/signup`, { firstName:"douglas", lastName:"rodrigues", email:"teste@teste.com", password: "123456" })
        console.log(JSON.stringify(request))
        assert.notDeepEqual(request.error.length, 0)


    })

})

describe('database', async () => {


    before(async () => {

    })

    it('<<<<<<<<<<<<-deve autenticar o database', async () => {
        let info
        try {
            await db.authenticate();
            console.log('Connection has been established successfully.');
            info = true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            info = false
        }

        assert.deepEqual(info, 1)
    })


})
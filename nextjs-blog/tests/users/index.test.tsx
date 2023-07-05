import "@testing-library/jest-dom"
let id = ""

import connectMongo from '../../backend/utils/connectMongo'
import user from '../../pages/api/users/[id]'
import users from '../../pages/api/users/index'

describe('testing users endpoints', () => {
    test("post user", async () => {
        const json = jest.fn()
        const status = jest.fn(() => {
            return {
                json
            }
        })
        const req = {
            method: "POST",
            body:
            {
                email: "testuser@example.com",
                password: "testkaaarl",
                firstName: "testhannes",
                lastName: "testmeister",
                birthdate: "20.10.2000",
            }
        }
        const res = {
            status
        }
        await users(req, res)
        id = json.mock.calls[0][0].id
        const createdUsers = json.mock.calls[0][0]
        expect(createdUsers.email).toBe("testuser@example.com")
        expect(createdUsers.firstName).toBe("testhannes")
    })

    test('get users', async () => {
        const json = jest.fn()
        const status = jest.fn(() => {
            return {
                json
            }
        })
        const req = {
            method: "GET",
        }
        const res = {
            status
        }
        await users(req, res)
        expect(json.mock.calls[0][0][0].email).toBe("admin@test.com")
        expect(json.mock.calls[0][0].length).toBeGreaterThan(0)
    })

    test(`get user with id ${id}`, async () => {
        const json = jest.fn()
        const status = jest.fn(() => {
            return {
                json
            }
        })
        const req = {
            method: "GET",
            query: { id: id },
        }
        const res = {
            status
        }
        await user(req, res)
        const getUser = json.mock.calls[0][0]
        expect(getUser.email).toBe("testuser@example.com")
        expect(getUser.firstName).toBe("testhannes")
        expect(getUser.lastName).toBe("testmeister")
    })

    test('update user', async () => {
        const json = jest.fn()
        const status = jest.fn(() => {
            return {
                json
            }
        })
        const req = {
            method: "PUT",
            query: { id: id },
            body: {
                id: id,
                firstName: "klaus",
                lastName: "Tisch",
            }
        }
        const res = {
            status
        }
        await user(req, res)
        const updatedUser = json.mock.calls[0][0]
        expect(updatedUser.firstName).toEqual("klaus")
        expect(updatedUser.lastName).toEqual("Tisch")
    })
    afterAll(async () => {
        //const res = await request(baseUrl).delete(`/api/events/${id}`)
        const json = jest.fn()
        const status = jest.fn(() => {
            return {
                json
            }
        })
        const req = {
            method: "DELETE",
            query: { id: id },
        }
        const res = {
            status
        }
        await user(req, res)
        connectMongo.closeMongo()
    })
})


import "@testing-library/jest-dom"
let id = ""

import connectMongo from '../../backend/utils/connectMongo'
import event from '../../pages/api/events/[id]'
import events from '../../pages/api/events/index'

describe('testing events endpoints', () => {
    beforeAll(async () => {
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
                title: "Starlight Express",
                description: "Kein anderes Musical verbindet Generationen so, wie STARLIGHT EXPRESS. Seit sensationellen 34 Jahren begeistert das Meisterwerk von Andrew Lloyd Webber schon Alt und Jung und das weltweit einmalig nur in Bochum.",
                location: "Stadionring 24.D - 44791 Bochum",
                date: "2022-05-11T20:00:00.000Z",
                duration: 2,
                price: 60.50,
                maxPaxEvent: 2000
            }
        }
        const res = {
            status
        }
        await events(req, res)
        id = json.mock.calls[0][0].id
        const createdEvent = json.mock.calls[0][0]
        expect(createdEvent.title).toBe("Starlight Express")
        expect(createdEvent.price).toBe(60.50)
    })

    test('wrong post event', async () => {
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
                titleFalse: "Starlight Express",
                description: "Kein anderes Musical verbindet Generationen so, wie STARLIGHT EXPRESS. Seit sensationellen 34 Jahren begeistert das Meisterwerk von Andrew Lloyd Webber schon Alt und Jung und das weltweit einmalig nur in Bochum.",
                location: "Stadionring 24.D - 44791 Bochum",
                date: "2022-05-11T20:00:00.000Z",
                duration: 2,
                price: 60.50,
                maxPaxEvent: 2000
            }
        }
        const res = {
            status
        }
        await events(req, res)
        const result = json.mock.calls[0][0][0]
        expect(result.code).toBe("invalid_type")
        expect(result.path[0]).toBe("title")
    })
    test('get events', async () => {
        const json = jest.fn()
        const status = jest.fn(() => {
            return {
                json
            }
        })
        const req = {
            method: "GET"
        }
        const res = {
            status
        }
        await events(req, res)
        expect(json.mock.calls[0].length).toBeGreaterThan(0)
    })

    test(`get event with id ${id}`, async () => {
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
        await event(req, res)
        const getEvent = json.mock.calls[0][0]
        expect(getEvent.title).toBe("Starlight Express")
        expect(getEvent.description).toBe("Kein anderes Musical verbindet Generationen so, wie STARLIGHT EXPRESS. Seit sensationellen 34 Jahren begeistert das Meisterwerk von Andrew Lloyd Webber schon Alt und Jung und das weltweit einmalig nur in Bochum.")
        expect(getEvent.price).toBe(60.5)
    })

    test('update event', async () => {
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
                maxPaxEvent: 1000,
                date: "2022-05-13T22:00:00.000Z"
            }
        }
        const res = {
            status
        }
        await event(req, res)
        const updatedEvent = json.mock.calls[0][0]
        expect(updatedEvent.date).toEqual(new Date("2022-05-13T22:00:00.000Z"))
    })
    afterAll(async () => {
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
        await event(req, res)
        connectMongo.closeMongo()
    })
})


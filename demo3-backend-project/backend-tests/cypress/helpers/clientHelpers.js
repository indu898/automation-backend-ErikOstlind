const faker = require('faker')
const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_NEW_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_NEW_CLIENT = 'http://localhost:3000/api/client/new'
const ENPOINT_SPECIFIC_ROOM = 'http://localhost:3000/api/room/'

function createRandomClientPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }

    return payload
}
function createRandomClient() {
    cy.authenticateSession().then((response => {
        let fakeClientPayload = createRandomClientPayload()
        // post request to create a client
        cy.request({
            method: "POST",
            url: ENDPOINT_NEW_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
            expect(response.status).to.eq(200)
        }))
        getRequestAllClientsWithAssertions(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)
    }))
}

function getRequestAllClientsWithAssertions(cy, name, email, telephone) {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(name)
        expect(responseAsString).to.have.string(email)
        expect(responseAsString).to.have.string(telephone)
        expect(response.status).to.eq(200)
    }))
}

function createRandomRoomPayload() {
    const features = ["ensuite"]
    const category = 'double'
    const fakeNumber = faker.random.number()
    const fakeFloor = faker.random.number()
    const available = true
    const fakePrice = faker.random.number()

    const payload = {
        "features": features,
        "category": category,
        "number": fakeNumber,
        "floor": fakeFloor,
        "available": available,
        "price": fakePrice
    }
    return payload
}

function createRandomRoom() {
    cy.authenticateSession().then((response => {
        let fakeRoomPayload = createRandomRoomPayload()
        // post request to create a ROOM
        cy.request({
            method: "POST",
            url: ENDPOINT_NEW_ROOM,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeRoomPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeRoomPayload.price)
            expect(response.status).to.eq(200)
        }))
        getRequestAllRoomsWithAssertions(cy, fakeRoomPayload.features, fakeRoomPayload.category, fakeRoomPayload.number, fakeRoomPayload.floor, fakeRoomPayload.available, fakeRoomPayload.price)
    })
    )
}
function getAllRooms() {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {

        expect(response.status).to.eq(200)
    }))
}
function getRequestAllRoomsWithAssertions(cy, features, category, number, floor, available, price) {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        const responseAsString = JSON.stringify(response)
        expect(response.status).to.eq(200)
        expect(responseAsString).to.have.string(features)
        expect(responseAsString).to.have.string(category)
        expect(responseAsString).to.have.string(number)
        expect(responseAsString).to.have.string(floor)
        expect(responseAsString).to.have.string(available)
        expect(responseAsString).to.have.string(price)
    }))
}
function editLastCreatedRoom() {

    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            let lastId = response.body[response.body.length - 1].id
            const roomTestPayload = {
                "id": lastId,
                "features": ["testFeature"],
                "category": 'testcategory',
                "number": '666',
                "floor": '999',
                "available": 'true',
                "price": '6969'

            }
            cy.request({
                method: "PUT",
                url: ENPOINT_SPECIFIC_ROOM + lastId,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
                body: roomTestPayload
            })
            getRequestAllRoomsWithAssertions(cy, roomTestPayload.features, roomTestPayload.category, roomTestPayload.number, roomTestPayload.floor, roomTestPayload.available, roomTestPayload.price)
        }))

    }))
}
function deleteLastRoom() {
    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },

        }).then((response => {
            cy.log(response.body.length)
            let lastId = response.body[response.body.length - 1].id
            cy.request({
                method: "DELETE",
                url: ENPOINT_SPECIFIC_ROOM + lastId,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                }

            }).then((response => {
                expect(response.status).to.eq(200)
            }))

        }))
        //Check that body length is restored to original value of 2
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            cy.log(response.body.length)
            cy.expect(response.body).to.have.length(2)
            expect(response.status).to.eq(200)
        }))
    }))
}

module.exports = {
    createRandomClientPayload,
    getRequestAllClientsWithAssertions,
    createRandomRoomPayload,
    getRequestAllRoomsWithAssertions,
    createRandomRoom,
    createRandomClient,
    deleteLastRoom,
    editLastCreatedRoom,
    getAllRooms
}
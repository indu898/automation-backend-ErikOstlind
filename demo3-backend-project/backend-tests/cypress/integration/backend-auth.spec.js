/// <reference types="cypress"/>

import { fake } from 'faker'
import * as clientHelpers from '../helpers/clientHelpers'
import { createRandomClient } from '../helpers/clientHelpers'

describe('testing auth', function () {

    it('Create a new client', function () {
        clientHelpers.createRandomClient()
    })

    it('TS02 Create a new room POST', function () {
        clientHelpers.createRandomRoom()
    })
    it('TS03 Edit room', function () {
        clientHelpers.editLastCreatedRoom()
    })
    it('TS04 get all rooms', function () {
        clientHelpers.getAllRooms()
    })

    it('TS05 Delete room', function () {
        clientHelpers.deleteLastRoom()
    })

})
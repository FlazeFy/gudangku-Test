// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Inventory', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - All Inventory', () => {
        cy.request({
            method: method,
            url: 'api/v1/inventory',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllInventory')
        cy.get('@' + method + 'AllInventory').then(inv => {
            cy.templateGet(inv, false)
        })
    })

    it(method.toUpperCase() + ' - All List', () => {
        cy.request({
            method: method,
            url: 'api/v1/inventory/list',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllList')
        cy.get('@' + method + 'AllList').then(inv => {
            cy.templateGet(inv, false)
        })
    })

    it(method.toUpperCase() + ' - All Calendar', () => {
        cy.request({
            method: method,
            url: 'api/v1/inventory/calendar',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllCalendar')
        cy.get('@' + method + 'AllCalendar').then(inv => {
            cy.templateGet(inv, false)
        })
    })
})
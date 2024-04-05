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
})
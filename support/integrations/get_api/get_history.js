// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - History', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - All History', () => {
        cy.request({
            method: method,
            url: 'api/v1/history',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllHistory')
        cy.get('@' + method + 'AllHistory').then(his => {
            cy.templateGet(his, false)
        })
    })
})
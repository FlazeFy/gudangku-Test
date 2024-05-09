// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Report', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - All Report', () => {
        cy.request({
            method: method,
            url: 'api/v1/report',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllReport')
        cy.get('@' + method + 'AllReport').then(his => {
            cy.templateGet(his, false)
        })
    })
})
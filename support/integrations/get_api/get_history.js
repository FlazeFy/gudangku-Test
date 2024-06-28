// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - History', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - All History', () => {
        const url = 'api/v1/history'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllHistory')
        cy.get('@' + method + 'AllHistory').then(dt => {
            cy.templateGet(dt, true)
            cy.templatePagination(url, dt.body.data.last_page)

            // Get item holder
            const resultItem = dt.body.data
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['id','history_type','history_context','created_at','created_by']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
        })
    })
})
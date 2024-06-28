// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Report', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - All Report', () => {
        const url = 'api/v1/report'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllReport')
        cy.get('@' + method + 'AllReport').then(dt => {
            cy.templateGet(dt, true)
            cy.templatePagination(url, dt.body.data.last_page)

            // Get item holder
            const resultItem = dt.body.data
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['id','report_title','report_category','created_at','report_items']
            const intFields = ['is_reminder','total_variety','total_item','item_price']
            const stringNullableFields = ['remind_at','report_desc']
 
            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', false)
            cy.templateValidateColumn(dataArr, stringNullableFields, 'string', true)
        })
    })
})
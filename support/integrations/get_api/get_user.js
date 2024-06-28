// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - User', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - My Profile', () => {
        cy.request({
            method: method,
            url: 'api/v1/user/my_profile',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'MyProfile')
        cy.get('@' + method + 'MyProfile').then(dt => {
            cy.templateGet(dt, null)

            // Get item holder
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('object')

            // Get list key / column
            const stringFields = ['username','email','created_at']
            const stringNullableFields = ['telegram_user_id']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, stringNullableFields, 'string', false)
        })
    })
})
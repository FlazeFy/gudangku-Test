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
        cy.get('@' + method + 'MyProfile').then(user => {
            cy.templateGet(user, null)
        })
    })
})
// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Inventory', () => {
    // Template
    const id = '09397f65-211e-3598-2fa5-b50cdba5183c'
    const method = 'put'
    const token = generateAuthToken("hardcode")

    // Check db first!

    it(method.toUpperCase() + ' - Favorite Toogle', () => {
        const builder = {
            "is_favorite": 1,
        }

        cy.request({
            method: method,
            url: '/api/v1/inventory/fav_toggle/'+id,
            form: true,
            body: builder,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'FavoriteToogle')
            cy.get('@' + method + 'FavoriteToogle').then(res => {
            cy.templatePut(res)
        })
    })

    it(method.toUpperCase() + ' - Recover Inventory', () => {
        cy.request({
            method: method,
            url: '/api/v1/inventory/recover/'+id,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'RecoverInventory')
            cy.get('@' + method + 'RecoverInventory').then(sts => {
                cy.templatePut(res)
        })
    })
})
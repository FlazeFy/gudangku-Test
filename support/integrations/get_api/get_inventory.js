// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Inventory', () => {
    // Template
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - All Inventory', () => {
        const url = 'api/v1/inventory'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllInventory')
        cy.get('@' + method + 'AllInventory').then(dt => {
            cy.templateGet(dt, true)
            cy.templatePagination(url, dt.body.data.last_page)

            // Get item holder
            const resultItem = dt.body.data
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['id','inventory_name','inventory_category','inventory_room','inventory_unit','created_at','created_by']
            const intFields = ['inventory_price','is_favorite','is_reminder']
            const stringNullableFields = ['inventory_desc','inventory_merk','inventory_storage','inventory_rack','inventory_image','inventory_capacity_unit','updated_at','deleted_at']
            const intNullableFields = ['inventory_vol','inventory_capacity_vol']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', false)
            cy.templateValidateColumn(dataArr, stringNullableFields, 'string', true)
            cy.templateValidateColumn(dataArr, intNullableFields, 'number', true)

            // Contain
            const typeBool = [0,1]
            const typeCategory = ['Food And Beverages','Office Tools','Skin & Body Care','Fashion','Kitchen Appliances']
            const typeUnit = ['Kilogram','Ml','Liter','Pcs','Gram']
            const typeRoom = ['Bathroom','Terrace','Car Cabin','Main Room']
            cy.templateValidateContain(dataArr, typeBool, 'is_favorite')
            cy.templateValidateContain(dataArr, typeBool, 'is_reminder')
            cy.templateValidateContain(dataArr, typeCategory, 'inventory_category')
            cy.templateValidateContain(dataArr, typeUnit, 'inventory_unit')
            cy.templateValidateContain(dataArr, typeRoom, 'inventory_room')
        })
    })

    it(method.toUpperCase() + ' - All List', () => {
        const url = 'api/v1/inventory/list'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllList')
        cy.get('@' + method + 'AllList').then(dt => {
            cy.templateGet(dt, false)

            // Get item holder
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['id','inventory_name','inventory_unit']
            const intFields = ['inventory_vol']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', true)
        })
    })

    it(method.toUpperCase() + ' - All Calendar', () => {
        const url = 'api/v1/inventory/calendar'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'AllCalendar')
        cy.get('@' + method + 'AllCalendar').then(dt => {
            cy.templateGet(dt, false)

            // Get item holder
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['inventory_name','created_at']
            const intFields = ['inventory_price']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', false)
        })
    })
})
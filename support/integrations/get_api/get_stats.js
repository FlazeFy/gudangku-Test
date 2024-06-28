// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Stats', () => {
    // Template
    const is_paginate = false
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - Total Inventory By Category', () => {
        const url = 'api/v1/stats/total_inventory_by_category'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'TotalInventoryByCategory')
        cy.get('@' + method + 'TotalInventoryByCategory').then(dt => {
            cy.templateGet(dt, is_paginate)

            // Get item holder
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['context']
            const intFields = ['total']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', false)
        })
    })

    it(method.toUpperCase() + ' - Total Inventory By Favorite', () => {
        const url = 'api/v1/stats/total_inventory_by_favorite'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'TotalInventoryByFavorite')
        cy.get('@' + method + 'TotalInventoryByFavorite').then(dt => {
            cy.templateGet(dt, is_paginate)

            // Get item holder
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['context']
            const intFields = ['total']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', false)
        })
    })

    it(method.toUpperCase() + ' - Total Inventory By Room', () => {
        const url = 'api/v1/stats/total_inventory_by_room'
        cy.request({
            method: method,
            url: url,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'TotalInventoryByRoom')
        cy.get('@' + method + 'TotalInventoryByRoom').then(dt => {
            cy.templateGet(dt, is_paginate)

            // Get item holder
            const resultItem = dt.body
            expect(resultItem).to.have.property('data')
            const dataArr = resultItem.data
            expect(dataArr).to.be.an('array')

            // Get list key / column
            const stringFields = ['context']
            const intFields = ['total']

            // Validate column
            cy.templateValidateColumn(dataArr, stringFields, 'string', false)
            cy.templateValidateColumn(dataArr, intFields, 'number', false)
        })
    })
})
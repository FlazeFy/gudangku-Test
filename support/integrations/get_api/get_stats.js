// Components
import { generateAuthToken } from '../../components/generator'
import '../../components/template'

describe('GudangKu API Testing - Stats', () => {
    // Template
    const is_paginate = false
    const method = 'get'
    const token = generateAuthToken("hardcode")

    it(method.toUpperCase() + ' - Total Inventory By Category', () => {
        cy.request({
            method: method,
            url: 'api/v1/stats/total_inventory_by_category',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'TotalInventoryByCategory')
        cy.get('@' + method + 'TotalInventoryByCategory').then(sts => {
            cy.templateGet(sts, is_paginate)
        })
    })

    it(method.toUpperCase() + ' - Total Inventory By Favorite', () => {
        cy.request({
            method: method,
            url: 'api/v1/stats/total_inventory_by_favorite',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'TotalInventoryByFavorite')
        cy.get('@' + method + 'TotalInventoryByFavorite').then(sts => {
            cy.templateGet(sts, is_paginate)
        })
    })

    it(method.toUpperCase() + ' - Total Inventory By Room', () => {
        cy.request({
            method: method,
            url: 'api/v1/stats/total_inventory_by_room',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).as(method + 'TotalInventoryByRoom')
        cy.get('@' + method + 'TotalInventoryByRoom').then(sts => {
            cy.templateGet(sts, is_paginate)
        })
    })
})
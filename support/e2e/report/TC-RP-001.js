// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-RP-001 - Report', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat List Report', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Report
            cy.get('#nav_report_btn').click()
            cy.url().should('include','/report')
            // Evidence - Step 1
            cy.screenshot(`TC-RP-001_Step-1-${date}`)

            // Step 2: Terdapat sebuah list report yang berisi Report Title, Description, List Items, Category, Total Item, Total Price, dan Created At
            cy.get('#report_holder .report-box').each(($el) => {
                // Report Title
                cy.wrap($el).find('h2').should('exist').and('not.be.empty')
                // Report Category
                cy.wrap($el).find('.report-category').should('exist').and('not.be.empty')
                // Report Description
                cy.wrap($el).get('.report-desc').invoke('text').then((text) => {
                    const trimmed = text.trim()
                    expect(trimmed).to.satisfy(t => t === '- No Description Provided -' || t.length > 0)
                })                 
                // Report Created At
                cy.wrap($el).find('h6.date-text').should('exist').and('not.be.empty')
                // Total Price
                cy.wrap($el).get('.report-category').invoke('text').then((text) => {
                    const trimmed = text.trim()
                    if(trimmed == 'Shopping Cart' || trimmed == 'Wishlist'){
                        // Total Price
                        cy.wrap($el).get('.total-price h3').contains('Total Price').should('exist').then($h3 => {
                            cy.wrap($h3).next('h3').should('exist').and('not.be.empty')
                        })
                        // Total Item
                        cy.wrap($el).get('.total-item h3').contains('Total Item').should('exist').then($h3 => {
                            cy.wrap($h3).next('h3').should('exist').and('not.be.empty')
                        })
                    }
                })
                // List Items
                cy.wrap($el).get('.report-items').invoke('text').then((text) => {
                    const trimmed = text.trim()
                    expect(trimmed).to.satisfy(t => t === '- No Items Found -' || t.length > 0)
                }) 
            })
        })
    })
})

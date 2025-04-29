// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-AL-001 - Analyze', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    // Remove this later!
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('Pengguna Dapat Melihat Hasil Analisis Harga Inventory', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-AL-001_Step-1-${date}`)

            // Step 2: Pada table inventory, pilih item pertama dan tekan tombol edit
            cy.get('#inventory_tb tbody .inventory-tr').not('.deleted-inventory').first().then($el => {
                cy.wrap($el).find('.btn-manage').click()
            })
            cy.url().should('include','/inventory/edit')

            // Step 3: Pada halaman edit / detail, pengguna menekan tombol "Analyze"
            cy.screenshot(`TC-AL-001_Step-3-${date}`)
            cy.get('#edit_toolbar-section').contains('a', 'Analyze').click()
            cy.url().should('include','/analyze/inventory')

            // Step 4: Pada halaman analisis, pengguna dapat melihat hasil analisis harga berupa Expensive Status, Average Price, dan Price Difference to Average
            cy.get('.swal2-popup:not(.swal2-loading)', { timeout: 10000 }).should('not.exist')
            cy.screenshot(`TC-AL-001_Step-4-${date}`)
            cy.get('#price_analyze-section').within(() => {
                cy.contains('h3','The Price')

                // Inventory Name
                cy.get('.inventory_name').each($el => {
                    cy.wrap($el).invoke('text').then((text) => {
                        expect(text.trim()).to.not.equal("")
                    })
                })
                // Expensive Status
                cy.get('#expensiveness_holder').invoke('text').then((text) => {
                    const trimmed = text.trim()
                    expect(trimmed).to.satisfy(t => t === 'Expensive' || t === 'Cheap')
                })    
                // Average Price, Price Difference
                cy.get('#diff_price_status').invoke('text').then((text) => {
                    const trimmed = text.trim()
                    expect(trimmed).to.satisfy(t => t === 'More Exspensive' || t === 'More Cheaper')
                })
                const check_price = ['diff_price_ammount','inventory_price_avg']
                check_price.forEach(dt =>{
                    cy.get(`#${dt}`).invoke('text').then((text) => {
                        expect(text.trim().startsWith('Rp. ')).to.be.true
                        const numericText = text.replace('Rp. ', '').replace(/\./g, '')
                        const total = parseFloat(numericText)
                        expect(total).to.be.a('number')
                    })
                })
            })
        })
    })
})

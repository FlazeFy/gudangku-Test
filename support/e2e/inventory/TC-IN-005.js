// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-005 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    // Remove this later!
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('Pengguna Dapat Mengatur Status Favorite Inventory Via Edit Page', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-005_Step-1-${date}`)

            // Step 2: Pada table inventory, pilih inventory pertama yang memiliki status 'Favorite' dan tidak dalam kondisi deleted. Kemudian tekan tombol edit
            cy.get('#inventory_tb tbody .inventory-tr').not('.deleted-inventory').first().then($el => {
                const favorite_status = Cypress.$($el).find('.favorite-status').text().trim()

                if (favorite_status.includes('Favorite')) {
                    cy.wrap($el).find('.btn-manage').click()
                    return false 
                }
            })

            // Step 3: Pada toolbar button, tekan tombol dengan icon heart
            cy.url().should('include','/inventory/edit')
            cy.get('.btn-toggle-favorite', { timeout: 5000 }).should('exist').click()

            // Step 4: Sistem akan menampilkan pesan "inventory updated"
            cy.get('.swal2-popup', { timeout: 5000 }).should('exist').then(() => {
                cy.get('.swal2-html-container').invoke('text').then((text)=>{
                    expect(text).to.equal('inventory updated')
                })
                // Evidence - Step 4
                cy.screenshot(`TC-IN-005_Step-4-${date}`)
                cy.get('.swal2-popup').contains('button', 'OK').click()
            })
        })
    })
})

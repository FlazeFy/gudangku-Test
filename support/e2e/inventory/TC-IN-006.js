// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-006 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    let targetModal = ''

    it('Pengguna Dapat Menghapus Inventory Via Table List', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-006_Step-1-${date}`)

            // Step 2: Pada table inventory, pilih inventory dalam kondisi deleted. Kemudian tekan tombol delete
            cy.get('#inventory_tb tbody .inventory-tr').not('.deleted-inventory').first().then($el => {
                cy.wrap($el).find('.btn-delete').invoke('attr', 'data-bs-target').then(val => {
                    targetModal = val.replace('#', '')
                    cy.wrap($el).find('.btn-delete').click()

                    // Step 3: Pada pop up validasi, pengguna menekan tombol "Yes, Delete"
                    cy.get(`#${targetModal}`, { timeout: 5000 }).should('exist').then(() => {
                        cy.screenshot(`TC-AU-005_Step-3-${date}`)
                        cy.get(`#${targetModal}`).contains('Delete this item ')
                        cy.get(`#${targetModal}`).contains('a', 'Yes, Delete').click()
                    })

                    // Step 4: Sistem akan menampilkan pesan "inventory deleted"
                    cy.get('.swal2-popup', { timeout: 5000 }).should('exist').then(() => {
                        cy.get('.swal2-html-container').invoke('text').then((text)=>{
                            expect(text).to.equal('inventory deleted')
                        })
                        // Evidence - Step 4
                        cy.screenshot(`TC-IN-006_Step-4-${date}`)
                        cy.get('.swal2-popup').contains('button', 'OK').click()
                    })
                })
            })
        })
    })
})

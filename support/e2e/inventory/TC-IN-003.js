// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-003 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    const selected_category = 'Food And Beverages'

    it('Pengguna Dapat Menyaring Inventory Berdasarkan Category', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-003_Step-1-${date}`)

            // Step 2: Pada section Control Panel, Pengguna memilih jenis filter category "Food And Beverages" untuk menyaring report berdasarkan category
            // dan list Report akan ditampilkan khusus untuk category terkait
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#search_by_category',selected_category)
            cy.get('#inventory_holder').within(() => {
                // Validate tbody
                cy.get('tbody tr.inventory-tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').eq(1).within(() => {
                            // Inventory Category
                            cy.wrap($row).get('.inventory-category').should('exist').and('not.be.empty').then($h6 => {
                                cy.wrap($h6).prev('h6').should('exist').contains('Category')
                            })
                            cy.wrap($row).find('.inventory-category').invoke('text').then(text => {
                                expect(text.trim()).to.equal(selected_category)
                            })
                        })
                    })
                })
            })
            // Evidence - Step 2
            cy.screenshot(`TC-IN-003_Step-2-${date}`)  

            // Step 3: Pengguna kembali memilih jenis filter category "All" untuk menampilkan semua category inventory
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#search_by_category','All')
            cy.get('#inventory_holder').within(() => {
                // Validate tbody
                cy.get('tbody tr.inventory-tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').eq(1).within(() => {
                            cy.wrap($row).get('.inventory-category').should('exist').and('not.be.empty').then($h6 => {
                                cy.wrap($h6).prev('h6').should('exist').contains('Category')
                            })
                        })
                    })
                })
            })
            // Evidence - Step 3
            cy.screenshot(`TC-IN-003_Step-3-${date}`)  
        })
    })
})

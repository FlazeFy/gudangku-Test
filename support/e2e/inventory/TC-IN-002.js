// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-002 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    const search_name = 'test'

    it('Pengguna Dapat Mencari Inventory Berdasarkan Name', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-002_Step-1-${date}`)

            // Step 2: Pada section Control Panel, Pengguna mengisikan search by name or merk dengan "test" dan list inventory akan tampil bagi inventory dengan nama terkait
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESearchControlPanel('#search_by_name_merk',search_name)
            cy.get('#inventory_holder').within(() => {
                // Validate tbody
                cy.get('tbody tr.inventory-tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').eq(0).within(() => {
                            // Inventory Name
                            cy.wrap($row).find('.inventory-name').invoke('text').then(text => {
                                expect(text.trim().toLowerCase()).to.include(search_name.toLowerCase())
                            })
                        })
                    })
                })
            })
            // Evidence - Step 2
            cy.screenshot(`TC-IN-002_Step-2-${date}`)  

            // Step 3: Pengguna kembali mengosongkan search by name or merk dan akan menampilkan semua list inventory
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESearchControlPanel('#search_by_name_merk',' ')
            cy.get('#inventory_holder').within(() => {
                // Validate tbody
                cy.get('tbody tr.inventory-tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        cy.get('td').eq(0).within(() => {
                            // Inventory Name
                            cy.wrap($row).find('.inventory-name').should('exist').and('not.be.empty')
                        })
                    })
                })
            })
            // Evidence - Step 3
            cy.screenshot(`TC-IN-002_Step-3-${date}`)  
        })
    })
})

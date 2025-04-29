// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-009 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    let targetModal = ''

    it('Pengguna Dapat Melihat Properti Tanggal Inventory', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-009_Step-1-${date}`)

            // Step 2: Pada table inventory, tekan tombol "Properties"
            cy.get('#inventory_tb tbody .inventory-tr').each(($el, idx) => {
                cy.wrap($el).find('.btn-props').invoke('attr', 'data-bs-target').then(val => {
                    targetModal = val.replace('#', '')
                    cy.wrap($el).find('.btn-props').click({ force: true })

                    // Step 3: Sistem akan menampilkan properti inventory berupa Created At, Updated At, Deleted At, dan Existence Period
                    cy.get(`#${targetModal}`, { timeout: 5000 }).should('be.visible').then($modal => {
                        if(idx == 0){
                            cy.screenshot(`TC-IN-009_Step-3-${date}`)
                        }

                        cy.wrap($modal).within(() => {
                            // Created At
                            cy.wrap($el).contains('h6', 'Created At').next('h6').invoke('text').then(text => {
                                expect(text.trim()).to.not.equal('')
                                expect(text.trim()).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
                            })

                            // Updated At and Deleted At
                            const nullable_date = ['Updated At', 'Deleted At']
                            nullable_date.forEach(dt => {
                                cy.wrap($el).contains('h6', dt).next('h6').invoke('text').then(text => {
                                    const value = text.trim()
                                    if (value !== '-') {
                                        expect(value).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
                                    }
                                })
                            })

                            // For Your Information Box
                            cy.wrap($el).get('.alert-primary').within(() => {
                                cy.contains('For Your Information').should('exist')
                                cy.contains('days ago').should('exist')
                                cy.contains(/(\d+)\s+days ago/).invoke('text').then(text => {
                                    const match = text.match(/(\d+)\s+days ago/)
                                    expect(match).to.not.be.null
                                    const days = parseInt(match[1], 10)
                                    expect(days).to.be.least(0)
                                })
                            })
                        })

                        // Step 4: Tekan tombol close, dan lanjutkan untuk mengecek properties inventory lain
                        cy.wrap($modal).find('.btn-close').click({ force: true })
                        // fix this!
                        // cy.get(`#${targetModal}`).should('not.be.visible') 
                    })
                })
            })
        })
    })
})

// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-AL-004 - Analyze', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    // Remove this later!
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('Pengguna Dapat Melihat Hasil Analisis Placement Inventory', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-AL-004_Step-1-${date}`)

            // Step 2: Pada table inventory, pilih item pertama dan tekan tombol edit
            cy.get('#inventory_tb tbody .inventory-tr').not('.deleted-inventory').first().then($el => {
                cy.wrap($el).find('.btn-manage').click()
            })
            cy.url().should('include','/inventory/edit')

            // Step 3: Pada halaman edit / detail, pengguna menekan tombol "Analyze"
            cy.screenshot(`TC-AL-004_Step-3-${date}`)
            cy.get('#edit_toolbar-section').contains('a', 'Analyze').click()
            cy.url().should('include','/analyze/inventory')

            // Step 4: Pada halaman analisis, pengguna dapat melihat hasil analisis harga berupa Total Room Inventory, Average Room Price, dan Inventory Storage & Rack
            cy.get('.swal2-popup:not(.swal2-loading)', { timeout: 10000 }).should('not.exist')
            cy.screenshot(`TC-AL-004_Step-4-${date}`)
            cy.get('#placement_analyze-section').within(() => {
                cy.contains('h3','The Placement')

                // Inventory Name, Inventory Room
                const check_empty = ['.inventory_name','.inventory_room']
                check_empty.forEach(dt => {
                    cy.get(dt).each($el => {
                        cy.wrap($el).invoke('text').then((text) => {
                            expect(text.trim()).to.not.equal("")
                        })
                    })
                });
                // Total Inventory
                cy.get('#total_inventory_room').invoke('text').then((text) => {
                    const total = parseInt(text.trim())
                    expect(total).to.be.least(0)
                })
                // Average Price
                cy.get(`#inventory_price_avg_room`).invoke('text').then((text) => {
                    expect(text.trim().startsWith('Rp. ')).to.be.true
                    const numericText = text.replace('Rp. ', '').replace(/\./g, '')
                    const total = parseFloat(numericText)
                    expect(total).to.be.a('number')
                })
                cy.get(`#inventory_storage_rack`).invoke('text').then((text) => {
                    const trimmed = text.trim().toLowerCase()
                    expect(trimmed.startsWith('storage')).to.be.true
                    const parts = trimmed.split(',').map(p => p.trim())

                    // Inventory Storage
                    const storagePart = parts.find(p => p.startsWith('storage'))
                    const storageValue = storagePart?.replace('storage', '').trim()
                    expect(storageValue).to.not.equal('')

                    // Inventory Rack
                    const rackPart = parts.find(p => p.startsWith('rack'))
                    if (rackPart) {
                        const rackValue = rackPart.replace('rack', '').trim()
                        expect(rackValue).to.not.equal('')
                    }
                })
            })
        })
    })
})

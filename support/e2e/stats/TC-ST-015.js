// Components
import { generateMonthName } from '../../components/generator'
import '../../components/template'

describe('GudangKu E2E Test - TC-ST-015 - Stats', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Statistik Inventory Termahal Berdasarkan Category, Merk, Room, dan Storage', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Stats
            cy.get('#nav_stats_btn').click()
            cy.url().should('include','/stats')
            // Evidence - Step 1
            cy.screenshot(`TC-ST-015_Step-1-${date}`)    

            // Step 2: Pengguna memilih Chart Type "Most Expensive" dan Toogle Total "Total By Item" pada Control Panel
            cy.get('.control-panel').should('exist').within(() => {
                cy.contains('Control Panel')
                cy.scrollTo('top')
                cy.wait(1000)
                cy.get('#toogle_view_stats_select select').should('exist').select('Most Expensive')
            })
            cy.screenshot(`TC-ST-015_Step-2-${date}`)   
            
            // Step 3: Pada section masing-masing context, Pengguna dapat melihat tabel Context dan Inventory Price
            const ctx_holders = [
                { holder: "#stats_most_expensive_inventory_per_category", title: "Most Expensive Inventory Per Category" },
                { holder: "#stats_most_expensive_inventory_per_merk", title: "Most Expensive Inventory Per Merk" },
                { holder: "#stats_most_expensive_inventory_per_room", title: "Most Expensive Inventory Per Room" },
                { holder: "#stats_most_expensive_inventory_per_storage", title: "Most Expensive Inventory Per Storage" }
            ]
            ctx_holders.forEach((dt) => {
                cy.get(dt.holder).should('exist').prev('h2').contains(dt.title)
                cy.get(dt.holder).within(()=>{
                    const tableHeaders = ['Context', 'Inventory Price']
                    let table_contexts = []
                    cy.get('table').within(() => {
                        // Validate table headers
                        cy.get('thead tr th').each(($th, index) => {
                            cy.wrap($th).should('have.text', tableHeaders[index])
                        })
                        // Validate table body
                        cy.get('tbody tr').each(($row) => {
                            cy.wrap($row).within(() => {
                                // All tds must be filled
                                cy.get('td').each(($td, idx) => {
                                    if(idx != tableHeaders.length - 1){
                                        cy.wrap($td).invoke('text').should('not.be.empty')
                                    }
                                })
                                // Context
                                cy.get('td').eq(0).invoke('text').then(contextText => {
                                    const cleanContext = contextText.trim().split('(')[0].trim()
                                    table_contexts.push(cleanContext)
                                })
                                // Total (In Rupiah)
                                cy.get('td').eq(1).within(() => {
                                    cy.root().invoke('text').then(text => {
                                        expect(text.trim().startsWith('Rp. ')).to.be.true
                                        const numericText = text.replace('Rp. ', '').replace(/\./g, '')
                                        const total = parseFloat(numericText)
                                        expect(total).to.be.a('number')
                                    })
                                })
                            })
                        })
                    })

                    // Step 4: Untuk context harus memiliki nilai unik
                    cy.then(() => {
                        const uniqueLabels = [...new Set(table_contexts)]
                        expect(table_contexts.length).to.equal(uniqueLabels.length)
                    })
                })
            })
        })
    })
})

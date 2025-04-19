// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-ST-010 - Stats', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Statistik Total Harga Inventory Berdasarkan Favorite', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Stats
            cy.get('#nav_stats_btn').click()
            cy.url().should('include','/stats')
            // Evidence - Step 1
            cy.screenshot(`TC-ST-004_Step-1-${date}`)    

            // Step 2: Pengguna memilih Chart Type "Top Chart" dan Toogle Total "Total By Price" pada Control Panel
            cy.get('.control-panel').should('exist').within(() => {
                cy.contains('Control Panel')
                cy.get('#toogle_view_stats_select').should('exist').find('option:selected').should('have.text', 'Top Chart')
                cy.wait(1000)
                cy.scrollTo('top')
                cy.wait(1000)
                cy.get('#toogle_total_view_select select').should('exist').select('Total By Price')
            })
            // Evidence - Step 2
            cy.screenshot(`TC-ST-010_Step-2-${date}`)   
            
            // Step 3: Pada section "Total Price Inventory By Favorite", Pengguna dapat melihat statistik Pie Chart dan tabel Context dan Total
            cy.get('#stats_total_inventory_by_favorite_holder').should('exist').prev('h2').should('have.text','Total Price Inventory By Favorite')
            cy.get('#stats_total_inventory_by_favorite_holder').within(()=>{
                // Pie Chart
                cy.get('.apexcharts-canvas').should('exist')
                cy.get('.apexcharts-legend').should('exist')

                let legend_labels = []
                // Validate Rules
                const inventory_favorite_dct = ['Favorite','Normal Item']
                cy.get('.apexcharts-legend-text').each($text => {
                    const text = $text.text().trim()
                    legend_labels.push(text)
                    expect(inventory_favorite_dct).to.include(text)
                })

                // Table
                const tableHeaders = ['Context', 'Total']
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
                            cy.get('td').eq(0).within(() => {
                                cy.root().invoke('text').then(text => {
                                    expect(text).to.be.a('string')
                                    table_contexts.push(text.trim())
                                })
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

                // Step 4: Untuk label pada Pie Chart dan kolom Context pada tabel memiliki nilai yang sama
                cy.then(() => {
                    expect(legend_labels).to.deep.equal(table_contexts)
                })
            })
        })
    })
})

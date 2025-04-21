// Components
import { generateMonthName } from '../../components/generator'
import '../../components/template'

describe('GudangKu E2E Test - TC-ST-014 - Stats', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Statistik Total Report Pengeluaran Berdasarkan Bulan', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Stats
            cy.get('#nav_stats_btn').click()
            cy.url().should('include','/stats')
            // Evidence - Step 1
            cy.screenshot(`TC-ST-014_Step-1-${date}`)    

            // Step 2: Pengguna memilih Chart Type "Periodic Chart" dan Toogle Total "Total By Item" pada Control Panel
            cy.get('.control-panel').should('exist').within(() => {
                cy.contains('Control Panel')
                cy.scrollTo('top')
                cy.wait(1000)
                cy.get('#toogle_view_stats_select select').should('exist').select('Periodic Chart')
            })
            cy.screenshot(`TC-ST-014_Step-2-${date}`)    
            
            // Step 3: Pada section "Total Report Spending Per Month", Pengguna dapat melihat statistik Line Chart dan tabel Context dan Total
            cy.get('#stats_total_report_spending_per_month').should('exist').prev('h2').contains('Total Report Spending Per Month')
            cy.get('#stats_total_report_spending_per_month').within(()=>{
                // Line Chart
                cy.get('.apexcharts-canvas').should('exist')
                cy.get('.apexcharts-xaxis').should('exist')

                let legend_labels = []
                const month_names = generateMonthName('all','short')
                cy.get('.apexcharts-xaxis-label title').each($text => {
                    const text = $text.text().trim()
                    expect(text).to.be.a('string').to.not.equal('')
                    expect(month_names).to.include(text)
                    legend_labels.push(text)
                })
                // Minimal Total 0
                cy.get('.apexcharts-yaxis-label title').each($text => {
                    const number = parseFloat($text.text().trim())
                    expect(number).to.be.a('number').and.to.be.least(0)
                })

                // Table
                const tableHeaders = ['Context', 'Total Price', 'Total Item', 'Average Price Per Item']
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
                            // Total Item
                            cy.get('td').then($tds => {
                                const text = $tds.eq(2).text()
                                const total = parseFloat(text)
                                expect(total).to.be.a('number').and.to.be.least(0)
                            })   
                            // Total Price & Average Price Per Item
                            cy.get('td').then($tds => {
                                [1, 3].forEach(idx => {
                                    cy.get('td').eq(idx).within(() => {
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
                    })
                })

                // Step 4: Untuk label pada Line Chart dan kolom Context pada tabel memiliki nilai yang sama
                cy.then(() => {
                    expect(legend_labels).to.deep.equal(table_contexts)
                })
            })
        })
    })
})

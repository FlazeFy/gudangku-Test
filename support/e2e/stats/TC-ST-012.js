// Components
import { generateMonthName } from '../../components/generator'
import '../../components/template'

describe('GudangKu E2E Test - TC-ST-012 - Stats', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Mengganti Tahun Pada Control Panel Statistik Periodic Chart', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Stats
            cy.get('#nav_stats_btn').click()
            cy.url().should('include','/stats')
            // Evidence - Step 1
            cy.screenshot(`TC-ST-011_Step-1-${date}`)    

            // Step 2: Pengguna memilih Chart Type "Periodic Chart" dan Toogle "Year" selain tahun yang telah dipilih
            cy.get('.control-panel a[data-bs-toggle="collapse"]').then($link => {
                cy.get('#collapseControl').then($panel => {
                    if (!$panel.hasClass('show')) {
                        cy.wrap($link).click()
                    }
                })
            })
            
            cy.get('#toogle_view_stats_select select').should('exist').should('be.visible').select('Periodic Chart')
            cy.get('#toogle_year_select select').should('exist').should('be.visible').find('option').not(':selected').first().then(option => {
                cy.wrap(option).invoke('val').then(val => {
                    cy.get('#toogle_year_select select').select(val)
                })
            })
            // Evidence - Step 2
            cy.screenshot(`TC-ST-012_Step-2-${date}`)   
            
            // Step 3: Pada semua section line chart periodic, judul akan menampilkan tahun yang dipilih beserta dapat menampilkan diagram dan table
            const list_periodic_chart_holder = ['#stats_total_inventory_created_per_month','#stats_total_report_created_per_month','#stats_total_report_spending_per_month','#stats_total_report_used_per_month']
            cy.get('#toogle_year_select select').find('option:selected').invoke('val').then(selected_year => {
                list_periodic_chart_holder.forEach(el=>{
                    cy.get(el).should('exist').prev('h2').contains(selected_year)
                    cy.get(el).within(()=>{
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
                    })
                })
            })
        })
    })
})

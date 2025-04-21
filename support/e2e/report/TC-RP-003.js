// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-RP-003 - Report', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    const selected_category = 'Shopping Cart'

    it('Pengguna Dapat Menyaring Report Berdasarkan Category', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Report
            cy.get('#nav_report_btn').click()
            cy.url().should('include','/report')
            // Evidence - Step 1
            cy.screenshot(`TC-RP-003_Step-1-${date}`)

            // Step 2: Pada section Control Panel, Pengguna memilih jenis filter category "Shopping Cart" untuk menyaring report berdasarkan category
            // dan list Report akan ditampilkan khusus untuk category terkait
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#search_by_category',selected_category)
            cy.get('#report_holder .report-box').each(($el) => {
                // Report Category
                cy.wrap($el).find('.report-category').invoke('text').then(text => {
                    expect(text.trim()).to.equal(selected_category)
                })
            })
            // Evidence - Step 2
            cy.screenshot(`TC-RP-003_Step-2-${date}`)  

            // Step 3: Pengguna kembali memilih jenis filter category "All" untuk menampilkan semua category report
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#search_by_category','All')
            cy.get('#report_holder .report-box').each(($el) => {
                // Report Category
                cy.wrap($el).find('.report-category').should('exist').and('not.be.empty')
            })
            // Evidence - Step 3
            cy.screenshot(`TC-RP-003_Step-3-${date}`)  
        })
    })
})

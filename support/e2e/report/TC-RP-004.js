// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-RP-004 - Report', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    const search_title = 'test'

    it('Pengguna Dapat Mencari Report Berdasarkan Title', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Report
            cy.get('#nav_report_btn').click()
            cy.url().should('include','/report')
            // Evidence - Step 1
            cy.screenshot(`TC-RP-004_Step-1-${date}`)

            // Step 2: Pada section Control Panel, Pengguna mengisikan search by title dengan "test" dan list report akan tampil bagi report dengan judul terkait
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESearchControlPanel('#search_by_title',search_title)
            cy.get('#report_holder .report-box').each(($el) => {
                // Report Title
                cy.wrap($el).find('h2').invoke('text').then(text => {
                    expect(text.trim().toLowerCase()).to.include(search_title.toLowerCase())
                })
            })
            // Evidence - Step 2
            cy.screenshot(`TC-RP-004_Step-2-${date}`)  

            // Step 3: Pengguna kembali mengosongkan search by title dan akan menampilkan semua list report
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESearchControlPanel('#search_by_title',' ')
            cy.get('#report_holder .report-box').each(($el) => {
                // Report Title
                cy.wrap($el).find('h2').should('exist').and('not.be.empty')
            })
            // Evidence - Step 3
            cy.screenshot(`TC-RP-004_Step-3-${date}`)  
        })
    })
})

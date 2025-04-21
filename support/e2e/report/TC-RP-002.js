// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-RP-002 - Report', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Mengurutkan Report Yang Ditampilkan Menggunakan Control Panel Berdasarkan Judul', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Report
            cy.get('#nav_report_btn').click()
            cy.url().should('include','/report')
            // Evidence - Step 1
            cy.screenshot(`TC-RP-002_Step-1-${date}`)

            // Step 2: Pada section Control Panel, Pengguna memilih jenis sorting "Ascending by Title" untuk mengurutkan berdasarkan abjad judul secara menaik
            // dan list Report akan ditampilkan secara berurutan berdasarkan judul reportnya
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#sorting','Ascending by Title')
            cy.get('#report_holder .report-box h2').then($els => {
                // Report Title
                const titles = [...$els].map(el => el.innerText.trim())
                const sortedTitles = [...titles].sort()
                expect(titles).to.deep.equal(sortedTitles)
            })
            // Evidence - Step 2
            cy.screenshot(`TC-RP-002_Step-2-${date}`)  

            // Step 3: Pengguna kembali memilih jenis sorting "Descending by Title "untuk mengurutkan berdasarkan abjad judul secara menurun
            // dan list Report akan ditampilkan secara berurutan berdasarkan judul reportnya
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#sorting','Descending by Title')
            cy.get('#report_holder .report-box h2').then($els => {
                // Report Title
                const titles = [...$els].map(el => el.innerText.trim())
                const sortedTitles = [...titles].sort().reverse()
                expect(titles).to.deep.equal(sortedTitles)
            })
            // Evidence - Step 3
            cy.screenshot(`TC-RP-002_Step-3-${date}`)  
        })
    })
})

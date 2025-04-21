// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-RP-005 - Report', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Mengurutkan Report Yang Ditampilkan Menggunakan Control Panel Berdasarkan Created Date', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Report
            cy.get('#nav_report_btn').click()
            cy.url().should('include','/report')
            // Evidence - Step 1
            cy.screenshot(`TC-RP-005_Step-1-${date}`)

            // Step 2: Pada section Control Panel, Pengguna memilih jenis sorting "Ascending by Created Date" untuk mengurutkan berdasarkan tanggal waktu buat secara menaik
            // dan list Report akan ditampilkan secara berurutan berdasarkan tanggal waktu report
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#sorting','Ascending by Created Date')
            cy.get('#report_holder .report-box h6.date-text').then($el => {
                // Report Created At
                const created_at = $el.toArray().map(el => {
                    return new Date(el.innerText.trim()) // 'YYYY-MM-DD HH:mm' format
                })
                let is_sorted = true
                for (let i = 1; i < created_at.length; i++) {
                    if (created_at[i] < created_at[i - 1]) {
                        is_sorted = false
                        break
                    }
                }
                expect(is_sorted).to.be.true
            })
            // Evidence - Step 2
            cy.screenshot(`TC-RP-005_Step-2-${date}`)  

            // Step 3: Pengguna kembali memilih jenis sorting "Descending by Created Date" untuk mengurutkan berdasarkan tanggal waktu buat secara menurun
            // dan list Report akan ditampilkan secara berurutan berdasarkan tanggal waktu report
            cy.templateE2EOpenControlPanel()
            cy.templateE2ESelectControlPanel('#sorting','Descending by Created Date')
            cy.get('#report_holder .report-box h6.date-text').then($el => {
                // Report Created At
                const created_at = $el.toArray().map(el => {
                    return new Date(el.innerText.trim()) // 'YYYY-MM-DD HH:mm' format
                })
                let is_sorted = true
                for (let i = 1; i < created_at.length; i++) {
                    if (created_at[i] > created_at[i - 1]) {
                        is_sorted = false
                        break
                    }
                }
                expect(is_sorted).to.be.true
            })
            // Evidence - Step 3
            cy.screenshot(`TC-RP-005_Step-3-${date}`)  
        })
    })
})

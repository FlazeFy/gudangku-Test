// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-HS-001 - History', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Riwayat Aktivitas Pada Aplikasi', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu History
            cy.get('#nav_history_btn').click()
            cy.url().should('include','/history')
            // Evidence - Step 1
            cy.screenshot(`TC-HS-001_Step-1-${date}`)

            // Step 2: Terdapat sebuah list riwayat aktivitas yang berisi Context, Created At, and tombol Delete
            cy.get('#history_holder .history-box').each(($el) => {
                // History Context
                cy.wrap($el).find('h2').should('exist').and('not.be.empty')
                // History Created At
                cy.wrap($el).find('h6.date-text').should('exist').and('not.be.empty')
                // Delete Button
                cy.wrap($el).find('button.btn-delete').should('exist')
            })
        })
    })
})

// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-US-003 - User', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat InfoBox Telegram Jika Akun Belum Menautkan Telegram', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Profile
            cy.get('#nav_profile_btn').click()
            cy.url().should('include','/profile')
            // Evidence - Step 1
            cy.screenshot(`TC-AU-005_Step-1-${date}`)

            // Step 2: Pada section "Telegram Account", Pengguna dapat melihat info box bahwa akun belum tertaut dengan Telegram
            cy.get('#telegram-section').should('exist').contains('Telegram Account')
            cy.get(`#telegram-section #telegram_user_id`).invoke('val').then(val => {
                expect(val).to.be.equal("")
            })
            cy.get('#telegram-section .alert').contains('Sync your GudangKu account with your Telegram ID to use this apps straight at your Telegram Chat')

            // Evidence - Step 2
            cy.screenshot(`TC-US-003_Step-2-${date}`)
        })
    })
})

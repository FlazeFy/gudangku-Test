// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-US-002 - User', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Akun Telegram Yang Telah Tertaut', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Profile
            cy.get('#nav_profile_btn').click()
            cy.url().should('include','/profile')
            // Evidence - Step 1
            cy.screenshot(`TC-AU-005_Step-1-${date}`)

            // Step 2: Pada section "Telegram Account", Pengguna dapat melihat Telegram User ID dan status validasi "Validated!"
            cy.get('#telegram-section').should('exist').contains('Telegram Account')
            const inputHolderElement = [
                { selector: '#telegram_user_id', max: 36, min: 10, nullable: false },
            ]
            inputHolderElement.forEach(el => {
                cy.get(`#telegram-section ${el.selector}`)
                    .invoke('val')
                    .then(val => {
                        if (el.nullable && val === "") {
                            return 
                        }
                        expect(val.length).to.be.at.least(el.min)
                        expect(val.length).to.be.at.most(el.max)
                    })
            })
            cy.get('#telegram-section').find('#label-validate-holder').invoke('text').then(text => {
                expect(text.trim()).contains('Validated!')
            })

            // Evidence - Step 2
            cy.screenshot(`TC-US-002_Step-2-${date}`)
        })
    })
})

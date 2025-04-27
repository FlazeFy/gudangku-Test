// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-US-001 - User', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Profile Akun', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Profile
            cy.get('#nav_profile_btn').click()
            cy.url().should('include','/profile')
            // Evidence - Step 1
            cy.screenshot(`TC-AU-005_Step-1-${date}`)

            // Step 2: Pada section "Profile", Pengguna dapat melihat Username, Email, and Created At
            cy.get('#profile-section').should('exist').contains('Profile')
            const inputHolderElement = [
                { selector: '#username_input', max: 36, min: 6, nullable: false },
                { selector: '#email_input', max: 144, min: 10, nullable: false },
            ]
            inputHolderElement.forEach(el => {
                cy.get(`#profile-section ${el.selector}`)
                    .invoke('val')
                    .then(val => {
                        if (el.nullable && val === "") {
                            return 
                        }
                        expect(val.length).to.be.at.least(el.min)
                        expect(val.length).to.be.at.most(el.max)
                    })
            })
            cy.get('#profile-section').find('#created_at_holder').should('exist').and('not.be.empty')

            // Evidence - Step 2
            cy.screenshot(`TC-US-001_Step-2-${date}`)
        })
    })
})

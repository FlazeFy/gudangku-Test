// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-AU-005 - Auth', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Keluar Dari Aplikasi', () => {
        // Pre Condition : User Must Logged In To Their Account
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Profile
            cy.get('#nav_profile_btn').click()
            cy.url().should('include','/profile')
            // Evidence - Step 1
            cy.screenshot(`TC-AU-005_Step-1-${date}`)

            // Step 2: Pengguna menekan tombol sign out
            cy.get('#sign_out_btn').click()

            // Step 3: Pada pop up validasi, pengguna menekan tombol Yes, Sign Out
            cy.get('#modalSignOut', { timeout: 5000 }).should('exist').then(() => {
                cy.screenshot(`TC-AU-005_Step-3-${date}`)
                cy.get('#modalSignOut').contains('Are you sure want to leave this account?')
                cy.get('#modalSignOut').contains('a', 'Yes, Sign Out').click()
            })
            cy.url().should('include','/login')
        })
    })
})

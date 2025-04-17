describe('GudangKu E2E Test - TC-AU-001 - Auth', () => {
    const BASEURL = 'http://localhost:8000'
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Login Menggunakan Data Valid', () => {
        // Step 1: Pengguna membuka halaman login
        cy.visit(`${BASEURL}/login`)

        // Step 2: Pengguna mengisikan form login
        cy.get('#username-input').type(username)
        cy.get('#password-input').type(password)
        // Evidence - Step 2
        cy.screenshot(`TC-AU-001_Step-2-${date}`)

        // Step 3: Pengguna menekan button submit
        cy.get('#submit-login-btn').click()
        // Expected Result
        cy.url().should('include', '/')
        // Evidence - Step 4
        cy.screenshot(`TC-AU-001_Step-3-${date}`)
    })
})

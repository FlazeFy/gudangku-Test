describe('GudangKu E2E Test - TC-AU-002 - Auth', () => {
    const BASEURL = 'http://localhost:8000'
    const username = 'flazefy'
    const password = '123456'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Tidak Dapat Login Menggunakan Password Yang Salah', () => {
        // Step 1: Pengguna membuka halaman login
        cy.visit(`${BASEURL}/`)

        // Step 2: Pengguna mengisikan form login
        cy.get('#username-input').type(username)
        cy.get('#password-input').type(password)
        // Evidence - Step 2
        cy.screenshot(`TC-AU-002_Step-2-${date}`)

        // Step 3: Pengguna menekan button submit
        cy.get('#submit-login-btn').click()
        
        // Step 4: Setelah proses validasi, sistem akan menampilkan pesan "wrong username or password"
        cy.get('#form-login #all_msg').contains('wrong username or password')
        // Expected Result
        cy.url().should('include', '/')

        // Evidence - Step 4
        cy.screenshot(`TC-AU-002_Step-4-${date}`)
    })
})

describe('GudangKu E2E Test - TC-AU-004 - Auth', () => {
    const BASEURL = 'http://localhost:8000'
    const username = 'flazefy'
    const password = 'nopas'
    const date = new Date().toISOString().replace(/:/g, '-')

    it(`Pengguna Tidak Dapat Login Menggunakan Data Dengan Panjang Karakter Tidak Valid`, () => {
        // Notes : Password should have minimal 6 character 
        // Step 1: Pengguna membuka halaman login
        cy.visit(`${BASEURL}/login`)

        // Step 2: Pengguna mengisikan form login
        cy.get('#username-input').type(username)
        cy.get('#password-input').type(password)
        // Evidence - Step 2
        cy.screenshot(`TC-AU-002_Step-2-${date}`)

        // Step 3: Pengguna menekan button submit
        cy.get('#submit-login-btn').click()
            
        // Step 4: Setelah proses validasi, sistem akan menampilkan pesan "The password field must be at least 6 characters"
        cy.get('#form-login').contains('The password field must be at least 6 characters')
        // Expected Result
        cy.url().should('include', '/')

        // Evidence - Step 4
        cy.screenshot(`TC-AU-004_Step-4-${date}`)
    })
})

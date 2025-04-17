describe('GudangKu E2E Test - TC-AU-003 - Auth', () => {
    const BASEURL = 'http://localhost:8000'
    const username = ' '
    const password = ' '
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Tidak Dapat Login Menggunakan Username Dan Password Kosong', () => {
        // Step 1: Pengguna membuka halaman login
        cy.visit(`${BASEURL}/login`)

        // Step 2: Pengguna mengisikan form login
        cy.get('#username-input').type(username)
        cy.get('#password-input').type(password)
        // Evidence - Step 2
        cy.screenshot(`TC-AU-003_Step-2-${date}`)

        // Step 3: Pengguna menekan button submit
        cy.get('#submit-login-btn').click()
        
        // Step 4: Setelah proses validasi, sistem akan menampilkan pesan "The username field is required" dan "The password field is required"
        const textContains = ['The username field is required','The password field is required']
        textContains.forEach(dt => {
            cy.get('#form-login').contains(dt)
        })
        // Expected Result
        cy.url().should('include', '/')

        // Evidence - Step 4
        cy.screenshot(`TC-AU-003_Step-4-${date}`)
    })
})

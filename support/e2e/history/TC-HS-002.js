// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-HS-002 - History', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Menghapus Riwayat Aktivitas Pada Aplikasi', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu History
            cy.get('#nav_history_btn').click()
            cy.url().should('include','/history')
            // Evidence - Step 1
            cy.screenshot(`TC-HS-002_Step-1-${date}`)

            // Step 2: Terdapat sebuah list riwayat aktivitas. Pilih item pertama dan tekan tombol Delete
            cy.get('#history_holder .history-box').first().find('button.btn-delete').click()

            // Step 3: Pada pop up validasi dengan deskripsi "Delete this history about Print item from item called Report Detail?", tekan tombol "Yes, Delete"
            cy.get('.modal.fade.show', { timeout: 5000 }).should('exist').then(() => {
                cy.screenshot(`TC-HS-002_Step-3-${date}`)
                cy.get('.modal.fade.show').contains('Delete this history about Print item from item called Report Detail?')
                cy.get('.modal.fade.show').contains('button', 'Yes, Delete').click()
            })

            // Step 4 : Pop up sukses dengan pesan "history permentally deleted" akan tampil
            cy.get('.swal2-popup', { timeout: 5000 }).should('exist').then(() => {
                cy.get('.swal2-html-container').invoke('text').then((text)=>{
                    expect(text).to.equal('history permentally deleted')
                })
                cy.get('.swal2-popup').contains('button', 'OK').click()
            })
            // Evidence - Step 4
            cy.screenshot(`TC-HS-002_Step-4-${date}`)
        })
    })
})

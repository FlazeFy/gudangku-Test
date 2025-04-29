// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-010 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')
    let inventory = {
        name: 'Product A',
        category: 'Food And Beverages',
        desc: 'Lorem ipsum',
        merk: 'Merk A',
        price: '120000',
        vol: '2',
        unit: 'Kilogram',
        capacity_vol: '3',
        capacity_unit: 'Pcs',
        room: 'Main Room',
        storage: 'Storage A',
        rack: 'Rack B'
    }

    it('Pengguna Dapat Menambahkan Inventory Dengan Data Valid', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-010_Step-1-${date}`)

            // Step 2: Tekan tombol "Add Inventory"
            cy.contains('a','Add Inventory').click()
          
            // Step 3: Pada halaman Add Inventory, pengguna mengisi form add inventory
            cy.get('#inventory_name').type(inventory.name)
            cy.get('select[name="inventory_category"]').select(inventory.category)
            cy.get('#inventory_desc').type(inventory.desc)
            cy.get('#inventory_merk').type(inventory.merk)
            cy.get('#inventory_price').type(inventory.price)
            cy.get('#inventory_vol').type(inventory.vol)
            cy.get('select[name="inventory_unit"]').select(inventory.unit)
            cy.get('#inventory_capacity_vol').type(inventory.capacity_vol)
            cy.get('select[name="inventory_capacity_unit"]').select(inventory.capacity_unit)
            cy.get('select[name="inventory_room"]').select(inventory.room)
            cy.get('#inventory_storage').type(inventory.storage)
            cy.get('#inventory_rack').type(inventory.rack)
            // Evidence - Step 3
            cy.screenshot(`TC-IN-010_Step-3-${date}`)

            // Step 4: Pengguna menekan tombol Submit
            cy.contains('a', 'Submit').click()

            // Step 5: Sistem akan menampilkan pesan "inventory created, its called 'Product A'. Do you want to see the created item?", tekan tombol "Yes"
            cy.get('.swal2-popup:not(.swal2-loading)', { timeout: 10000 }).should('exist').then(() => {
                cy.get('.swal2-html-container').invoke('text').then((text)=>{
                    expect(text).to.equal(`inventory created, its called '${inventory.name}'. Do you want to see the created item?`)
                })
                // Evidence - Step 5
                cy.screenshot(`TC-IN-010_Step-5-${date}`)
                cy.get('.swal2-popup').contains('button', 'Yes').click()
            })

            // Step 6: Sistem akan mengarahkan pengguna pada halaman edit / detail inventory yang telah dibuat
            cy.get('h2').should('contain.text', 'Edit Inventory')
            cy.url().should('include','/inventory/edit')
            // Evidence - Step 6
            cy.screenshot(`TC-IN-010_Step-6-${date}`)
        })
    })
})

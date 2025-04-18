// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-IN-001 - Inventory', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat List Inventory', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna menekan tombol menu Inventory
            cy.get('#nav_inventory_btn').click()
            cy.url().should('include','/inventory')
            // Evidence - Step 1
            cy.screenshot(`TC-IN-001_Step-1-${date}`)

            // Step 2: Terdapat sebuah table inventory yang berisi Name & Description, Category & Merk, Placement, Price, Unit, Capacity, dan beberapa tombol action
            const tableHeaders = ['Name & Description','Category & Merk', 'Placement', 'Price', 'Unit', 'Capacity', 'Action']
            cy.get('#inventory_holder').within(() => {
                // Validate table headers
                cy.get('thead tr.tr-header th').each(($th, index) => {
                    cy.wrap($th).should('have.text', tableHeaders[index])
                })
            
                // Validate tbody
                cy.get('tbody tr.inventory-tr').each(($row) => {
                    cy.wrap($row).within(() => {
                        // All tds must be filled
                        cy.get('td').each(($td, idx) => {
                            if(idx != tableHeaders.length - 1){
                                cy.wrap($td).invoke('text').should('not.be.empty')
                            }
                        })
            
                        cy.get('td').eq(0).within(() => {
                            // Inventory Name
                            cy.wrap($row).find('.inventory-name').should('exist').and('not.be.empty')
                            // Inventory Desc
                            cy.get('.inventory-desc').invoke('text').then((text) => {
                                const trimmed = text.trim()
                                expect(trimmed).to.satisfy(t => t === '-' || t.length > 0)
                            }) 
                        })

                        // Inventory Category & Inventory Merk
                        cy.get('td').eq(1).within(() => {
                            const value_holder = [
                                { holder: 'inventory-category', title: 'Category' },
                                { holder: 'inventory-merk', title: 'Merk' },
                            ]
                            value_holder.forEach(dt => {
                                cy.wrap($row).get(`.${dt.holder}`).should('exist').and('not.be.empty').then($h6 => {
                                    cy.wrap($h6).prev('h6').should('exist').contains(dt.title)
                                })
                            })
                        })

                        // Inventory Room, Inventory Storage, & Inventory Rack
                        cy.get('td').eq(2).within(() => {
                            const value_holder = [
                                { holder: 'inventory-room', title: 'Room' },
                                { holder: 'inventory-storage', title: 'Storage' },
                                { holder: 'inventory-rack', title: 'Rack' },
                            ]
                            value_holder.forEach(dt => {
                                cy.wrap($row).get(`.${dt.holder}`).should('exist').and('not.be.empty').then($h6 => {
                                    cy.wrap($h6).prev('h6').should('exist').contains(dt.title)
                                })
                            })
                        })

                        // Inventory Price
                        cy.get('td').eq(3).within(() => {
                            cy.root().invoke('text').then(text => {
                                const trimmed = text.trim()
                                if (trimmed === '-') {
                                    expect(trimmed).to.eq('-')
                                } else {
                                    expect(trimmed).to.include('Rp.')
                                    const numeric = trimmed.replace(/[^\d]/g, '')
                                    const number = parseInt(numeric, 10)
                                    expect(number).to.be.a('number').and.to.be.greaterThan(0)
                                }
                            })
                        })
                        
                        // Inventory Unit
                        cy.get('td').eq(4).within(() => {
                            cy.root().invoke('text').then(text => {
                                const [num, unit] = text.trim().split(' ')
                                const vol = parseFloat(num)
                                expect(vol).to.be.a('number')
                                expect(unit).to.be.a('string').and.to.not.be.empty
                            })
                        })
                        
                        // Inventory Capacity
                        cy.get('td').eq(5).within(() => {
                            cy.root().invoke('text').then(text => {
                                const trimmed = text.trim()
                                if (trimmed === '-') {
                                    expect(trimmed).to.eq('-')
                                } else {
                                    expect(trimmed).to.include('%')
                                    const percent = parseFloat(trimmed.replace('%', ''))
                                    expect(percent).to.be.within(0, 100)
                                }
                            })
                        })
  
                        // Action must contain 
                        cy.get('td').eq(6).within(() => {
                            const button_action = ['btn-props','btn-like','btn-delete','btn-manage','btn-reminder']
                            button_action.forEach(dt => {
                                cy.get(`.${dt}`).should('exist')
                            })
                        })
                    })
                })
            })
        })
    })
})

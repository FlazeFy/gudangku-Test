// Components
import '../../components/template'

describe('GudangKu E2E Test - TC-ST-001 - Stats', () => {
    const username = 'flazefy'
    const password = 'nopass123'
    const date = new Date().toISOString().replace(/:/g, '-')

    it('Pengguna Dapat Melihat Summary Inventory', () => {
        // Pre Condition : Pengguna sudah melakukan login ke dalam aplikasi
        cy.templateE2ELogin(username, password).then(() => {
            // Step 1: Setelah Login, Pengguna dapat melihat summary inventory yang berisi Total Item, Favorite Item, Low Capacity, Last Added, Most Category, dan The Highest Price 
            // Total Item, Total Favorited, Total Low
            const stats_number = [
                { holder: 'total_item', title: 'Item' },
                { holder: 'total_fav', title: 'Favorite Item' },
                { holder: 'total_low', title: 'Low Capacity' }
            ]
            stats_number.forEach(dt=> {
                cy.get(`#${dt.holder}-section`).within(() => {
                    cy.get(`#${dt.holder}`).should('exist').and('not.be.empty')
                    cy.get(`#${dt.holder}`).invoke('text').then((text) => {
                        const value = parseInt(text)
                        expect(value).to.be.a('number')
                    })                  
                    cy.get('h2.dashboard-subtitle').should('exist').and('contain.text', dt.title)
                })  
            })
            // Last Added, Most Category, The Highest Price
            const stats_text = [
                { holder: 'last_added', title: 'Last Added' },
                { holder: 'most_category_total', title: 'Most Category' },
                { holder: 'highest_price_name', title: 'The Highest Price' }
            ]
            stats_text.forEach(dt=>{
                cy.get(`#${dt.holder}-section`).within(() => {
                    cy.get(`#${dt.holder}`).should('exist').and('not.be.empty')
                    cy.get('h2.dashboard-subtitle').should('exist').and('contain.text', dt.title)
                }) 
            })
            // Evidence - Step 1
            cy.screenshot(`TC-ST-001_Step-1-${date}`)         
        })
    })
})

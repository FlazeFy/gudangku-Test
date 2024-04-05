// Test Case ID : TC-002
// Related FR : FR-002
// Modules : Auth

// Components
import '../../components/template'

describe('GudangKu Cases - TC002', () => {
    // Template
    const methodCaseOne = 'post'
    const methodCaseTwo = 'get'

    it(methodCaseOne.toUpperCase() + ' - Logout', () => {
        // Post login
        const builder = {
            "username": 'flazefy',
            "password": 'nopass123',
        }

        cy.request({
            method: methodCaseOne, 
            url: 'api/v1/login',
            form: true,
            body: builder,
        }).then(auth => {
            expect(auth.status).to.equal(200)
            const token = auth.body.token
            cy.wrap(token).as('token_TC002')
        })

        // Get logout
        cy.get('@token_TC002').then(token => {
            cy.request({
                method: methodCaseTwo,
                url: 'api/v1/logout',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(auth2 => {
                expect(auth2.status).to.equal(200)
            })
        })
    })
})
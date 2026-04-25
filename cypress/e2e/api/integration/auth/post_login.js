import '../../../../support/template'

describe('MyRide Integration Test - Auth - Post : Login', () => {
    const method = 'post'
    const url = '/api/v1/login'

    it('TC-INT-AU-001 : User Can Login With Valid Data', () => {
        const test_data = {
            username : "tania93",
            password : 'nopass123',
        }

        cy.request({
            method: method,
            url: url,
            body: test_data
        }).as('SuccessPostLoginWithValidData')
        cy.get('@SuccessPostLoginWithValidData').then(dt => {
            expect(dt.status).to.equal(200)

            const body = dt.body
            const objectBody = ['token','role','message','status']
            objectBody.forEach(dt => {
                expect(body).to.have.property(dt)
            })
            expect(body['token']).to.be.a('string')
            expect(body['status']).to.be.a('string').to.equal('success')
            expect(body['role']).to.be.a('number')
            expect(body['message']).to.be.a('object')

            // Get list key / column
            const dataObj = body['message']
            const stringFields = ['id','username','email','created_at']
            const stringNullableFields = ['updated_at','telegram_user_id']
            const intFields = ['telegram_is_valid']

            // Validate column
            cy.templateValidateColumn(dataObj, stringFields, 'string', false)
            cy.templateValidateColumn(dataObj, stringNullableFields, 'string', true)
            cy.templateValidateColumn(dataObj, intFields, 'number', true)

            // Validate character length
            const columnPropsClothes = [
                { column_name : 'id', data_type: 'string', max: 36, min: 36, nullable: false },
                { column_name : 'username', data_type: 'string', max: 36, min: 6, nullable: false },
                { column_name : 'email', data_type: 'string', max: 144, min: 10, nullable: false },
                { column_name : 'telegram_user_id', data_type: 'string', max: 36, min: 10, nullable: true },
            ]
            cy.templateValidateMaxMin(dataObj, columnPropsClothes)

            // Validate datetime
            const columnDateTime = [
                { column_name : 'created_at', date_type: 'datetime', nullable: false },
                { column_name : 'updated_at', date_type: 'datetime', nullable: true },
            ]
            cy.templateValidateDateTime(dataObj, columnDateTime)
        })
    })

    it('TC-INT-AU-002 : User Cant Login With Wrong Password', () => {
        const test_data = {
            username : "tania93",
            password : 'nopass1234',
        }

        cy.request({
            method: method,
            url: url,
            body: test_data,
            failOnStatusCode: false
        }).as('FailedPostLoginWithWrongPassword')
        cy.get('@FailedPostLoginWithWrongPassword').then(dt => {
            expect(dt.status).to.equal(401)

            const body = dt.body
            const objectBody = ['message','status']
            objectBody.forEach(dt => {
                expect(body).to.have.property(dt)
            })
            expect(body['status']).to.be.a('string').to.equal('failed')
            expect(body['message']).to.be.a('string').to.equal('wrong username or password')
        })
    })

    it('TC-INT-AU-003 : User Cant Login With Invalid Char Length Username', () => {
        const test_data = {
            username : "fla",
            password : 'nopass1234',
        }

        cy.request({
            method: method,
            url: url,
            body: test_data,
            failOnStatusCode: false
        }).as('FailedPostLoginWithInvalidCharLengthUsername')
        cy.get('@FailedPostLoginWithInvalidCharLengthUsername').then(dt => {
            expect(dt.status).to.equal(400)

            const body = dt.body
            const objectBody = ['message','status']
            objectBody.forEach(dt => {
                expect(body).to.have.property(dt)
            })
            expect(body['status']).to.be.a('string').to.equal('failed')
            expect(body['message']).to.be.a('object')
            expect(body['message']['username'][0]).to.equal('The username field must be at least 6 characters.')
        })
    })

    it('TC-INT-AU-004 : User Cant Login With Empty Username', () => {
        const test_data = {
            username : "",
            password : 'nopass1234',
        }

        cy.request({
            method: method,
            url: url,
            body: test_data,
            failOnStatusCode: false
        }).as('FailedPostLoginWithEmptyUsername')
        cy.get('@FailedPostLoginWithEmptyUsername').then(dt => {
            expect(dt.status).to.equal(400)

            const body = dt.body
            const objectBody = ['message','status']
            objectBody.forEach(dt => {
                expect(body).to.have.property(dt)
            })
            expect(body['status']).to.be.a('string').to.equal('failed')
            expect(body['message']).to.be.a('object')
            expect(body['message']['username'][0]).to.equal('The username field is required.')
        })
    })
})
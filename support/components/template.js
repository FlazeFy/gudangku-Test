Cypress.Commands.add('templateGet', (obj, is_paginate) => {
    let dataType

    // Builder
    if(is_paginate){
        dataType = 'object'
    } else {
        dataType = 'array'
    }

    // Test
    expect(obj.status).to.equal(200)
    expect(obj.body.message).to.be.a('string')

    if(is_paginate == false){
        expect(obj.body.data).to.be.a(dataType)
    }

    if(is_paginate == true){
        expect(obj.body.data.data).to.be.a('array')
    }
});

Cypress.Commands.add('templatePost', (obj, builder) => {
    // Test
    expect(obj.status).to.equal(200)
    expect(obj.body.message).to.be.a('string')
    // expect(obj.body.data.rows_affected).to.eq(1)
    
    Object.entries(builder).forEach(([key, value]) => {
        expect(obj.body.data[key]).to.eq(value)
    });
});

Cypress.Commands.add('templatePut', (obj) => {
    // Test
    expect(obj.status).to.equal(200)
    expect(obj.body.message).to.be.a('string')
});

Cypress.Commands.add('templatePagination', (url, max) => {
    for (let index = 1; index <= max; index++) {
        cy.request({
            method: 'GET', 
            url: url + '?page='+index,
        }).then(dt => {
            expect(dt.status).to.equal(200)
        })
    }
});

Cypress.Commands.add('templateValidateColumn', (data, obj, dataType, nullable) => {
    const dataArray = Array.isArray(data) ? data : [data];

    dataArray.forEach((item) => {
        expect(item).to.be.an('object')
        obj.forEach((field) => {
            expect(item).to.have.property(field)
            if (nullable && item[field] === null) {
                expect(item[field]).to.be.null
            } else {
                expect(item[field]).to.be.a(dataType)

                if (dataType === "number") {
                    expect(item[field] % 1).to.equal(0)
                }
            }
        });
    });
});

Cypress.Commands.add('templateValidateContain', (data, list, target) => {
    // Test
    data.forEach((item) => {
        expect(item).to.be.an('object')
        expect(list).to.include(item[target])
    });
});

// E2E Template
Cypress.Commands.add('templateE2ELogin', (username, password) => {
    const BASEURL = 'http://localhost:8000'
    const date = new Date().toISOString().replace(/:/g, '-')

    // Pre Condition : User Must Logged In To Their Account
    cy.visit(`${BASEURL}/`)
    cy.get('#username-input').type(username)
    cy.get('#password-input').type(password)
    cy.get('#submit-login-btn').click()
    cy.url().should('include', '/')
})
Cypress.Commands.add('templateE2EOpenControlPanel', () => {
    cy.get('.control-panel a[data-bs-toggle="collapse"]').then($link => {
        cy.get('#collapseControl').then($panel => {
            if (!$panel.hasClass('show')) {
                cy.wrap($link).click()
            }
        })
    })
})
Cypress.Commands.add('templateE2ESelectControlPanel', (target,value) => {
    cy.get('.control-panel').should('exist').within(() => {
        cy.contains('Control Panel')
        cy.scrollTo('top')
        cy.wait(1000)
        cy.get(target).should('exist').select(value)
        cy.wait(1000)
    })
})
Cypress.Commands.add('templateE2ESearchControlPanel', (target,value) => {
    cy.get('.control-panel').should('exist').within(() => {
        cy.contains('Control Panel')
        cy.scrollTo('top')
        cy.wait(1000)
        cy.get(target).should('exist').type(value).blur()
        cy.wait(1000)
    })
})
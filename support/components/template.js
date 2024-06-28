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
    // Test
    data.forEach((item) => {
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
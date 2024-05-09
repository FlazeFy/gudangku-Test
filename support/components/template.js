Cypress.Commands.add('templateGet', (obj, is_paginate) => {
    let dataType

    // Builder
    if(is_paginate == true || is_paginate == null){
        dataType = 'object'
    } else {
        dataType = 'array'
    }

    // Test
    expect(obj.status).to.equal(200)
    expect(obj.body.message).to.be.a('string')

    if(is_paginate == false || is_paginate == null){
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
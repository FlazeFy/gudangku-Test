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
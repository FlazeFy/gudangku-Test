Cypress.Commands.add('templateValidateColumn', (data, obj, dataType, nullable) => {
    const dataArray = Array.isArray(data) ? data : [data];

    dataArray.forEach((item) => {
        expect(item).to.be.an('object')
        obj.forEach((field) => {
            expect(item).to.have.property(field)
            if (nullable && item[field] === null) {
                expect(item[field]).to.be.null
            } else {
                expect(item[field]).to.be.a(dataType === "bool_number" ? "number" : dataType)

                if (dataType === "number") {
                    Number.isInteger(item[field]) ? expect(item[field] % 1).to.equal(0) : expect(item[field] % 1).to.not.equal(0)
                } else if (dataType === 'bool_number') {
                    Number.isInteger(item[field]) && expect([0,1]).to.include(item[field])
                }
            }
        });
    });
});

Cypress.Commands.add('templateValidateMaxMin', (data, obj) => {
    const dataArray = Array.isArray(data) ? data : [data];

    dataArray.forEach((item) => {
        obj.forEach((field) => {
            const col_name = field['column_name']
            const data_type = field['data_type']
            const max = field['max']
            const min = field['min']
            const nullable = field['nullable']
            const props_msg = `${data_type == 'number' ? 'value' : data_type == 'string' ? 'character length' : ''}`

            if (!nullable || item[col_name] != null) {
                let data_length = null 

                if(data_type === "number"){
                    data_length = item[col_name]
                } else if(data_type === "string"){
                    data_length = item[col_name].length
                }

                if(max && min && max == min){
                    expect(data_length, `Column ${col_name} ${props_msg} must equal to ${max}`).to.be.equal(max)
                } else {
                    if (max !== null && max !== undefined) expect(data_length, `Column ${col_name} must have ${props_msg} less than or equal to ${max}`).to.be.at.most(max)
                    if (min !== null && min !== undefined) expect(data_length, `Column ${col_name} must have ${props_msg} more than or equal to ${min}`).to.be.at.least(min)
                }
            }
        });
    });
})

Cypress.Commands.add('templateValidateDateTime', (data, obj) => {
    const dataArray = Array.isArray(data) ? data : [data];

    dataArray.forEach((item) => {
        obj.forEach((field) => {
            const col_name = field['column_name']
            const date_type = field['date_type']
            const nullable = field['nullable']

            if (!nullable || item[col_name] != null) {
                if (date_type === "datetime") {
                    expect(item[col_name]).to.match(
                        /^(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/,
                        `${col_name} must be a valid datetime (ISO 8601 or SQL format)`
                    );                    
                } else if (date_type === "time") {
                    expect(item[col_name]).to.match(/^\d{2}:\d{2}:\d{2}$/, `${col_name} must be a valid time`);
                } else if (date_type === "date") {
                    expect(item[col_name]).to.match(/^\d{4}-\d{2}-\d{2}$/, `${col_name} must be a valid date`);
                }
            }
        });
    });
})
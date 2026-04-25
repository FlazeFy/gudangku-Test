const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const fs = require('fs')
const XLSX = require('xlsx')
const axios = require('axios')

module.exports = defineConfig({
    e2e: {
        // baseUrl : 'https://gudangku.leonardhors.site',
        baseUrl: 'http://127.0.0.1:8000',
        specPattern: [
            'cypress/e2e/**/*.feature',
            'cypress/e2e/**/*.js'
        ],

        async setupNodeEvents(on, config) {
            await addCucumberPreprocessorPlugin(on, config)

            on('file:preprocessor', createBundler({
                plugins: [createEsbuildPlugin(config)],
            }))

            on('task', {
                // Download and parse (Node side)
                async downloadAndParseExcel({ url, token, filePath }) {
                    const response = await axios({
                        method: 'GET',
                        url,
                        responseType: 'arraybuffer',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    // Save file
                    fs.writeFileSync(filePath, response.data)

                    // Take dataset's header (first row)
                    const workbook = XLSX.read(response.data, { type: 'buffer' })
                    const sheetName = workbook.SheetNames[0]
                    const sheet = workbook.Sheets[sheetName]

                    // Convert to json
                    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

                    return {
                        status: response.status, 
                        contentType: response.headers['content-type'],
                        contentDisposition: response.headers['content-disposition'],
                        header: data[0],
                        rowCount: data.length
                    }
                }

            })

            return config
        },
    },
})
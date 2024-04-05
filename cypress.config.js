const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        // baseUrl : 'https://gudangku.leonardhors.site',
        baseUrl: 'http://127.0.0.1:8000/',
        specPattern : "support",
        supportFile : false
    }
})
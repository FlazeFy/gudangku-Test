const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        // baseUrl : 'https://gudangku.leonardhors.site',
        baseUrl: 'http://127.0.0.1:1323/',
        specPattern : "support",
        supportFile : false
    }
})
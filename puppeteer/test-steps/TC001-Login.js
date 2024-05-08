const puppeteer = require('puppeteer');

(async () => {
    const BASEURL = 'http://127.0.0.1:8000'
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const date = new Date()
    await page.setViewport({ width: 1920, height: 1080 })

    try {
        // Test Step 1 : Pengguna membuka halaman login
        await page.goto(`${BASEURL}/login`)

        // Test Step 2 : Pengguna mengisikan form login
        await page.locator('input#username').fill('flazefy')
        await page.locator('input#password').fill('nopass123')
        await page.screenshot({
            path: `TC-001-Step 2-Test Data on ${date}.png`,
        })

        // Test Step 3 : Pengguna menekan button submit
        await page.locator('a#submit_btn').click()

        await page.evaluate(() => {
            alert(`TC-001 Login Test Success`)
        }, [])
    } catch (error) {
        await page.evaluate((errorMessage) => {
            alert('Error occurred: ' + errorMessage)
        }, error.message)
    }
})();

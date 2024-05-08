const puppeteer = require('puppeteer');

(async () => {
    const BASEURL = 'http://127.0.0.1:8000'
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    const date = new Date()
    await page.setViewport({ width: 1920, height: 1080 })

    try {
        // Test Step 1 : Pengguna telah masuk kedalam aplikasi
        await page.goto(`${BASEURL}/login`)

        await page.locator('input#username').fill('flazefy')
        await page.locator('input#password').fill('nopass123')
        await page.locator('a#submit_btn').click()
        await page.waitForNavigation()

        // Test Step 2 : Pengguna menekan menu My Inventory
        await page.locator('button#nav_inventory_btn').click()
        await page.waitForNavigation()

        // Test Step 3 : Pengguna melihat table inventory
        await page.screenshot({
            path: `TC-003-Step 3.1-Result on ${date}.png`,
        })

        // Test Step 3 : dan mode catalog
        await page.locator('button#toogle_view').click()
        await page.waitForNavigation()
        await page.screenshot({
            path: `TC-003-Step 3.2-Result on ${date}.png`,
        })

        await page.evaluate(() => {
            alert(`TC-003 Get all inventory Test Success`)
        }, [])
    } catch (error) {
        await page.evaluate((errorMessage) => {
            alert('Error occurred: ' + errorMessage)
        }, error.message)
    }
})();

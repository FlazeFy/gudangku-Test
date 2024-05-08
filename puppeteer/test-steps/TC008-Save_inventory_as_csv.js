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

        // Test Step 3 : Pengguna menekan tombol Save as CSV
        await page.locator('button#save_as_csv_btn').click()

        await page.evaluate(() => {
            alert(`TC-008 Save_inventory_as_csv Test Success`)
        }, [])
    } catch (error) {
        await page.evaluate((errorMessage) => {
            alert('Error occurred: ' + errorMessage)
        }, error.message)
    }
})();

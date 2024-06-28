const puppeteer = require('puppeteer');
const { add_firestore } = require('../../audit/firebase/command')
const BASEURL = 'http://127.0.0.1:8000'

puppeteer.launch({ headless: false }).then(async (browser) => {
    const page = await browser.newPage()
    const date = new Date()
    await page.setViewport({ width: 1920, height: 1080 })

    try {
        // Test Data
        const username = 'flazefy'
        const password = 'nopass123'

        // Test Step 1 : Pengguna telah masuk kedalam aplikasi
        await page.goto(`${BASEURL}/login`)

        await page.locator('input#username').fill(username)
        await page.locator('input#password').fill(password)
        await page.locator('a#submit_btn').click()
        await page.waitForNavigation()

        // Test Step 2 : Pengguna menekan menu My Inventory
        await page.locator('button#nav_inventory_btn').click()
        await page.waitForNavigation()

        // Test Step 3 : Pengguna menekan tombol Save as CSV
        await page.locator('button#save_as_csv_btn').click()

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-008',
            tc_name: 'Save inventory as csv',
            tc_desc: 'Validate Test Steps for save inventory list as csv',
            tc_data: {
                username: username,
                password: password,
            },
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-008 Save_inventory_as_csv Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

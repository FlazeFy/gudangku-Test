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

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-003',
            tc_name: 'Get all inventory',
            tc_desc: 'Validate Test Steps for show all inventory',
            tc_data: {
                username: username,
                password: password,
            },
            tc_evidence_name: [`TC-003-Step 3.1-Result on ${date}.png`,`TC-003-Step 3.2-Result on ${date}.png`],
            tested_at: date,
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-003 Get all inventory Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

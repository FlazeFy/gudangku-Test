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
        let item = {}

        // Test Step 1 : Pengguna telah masuk kedalam aplikasi
        await page.goto(`${BASEURL}/login`)

        await page.locator('input#username').fill(username)
        await page.locator('input#password').fill(password)
        await page.locator('a#submit_btn').click()
        await page.waitForNavigation()

        // Test Step 2 : Pengguna menekan menu Stats (View total by item)
        await page.locator('button#nav_history_btn').click()
        await page.waitForNavigation()
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)))
        await page.screenshot({
            path: `TC-010-Step 2 Result on ${date}.png`,
        })  

        // Test Step 3 : Pengguna menekan tombol Save as CSV
        await page.locator('button#save_as_csv_btn').click()

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-010',
            tc_name: 'See history',
            tc_desc: 'Validate Test Steps for See history',
            tc_data: {
                username: username,
                password: password,
            },
            tc_evidence_name: [`TC-010-Step 2 Result on ${date}.png`],
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-010 See history Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

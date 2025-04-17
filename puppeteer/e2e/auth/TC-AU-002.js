const puppeteer = require('puppeteer');
const { add_firestore } = require('../../../audit/firebase/command')
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

        // Test Step 2 : Pengguna menekan menu Profile
        await page.locator('button#nav_profile_btn').click()
        await page.waitForNavigation()
        await page.screenshot({ path: `TC-AU-002-Step 2-Result on ${date}.png`})

        // Test Step 3 : Pengguna menekan tombol sign out
        await page.locator('a#sign_out_btn').click()
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.screenshot({ path: `TC-AU-002-Step 3-Result on ${date}.png` })

        // Test Step 4 : Pada pop up validasi, pengguna menekan tombol Yes, Sign Out
        await page.waitForFunction(
            () => document.querySelector('div#modalSignOut').classList.contains('show'),
            { timeout: 3000 }
        );

        await page.locator('a#validation_sign_out_btn').click()
        await page.waitForNavigation()
        await page.screenshot({ path: `TC-AU-002-Step 4-Result on ${date}.png` })

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-AU-002',
            tc_name: 'Pengguna Dapat Keluar Dari Aplikasi',
            tc_desc: 'Validate Test Steps for sign out',
            tc_data: {
                username: username,
                password: password,
            },
            tc_evidence_name: [`TC-AU-002-Step 2-Result on ${date}.png`,`TC-AU-002-Step 3-Result on ${date}.png`,`TC-AU-002-Step 4-Result on ${date}.png`],
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-AU-002 Sign Out Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

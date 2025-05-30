const puppeteer = require('puppeteer')
const { add_firestore } = require('../../../audit/firebase/command')

const BASEURL = 'http://127.0.0.1:8000'

puppeteer.launch({ headless: false }).then(async (browser) => {
    const page = await browser.newPage();
    const date = new Date();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        // Test Data
        const username = 'flazefy'
        const password = 'nopass123'

        // Test Step 1 : Pengguna membuka halaman login
        await page.goto(`${BASEURL}/login`)

        // Test Step 2 : Pengguna mengisikan form login
        await page.locator('input#username').fill(username)
        await page.locator('input#password').fill(password)
        await page.screenshot({ path: `TC-AU-001-Step 2-Test Data on ${date}.png` });

        // Test Step 3 : Pengguna menekan button submit
        await page.locator('a#submit_btn').click()
        await new Promise(resolve => setTimeout(resolve, 3000))
        await page.screenshot({ path: `TC-AU-001-Step 3-Test Data on ${date}.png` });

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-001',
            tc_name: 'Pengguna Dapat Login Menggunakan Data Valid',
            tc_desc: 'Validate Test Steps for login using username and password',
            tc_data: {
                username: username,
                password: password,
            },
            tc_evidence_name: [`TC-AU-001-Step 2-Test Data on ${date}.png`, `TC-AU-001-Step 3-Test Data on ${date}.png`],
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-001 Login Test Success`)
        });
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});
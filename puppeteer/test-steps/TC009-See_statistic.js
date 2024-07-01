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
        await page.locator('button#nav_stats_btn').click()
        await page.waitForNavigation()
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)))
        await page.screenshot({
            path: `TC-009-Step 2 Result on ${date}.png`,
        })  

        // Test Step 3 : Pengguna memilih toogle total (View total by price)
        await page.evaluate(() => {
            const select = document.querySelector('#toogle_total')
            const options = Array.from(select.options)
            options.forEach((option, index) => {
                if (index !== 0) {
                    option.selected = true
                } else {
                    option.selected = false
                }
            })
            select.dispatchEvent(new Event('change', { bubbles: true }))
        });
        await page.waitForNavigation()
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)))
        await page.screenshot({
            path: `TC-009-Step 3 Result on ${date}.png`,
        })  

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-009',
            tc_name: 'See statistic',
            tc_desc: 'Validate Test Steps for See statistic',
            tc_data: {
                username: username,
                password: password,
            },
            tc_evidence_name: [`TC-009-Step 3 Result on ${date}.png`,`TC-009-Step 4 Result on ${date}.png`],
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-009 See statistic Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

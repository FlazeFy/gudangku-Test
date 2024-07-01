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

        // Test Step 2 : Pengguna menekan menu My Inventory
        await page.locator('button#nav_inventory_btn').click()
        await page.waitForNavigation()

        // Test Step 3 : Pengguna memilih salah satu item
        // Notes : Memilih item pertama yang tidak favorite
        await page.screenshot({
            path: `TC-004-Step 3 Result on ${date}.png`,
        })  
        const rows = await page.$$('#inventory_tb tbody tr.tr-item') // item holder

        for (let i = 0; i < rows.length; i++) {
            const firstFavorite = await page.evaluate((row, rowIndex) => {
                const td_favorite = row.querySelectorAll('td')[10] // is favorite column
                const td_name = row.querySelectorAll('td')[0] // inventory name column
        
                if (td_favorite) {
                    const input = td_favorite.querySelector('input[name="is_favorite"]')
                    const toogle = '1' // set 1 if choose item to favorite and 0 to unfavorite
                    if (input && input.value == toogle) { 
                        const form = td_favorite.querySelector('form')
                        if (form) {
                            form.submit()
                            return {
                                rowIndex: rowIndex + 1,
                                value: input.value,
                                name: td_name.textContent.trim(),
                                toogle: toogle
                            }
                        }
                    }
                }
                return null
            }, rows[i], i)
        
            if (firstFavorite) {
                console.log(`Found on row ${firstFavorite.rowIndex}: Inventory Name = ${firstFavorite.name}`)
                item = {
                    index: firstFavorite.rowIndex,
                    inventory_name: firstFavorite.name,
                    set_to: firstFavorite.toogle == '1' ? 'Favorite' : 'Normal Item'
                }
                break
            }
        }

        await page.waitForNavigation()
        await page.screenshot({
            path: `TC-004-Step 4 Result on ${date}.png`,
        })  

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-004',
            tc_name: 'Set favorite inventory',
            tc_desc: 'Validate Test Steps for set favorite inventory',
            tc_data: {
                username: username,
                password: password,
                inventory: item
            },
            tc_evidence_name: [`TC-004-Step 3 Result on ${date}.png`,`TC-004-Step 4 Result on ${date}.png`],
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-004 Set favorite inventory Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

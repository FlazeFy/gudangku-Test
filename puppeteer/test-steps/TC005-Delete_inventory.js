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
        // Notes : Memilih item pertama yang belum didelete
        await page.screenshot({
            path: `TC-005-Step 3 Result on ${date}.png`,
        })  
        const rows = await page.$$('#inventory_tb tbody tr.tr-item') // item holder

        for (let i = 0; i < rows.length; i++) {
            const firstDelete = await page.evaluate((row, rowIndex) => {
                const td_delete = row.querySelectorAll('td')[13] // delete column
                const td_name = row.querySelectorAll('td')[0] // inventory name column
        
                if (td_delete) {
                    // Test Step 4 : Pengguna menekan button yang berada pada kolom deleted
                    const type_delete = td_delete.querySelector('input[name="type_delete"]')
                    const button = td_delete.querySelector('button.modal-btn')
                    button.click()

                    return new Promise(resolve => {
                        setTimeout(() => {
                            const toogle = 'soft'
                            if (type_delete && type_delete.value == toogle) {
                                // Test Step 5 : Pada pop up validasi, pengguna menekan tombol Yes, Delete
                                const form = td_delete.querySelector('form')
                                if (form) {
                                    form.submit()
                                    resolve({
                                        rowIndex: rowIndex + 1,
                                        type_delete: type_delete.value,
                                        name: td_name.textContent.trim(),
                                    });
                                }
                            }
                            resolve(null)
                        }, 3000)
                    })
                }
                return null
            }, rows[i], i)
        
            if (firstDelete) {
                console.log(`Found on row ${firstDelete.rowIndex}: Inventory Name = ${firstDelete.name}`)

                await page.screenshot({ path: `TC-005-Step 4-Result-before-submit-${date}.png` })                
                
                item = {
                    index: firstDelete.rowIndex,
                    inventory_name: firstDelete.name,
                    type: firstDelete.type_delete == 'soft' ? 'Delete' : 'Permentally delete'
                }
                break
            }
        }

        await page.waitForNavigation()
        await page.screenshot({
            path: `TC-005-Step 4 Result on ${date}.png`,
        })  

        // Audit
        let data = {
            pic: 'Leonardho R Sitanggang',
            tc_id: 'TC-005',
            tc_name: 'Delete inventory',
            tc_desc: 'Validate Test Steps for delete inventory',
            tc_data: {
                username: username,
                password: password,
                inventory: item
            },
            tc_evidence_name: [`TC-005-Step 3 Result on ${date}.png`,`TC-005-Step 4 Result on ${date}.png`],
            tested_at: date,
            tc_base_url: BASEURL
        };
        await add_firestore(data, 'test_audit_gudangku')

        await page.evaluate(() => {
            alert(`TC-005 delete inventory Test Success`)
        }, [])
    } catch (error) {
        console.error('Error occurred:', error.message)
    } finally {
        await browser.close()
    }
}).catch((error) => {
    console.error('Failed to launch browser:', error)
});

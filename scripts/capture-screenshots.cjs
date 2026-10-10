const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const jquery = fs.readFileSync(require.resolve('jquery/dist/jquery.min.js'),'utf8');
  await page.route('https://code.jquery.com/jquery-3.7.1.min.js', route =>
    route.fulfill({status:200,contentType:'application/javascript; charset=utf-8',body:jquery}));
  const site = 'http://127.0.0.1:8123';
  await page.goto(site, {waitUntil:'load'});
  await page.waitForFunction(() => document.querySelectorAll('.task-card').length === 3, {timeout:15000});
  fs.mkdirSync('screenshots',{recursive:true});
  await page.screenshot({path:'screenshots/01-masaustu.png',fullPage:true});

  await page.locator('#task-title').fill('İstatistik sınavına hazırlan');
  await page.locator('#task-course').fill('İstatistik');
  await page.locator('#task-priority').selectOption({label:'Yüksek'});
  await page.locator('#task-form button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelectorAll('.task-card').length === 4);
  await page.screenshot({path:'screenshots/02-gorev-ekleme.png',fullPage:true});

  await page.locator('.filter-btn[data-filter="complete"]').click();
  await page.waitForFunction(() => document.querySelectorAll('.task-card').length === 1);
  await page.screenshot({path:'screenshots/03-filtreleme.png',fullPage:true});
  await page.locator('.filter-btn[data-filter="all"]').click();

  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'screenshots/04-mobil.png',fullPage:true});
  console.log('Created four actual browser screenshots:', fs.readdirSync('screenshots').filter(x=>x.endsWith('.png')));
  await browser.close();
})().catch(error => {console.error(error); process.exit(1)});

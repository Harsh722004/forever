import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const BASE_URL = process.env.APP_URL || 'http://localhost:5173'
const OUT_DIR = path.resolve(process.cwd(), 'public', 'screenshots')

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function capture(page, route, filename, wait = 300) {
  const url = `${BASE_URL}${route}`
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
  await page.waitForTimeout(wait)
  const outPath = path.join(OUT_DIR, filename)
  await page.screenshot({ path: outPath, fullPage: true })
  console.log('Saved', outPath)
}

async function main() {
  await ensureDir(OUT_DIR)
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1366, height: 900 } })
  const page = await browser.newPage()

  await capture(page, '/', 'home.png')
  await capture(page, '/collection', 'collection.png')
  // Use a known product id from src/assets/assets.js
  await capture(page, '/product/aaaaa', 'product.png')
  await capture(page, '/cart', 'cart.png')
  await capture(page, '/place-order', 'place-order.png')
  await capture(page, '/orders', 'orders.png')
  await capture(page, '/login', 'login.png')
  await capture(page, '/about', 'about.png')
  await capture(page, '/contact', 'contact.png')

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})



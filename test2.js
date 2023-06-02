const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Keyboard } = require('selenium-webdriver/lib/input');
const fs = require('fs');
async function getCookies() {
  // Set Chrome options to run in headless mode
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--user-agent="Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 640 XL LTE) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Mobile Safari/537.36 Edge/12.10166"');
  chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--disable-extensions'); // Exclude the collection of enable-automation switches
  chromeOptions.addArguments('--headless');

  chromeOptions.setUserPreferences({ useAutomationExtension: false }); // Turn-off useAutomationExtension
  chromeOptions.setLoggingPrefs({ performance: 'ALL' });
  // chromeOptions.headless();
  // Create a new Selenium WebDriver instance
  const driver = await new Builder().forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
  let result = '';
  try {
    await driver.executeScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})");
    await driver.get('https://www.china-airlines.com/us/en');
    // Navigate to a website
    const btnCookie = await driver.wait(until.elementIsEnabled(driver.findElement(By.className('btn-cookie'))));
    btnCookie.click();
    const oneWay = await driver.wait(until.elementIsEnabled(driver.findElement(By.id('One-way'))));
    await driver.executeScript("arguments[0].click();", oneWay);
    const fromBooking = await driver.wait(until.elementIsEnabled(driver.findElement(By.id('From-booking'))));
    await driver.executeScript("arguments[0].click();", fromBooking);
    await fromBooking.sendKeys("HAN");
    const selectFrom = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="From-booking-suggestions"]/li[2]'))));
    await sleep(500);
    await selectFrom.click();
    const toBooking = await driver.wait(until.elementIsEnabled(driver.findElement(By.id('To-booking'))));
    await driver.executeScript("arguments[0].click();", toBooking);
    await toBooking.sendKeys("SIN");
    const selectTo = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="To-booking-suggestions"]/li[2]'))));
    await sleep(500);
    await selectTo.click();
    const searchBtn = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="FlightSearchResultPost"]/div[3]/div[2]/div/div[2]/div[2]/div/div[2]/a'))));
    await searchBtn.click();
    await sleep(3000);
    const goBtn = await driver.wait(until.elementIsEnabled(driver.findElement(By.id('btnGo'))));
    await driver.executeScript("arguments[0].click();", goBtn);
    await sleep(3000);
    console.log(await driver.getPageSource())
    // const captchaBtn = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="captcha-box"]/div'))));
    // await captchaBtn.click();
    // await sleep(5000);
    // Get the cookies
    const cookies = await driver.manage().getCookies();

    cookies.forEach((cookie) => {
      if (result === '') {
        result = cookie['name'] + '=' + cookie['value'];
      } else {
        result += ';' + cookie['name'] + '=' + cookie['value'];
      }
    })
  } finally {
    // Close the browser
    // await driver.quit();
  }
  return result;
}

async function get(){
  const cookie = await getCookies();
  console.log(cookie)
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function read_data() {
  const filePath = './config/cookie';

  try {
    const cookieString = await new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    console.log(cookieString);
    return cookieString;
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

get();




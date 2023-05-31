const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
async function getCookies() {
  // Set Chrome options to run in headless mode
  const chromeOptions = new chrome.Options();
  chromeOptions.setLoggingPrefs({ performance: 'ALL' });
  // chromeOptions.headless();
  // Create a new Selenium WebDriver instance
  const driver = await new Builder().forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
  let result = '';
  try {
    // Navigate to a website
    await driver.get('https://www.china-airlines.com/us/en');
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
    const captchaBtn = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="captcha-box"]/div'))));
    await captchaBtn.click();
    await sleep(5000);
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
get();




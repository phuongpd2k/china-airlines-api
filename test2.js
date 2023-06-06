const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Keyboard } = require('selenium-webdriver/lib/input');
const fs = require('fs');
const { verify } = require('crypto');
async function getCookies() {

  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"');
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
    await sleep(750);
    await fromBooking.sendKeys("HAN");
    const selectFrom = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="From-booking-suggestions"]/li[1]'))));
    await selectFrom.click();
    const toBooking = await driver.wait(until.elementIsEnabled(driver.findElement(By.id('To-booking'))));
    await driver.executeScript("arguments[0].click();", toBooking);
    await sleep(750);
    await toBooking.sendKeys("SIN");
    const selectTo = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="To-booking-suggestions"]/li[1]'))));
    await selectTo.click();
    const searchBtn = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="FlightSearchResultPost"]/div[3]/div[2]/div/div[2]/div[2]/div/div[2]/a'))));
    await searchBtn.click();
    await sleep(3000);
    await driver.wait(driver.executeScript("document.book.submit()"));
    await sleep(3000);
    console.log(await driver.getPageSource())
    const captchaBtn = await driver.wait(until.elementIsEnabled(driver.findElement(By.xpath('//*[@id="captcha-box"]/div'))));
    await captchaBtn.click();
    await sleep(5000);
    let isVerify = false;

    while (true) {
      if (isVerify) {
        
        break;
      }
      await sleep(3000);
    }

  } finally {
    // Close the browser
    // await driver.quit();
  }
  return result;
}

async function get() {
  const cookie = await getCookies();
  console.log(cookie)
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

get();




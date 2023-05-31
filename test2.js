const { Builder, By, Capabilities } = require('selenium-webdriver');

async function getCookies() {
    // Set up the WebDriver instance
    const driver = await new Builder().withCapabilities(Capabilities.chrome()).build();
  
    try {
      // Navigate to a website
      await driver.get('https://www.china-airlines.com/us/en');
  
      // Get the cookies
      const cookies = await driver.manage().getCookies();
     cookies.forEach((cookie) => console.log(cookie['name'] + '=' + cookie['value']))
    } finally {
      // Close the browser
      await driver.quit();
    }
  }
  
  getCookies();




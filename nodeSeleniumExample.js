const {Builder, until, By} = require('selenium-webdriver');
const {HttpClient} = require("./dbc_lib");
const chrome = require('selenium-webdriver/chrome');

const USERNAME = 'joseph.anderson'   // Your DBC username here
const PASSWORD = 'FV~Z;f:5;]Ehp$*VW^P^'   // Your DBC password here
const CAPTCHA_URL = 'https://www.google.com/recaptcha/api2/demo'

const chromeOptions = new chrome.Options();
async function solve_captcha(captcha) {
    const client = new HttpClient(USERNAME, PASSWORD);
    console.log(`Balance: ${await client.get_balance()}`);
    return await client.decode(captcha);
}


(async function example() {
    const driver = await new Builder().forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
    try {
        await driver.get(CAPTCHA_URL);
        let element = await driver.wait(until.elementLocated(By.id('recaptcha-demo')));

        let googleKey = await element.getDomAttribute('data-sitekey')
        console.log(`sitekey: ${googleKey}`);

        let captcha = {
            extra: {
                type: 4,
                token_params: JSON.stringify({
                    'googlekey': googleKey,
                    'pageurl': CAPTCHA_URL
                })
            }
        };

        let solution = await solve_captcha(captcha);

        if (!solution) {
            console.log("No captcha solution (maybe implement retry)...closing")
            return;
        }

        console.log(`Solution: ${solution['text']}`);
        await driver.executeScript(
            `document.getElementById('g-recaptcha-response').value='${solution['text']}'`
        );

        let button = await driver.findElement(By.id('recaptcha-demo-submit'));
        await button.click();

        try{
            // Maybe here it's needed to wait a litle
            await driver.findElement(By.className('recaptcha-success'));
            console.log('Success')
        }catch (e) {
            console.log(`Success message not found: ${e}`);
        }

    } catch (e) {
        console.log(e);
    }
    finally {
        await driver.quit();
    }
})();
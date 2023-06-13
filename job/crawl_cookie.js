const { schedule } = require('node-cron');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const Jimp = require('jimp');
const pixelmatch = require('pixelmatch');
const { cv } = require('opencv-wasm');
const moment = require('moment');
const redisClient = require('../config/redisClient');
async function init_cookie() {
	for (let i = 1; i <= 5; i++) {
		save_cookie(i).catch(e => console.error('An error occurred:', e.message))
	}
}
async function save_cookie(i) {
	try {
		let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
		console.log(`${currentTime}: Start crawl cookie ${i}`)
		const cookie = await crawl_from_puppeteer();
		if (cookie !== null && cookie !== undefined) {
			if (cookie.includes('incap')) {	
				currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
				const redisKey = `farelive-chinaairlines-auth-${i}`;
				const redisValue = JSON.stringify({
					token: cookie,
					ts: currentTime
				  });
				await redisClient.set(redisKey, redisValue);
				console.log(`${currentTime} redisCookie ${i} is saved`);
				  return true;
			} else {
				console.log(`${currentTime}: Crawl cookie failed: Dont have required cookie`)
			}
		} else {
			console.log(`${currentTime}: Crawl cookie failed: Cookie is null`)
		}
	} catch (error) {
		console.error('An error occurred:', error.message);
	}
	return false;
}
async function crawl_cookie() {
	// Schedule a cron job to run every minute
	schedule('*/4 * * * *', async () => {
			for (let i = 1; i <= 5; i++) {
				let result = await save_cookie(i);
				if(!result) {
					retry_crawl(i).catch(e=> console.error('An error occurred:', error.message));
				}
			}
	});
}
async function retry_crawl(i){
	let result = await save_cookie(i);
	while(!result) {
		result = await save_cookie(i);
	}
}
async function crawl_from_puppeteer() {
	let result = '';
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: [
			'--no-sandbox',
			'--headless',
			'--disable-gpu',
			'--disable-dev-shm-usage'
		  ]
	});
	try {
		const page = await browser.newPage();
		await page.setExtraHTTPHeaders({
			'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
		});
		await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148');
		await page.goto('https://www.china-airlines.com/us/en');

		await page.waitForSelector('.btn-cookie');
		const btnAcceptCookie = await page.$('.btn-cookie');
		await btnAcceptCookie.click();
		await page.waitForSelector('#One-way');
		const radioOneWay = await page.$('#One-way');
		await radioOneWay.click();

		await page.waitForSelector('#From-booking');
		const inputFrom = await page.$('#From-booking');
		await inputFrom.click();
		await page.waitForTimeout(1000);
		await page.type("#From-booking", "HAN")
		await page.waitForTimeout(250);

		await page.waitForXPath('//*[@id="From-booking-suggestions"]/li[1]');
		const [btnFromSelection] = await page.$x('//*[@id="From-booking-suggestions"]/li[1]');
		await btnFromSelection.click();
		await page.waitForSelector('#To-booking');
		const inputTo = await page.$('#To-booking');
		await inputTo.click();
		await page.waitForTimeout(1000);
		await page.type("#To-booking", "SIN");
		await page.waitForTimeout(250);
		await page.waitForXPath('//*[@id="To-booking-suggestions"]/li[1]');
		const [btnToSelection] = await page.$x('//*[@id="To-booking-suggestions"]/li[1]');
		await btnToSelection.click();
		await page.waitForTimeout(1500);
		await page.waitForXPath('//*[@id="FlightSearchResultPost"]/div[3]/div[2]/div/div[2]/div[2]/div/div[2]/a');
		const [btnSearch] = await page.$x('//*[@id="FlightSearchResultPost"]/div[3]/div[2]/div/div[2]/div[2]/div/div[2]/a');
		await btnSearch.click();
		await page.waitForSelector('#btnGo');
		const btnGo = await page.$('#btnGo');
		await btnGo.click();
		//verify
		await page.waitForTimeout(500);
		await clickVerifyButton(page);
		await page.waitForTimeout(1500);
		const images = await getCaptchaImages(page);
		const diffImage = await getDiffImage(images);
		const center = await getPuzzlePieceSlotCenterPosition(diffImage);

		await slidePuzzlePiece(page, center);
		await page.waitForTimeout(10000);
		const cookies = await await page.cookies();
		cookies.forEach((cookie) => {
			if (result === '') {
				result = cookie['name'] + '=' + cookie['value'];
			} else {
				result += ';' + cookie['name'] + '=' + cookie['value'];
			}
		})
	} catch (error) {
		console.error('An error occurred:', error.message);
	} finally {
		await browser.close();
	}
	return result;
}
async function clickVerifyButton(page) {
	await page.waitForSelector('[aria-label="Click to verify"]');
	await page.click('[aria-label="Click to verify"]');
	await page.waitForSelector('.geetest_canvas_img canvas', {
		visible: true,
	})
	await page.waitForTimeout(1500)
}

async function getCaptchaImages(page) {
	const images = await page.$$eval(
		'.geetest_canvas_img canvas',
		(canvases) => {
			return canvases.map((canvas) => {
				// This will get the base64 image data from the 
				// html canvas. The replace function simply strip
				// the "data:image" prefix.
				return canvas
					.toDataURL()
					.replace(/^data:image\/png;base64,/, '')
			})
		}
	);

	// For each base64 string create a Javascript buffer.
	const buffers = images.map((img) => Buffer.from(img, 'base64'));

	// And read each buffer into a Jimp image.
	return {
		captcha: await Jimp.read(buffers[0]),
		puzzle: await Jimp.read(buffers[1]),
		original: await Jimp.read(buffers[2]),
	};
}

async function getDiffImage(images) {
	const { width, height } = images.original.bitmap

	// Use the pixelmatch package to create an image diff
	const diffImage = new Jimp(width, height)
	pixelmatch(
		images.original.bitmap.data,
		images.captcha.bitmap.data,
		diffImage.bitmap.data,
		width,
		height,
		{ includeAA: true, threshold: 0.2 }
	)

	// Use opencv to make the diff result more clear
	const src = cv.matFromImageData(diffImage.bitmap)
	const dst = new cv.Mat()
	const kernel = cv.Mat.ones(5, 5, cv.CV_8UC1)
	const anchor = new cv.Point(-1, -1)
	cv.threshold(src, dst, 127, 255, cv.THRESH_BINARY)
	cv.erode(dst, dst, kernel, anchor, 1)
	cv.dilate(dst, dst, kernel, anchor, 1)

	return new Jimp({
		width: dst.cols,
		height: dst.rows,
		data: Buffer.from(dst.data),
	})
}

async function getPuzzlePieceSlotCenterPosition(diffImage) {
	const src = cv.matFromImageData(diffImage.bitmap)
	const dst = new cv.Mat()

	cv.cvtColor(src, src, cv.COLOR_BGR2GRAY)
	cv.threshold(src, dst, 150, 255, cv.THRESH_BINARY_INV)

	// This will find the contours of the image.
	const contours = new cv.MatVector()
	const hierarchy = new cv.Mat()
	cv.findContours(
		dst,
		contours,
		hierarchy,
		cv.RETR_EXTERNAL,
		cv.CHAIN_APPROX_SIMPLE
	)

	// Next, extract the center position from these contours.
	const contour = contours.get(0)
	const moment = cv.moments(contour)
	const cx = Math.floor(moment.m10 / moment.m00)
	const cy = Math.floor(moment.m01 / moment.m00)

	// Just for fun, let's draw the contours and center on a new image.
	cv.cvtColor(dst, dst, cv.COLOR_GRAY2BGR);
	const red = new cv.Scalar(255, 0, 0);
	cv.drawContours(dst, contours, 0, red);
	cv.circle(dst, new cv.Point(cx, cy), 3, red);
	new Jimp({
		width: dst.cols,
		height: dst.rows,
		data: Buffer.from(dst.data)
	}).write('./contours.png');

	return {
		x: cx,
		y: cy,
	}
}

async function slidePuzzlePiece(page, center) {
	const sliderHandle = await page.$('.geetest_slider_button')
	const handle = await sliderHandle.boundingBox()

	let handleX = handle.x + handle.width / 2;
	let handleY = handle.y + handle.height / 2;

	await page.mouse.move(handleX, handleY, { steps: 25 });
	await page.mouse.down();

	let destX = handleX + center.x;
	await page.mouse.move(destX, handleY, { steps: 25 });
	await page.waitForTimeout(100)

	// find the location of my puzzle piece.
	const puzzlePos = await findMyPuzzlePiecePosition(page)
	destX = destX + center.x - puzzlePos.x;
	let destY = handle.y + handle.height / 2;
	await page.mouse.move(destX, destY, { steps: 25 })
	await page.mouse.up()
}

async function findMyPuzzlePiecePosition(page) {
	// Must call the getCaptchaImages again, because we have changed the
	// slider position (and therefore the image)
	const images = await getCaptchaImages(page)
	const srcPuzzleImage = images.puzzle
	const srcPuzzle = cv.matFromImageData(srcPuzzleImage.bitmap)
	const dstPuzzle = new cv.Mat()

	cv.cvtColor(srcPuzzle, srcPuzzle, cv.COLOR_BGR2GRAY)
	cv.threshold(srcPuzzle, dstPuzzle, 127, 255, cv.THRESH_BINARY)

	const kernel = cv.Mat.ones(5, 5, cv.CV_8UC1)
	const anchor = new cv.Point(-1, -1)
	cv.dilate(dstPuzzle, dstPuzzle, kernel, anchor, 1)
	cv.erode(dstPuzzle, dstPuzzle, kernel, anchor, 1)

	const contours = new cv.MatVector()
	const hierarchy = new cv.Mat()
	cv.findContours(
		dstPuzzle,
		contours,
		hierarchy,
		cv.RETR_EXTERNAL,
		cv.CHAIN_APPROX_SIMPLE
	)

	const contour = contours.get(0)
	const moment = cv.moments(contour)

	return {
		x: Math.floor(moment.m10 / moment.m00),
		y: Math.floor(moment.m01 / moment.m00),
	}
}
module.exports = {
	crawl_cookie: crawl_cookie,
	init_cookie: init_cookie
};
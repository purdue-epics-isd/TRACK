const { Given, When, Then, AfterAll } = require('@cucumber/cucumber');
const { Builder, By, Capabilities, Key, until, sleep } = require('selenium-webdriver');
const { expect } = require('chai');


require("chromedriver");

function sleepMilli(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function safeClick(cssSelector) {
	driver.wait(until.elementIsEnabled(driver.wait(until.elementLocated(By.css(cssSelector), 10000)))).click();
}

function safeGet(cssSelector) {
	return driver.wait(until.elementIsEnabled(driver.wait(until.elementLocated(By.css(cssSelector), 10000))))
}

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();
const assert = require('assert');

Given('I am on the TRACK login page', {timeout: 50 * 5000}, async function () {
	// await driver.manage().setTimeouts( { implicit: 10000 } );
    await driver.get('https://track-dev-build.herokuapp.com');
    await new Promise(r => setTimeout(r, 500));
});

When('I click login', {timeout: 50 * 5000}, async function () {
	// console.log("search term", searchTerm);
    const element = await driver.findElement(By.id('SignIn'));
    element.click();
    // element.sendKeys(searchTerm, Key.RETURN);
    // console.log("logging element", element);
    // element.submit();
});

Then('the page title should be {string}', {timeout: 50 * 5000}, async function (string) {
	console.log("then begins");

	let title = await driver.findElement(By.tagName("title")).getAttribute("innerText");

	assert(title === string, "url is not correct");

	await driver.get('https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?response_type=id_token&scope=user.read%20openid%20profile&client_id=f4238741-ebe5-4017-94b5-4de9dc3c20b8&redirect_uri=https%3A%2F%2Ftrack-dev-build.herokuapp.com%2F&state=162f625d-91b8-4c25-a435-8dae3c318881&nonce=5925b1e2-1f11-4aed-93fd-95927ad20329&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.0.0&client-request-id=e8c15147-0d8c-4c62-8908-87d24f83cf67&response_mode=fragment');
	assert(await driver.findElement(By.tagName("title")).getAttribute("innerText") === "Sign in to your account");
	await sleepMilli(1000);


	await safeClick("input[type='email']");
	await sleepMilli(1000);

	await driver.findElement(By.css("input[type='email']")).sendKeys('anakeeb@purdue.edu', Key.RETURN);
	console.log("input email");
	await sleepMilli(1000);

	
	await safeClick("input[type='submit']");
	console.log("submit email");
	await sleepMilli(1000);


	await sleepMilli(2000);
	await safeClick("input[type='password']");
	await driver.findElement(By.css("input[type='password']")).sendKeys('P0031394010', Key.RETURN);
	console.log("input password");
	await sleepMilli(1000);

	await sleepMilli(1000);
	await safeClick("input[type='submit'] [id='idSIButton9']");
	await sleepMilli(10000);
	await safeClick("input[type='submit'] [id='idSIButton9']");
	console.log("submit password / stay signed in");
	await driver.get('https://purdue-epics-isd-track.herokuapp.com/');
	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	await safeClick("button[id='SignIn']");
	await driver.findElement(By.css("button[id='SignIn']")).click();
	await sleepMilli(10000);

	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	await safeClick("a[href='/createNewStudent']");
	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	await driver.findElement(By.css("input[name='firstname']")).sendKeys('required', Key.RETURN);
	await driver.findElement(By.css("input[name='lastname']")).sendKeys('only', Key.RETURN);
	await safeClick("input[type='submit']");
	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	let newStudents = await driver.findElements(By.css("div#studentBox class"));

	console.log(await newStudents[newStudents.length - 1].getAttribute("innerText"));


	assert(await newStudents[newStudents.length - 1].getAttribute("innerText") === 'required', "student was not successfully created");

	let newStudentsA = await driver.findElements(By.css("div#studentBox a"));
	let id = await newStudentsA[newStudentsA.length - 1].getAttribute("href");
	await console.log(id);

	sleepMilli(500);
	await newStudentsA[newStudentsA.length - 1].click();

	sleepMilli(500);
	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	let goals = await driver.findElements(By.css("div#goalsBox h4"));

	await console.log(await goals[goals.length - 1].getAttribute("href"));
	sleepMilli(500);
	await goals[goals.length - 1].click();
	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));

	await safeClick("input[id='name']");
	await driver.findElement(By.css("input[id='name']")).sendKeys("goal title",Key.RETURN);
	// await safeClick("textarea[id='description']");
	// await driver.findElement(By.css("textarea[id='description']")).sendKeys("goal description",Key.RETURN);
	// await safeClick("input[id='startDate']");
	// await driver.findElement(By.css("input[id='startDate']")).sendKeys("09292020",Key.RETURN);
	// await safeClick("input[id='endDate']");
	// await driver.findElement(By.css("input[id='endDate']")).sendKeys("09302020",Key.RETURN);
	// await safeClick("input[value='Academic Goal']");
	await driver.findElement(By.css("input[value='Academic Goal']"));
	await sleepMilli(1000);
	// await safeClick("input[id='score']");
	await driver.findElement(By.css("input[id='score']"));
	await sleepMilli(1000);
	// await safeClick("button[id='nextBtn']");
	await driver.findElement(By.css("button[id='nextBtn']"));
	await sleepMilli(500);

	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	sleepMilli(1000);
	let goalTitles = await driver.findElements(By.css("h4[class='card-title']"));
	await sleepMilli(1000);
	// console.log(await goalTitles[goalTitles.length - 1].getAttribute("innerText"))
	assert(await goalTitles[goalTitles.length - 2].getAttribute("innerText") === "goal title", "the goal was not made correctly");

	await sleepMilli(1000);
	goals = await driver.findElements(By.css("h4[class='card-title']"));
	await sleepMilli(1000);
	await goals[goals.length - 2].click();
	await sleepMilli(1000);

	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	await sleepMilli(1000);
	// await safeClick("input[id='score']");
	// await driver.findElement(By.css("input[id='score']")).sendKeys("10", Key.RETURN);
	await safeClick("form#submitForm input");
	await sleepMilli(1000);
	await driver.findElement(By.css("form#submitForm input")).sendKeys("10", Key.RETURN);
	await sleepMilli(1000);
	await safeClick("input[type='submit']");
	await sleepMilli(500);

	goals = await driver.findElements(By.css("h4[class='card-title']"));
	await sleepMilli(1000);
	await goals[goals.length - 2].click();


	console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));
	await console.log("should be in the specific goal page")
	await sleepMilli(1000);
	let tableElements = await driver.findElements(By.css("tr td"));
	console.log(await tableElements[tableElements.length - 3].getAttribute("innerText"));
	await sleepMilli(1000);
	assert(await tableElements[tableElements.length - 3].getAttribute("innerText") === "10", "Goal was not updated correctly");
	await sleepMilli(1000);
    console.log(await driver.findElement(By.tagName("title")).getAttribute("innerText"));



});

AfterAll(async function(){
    await driver.quit();
});
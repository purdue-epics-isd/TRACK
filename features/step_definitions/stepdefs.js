const { Given, When, Then, AfterAll } = require('@cucumber/cucumber');
const { Builder, By, Capabilities, Key } = require('selenium-webdriver');
const { expect } = require('chai');


require("chromedriver");

// driver setup
const capabilities = Capabilities.chrome();
capabilities.set('chromeOptions', { "w3c": false });
const driver = new Builder().withCapabilities(capabilities).build();
const assert = require('assert');

Given('I am on the TRACK login page', async function () {
	await driver.manage().setTimeouts( { implicit: 10000 } );
    await driver.get('https://track-dev-build.herokuapp.com');
    await new Promise(r => setTimeout(r, 500));
});

When('I click login', async function () {
	// console.log("search term", searchTerm);
    const element = await driver.findElement(By.id('SignIn'));
    element.click();
    // element.sendKeys(searchTerm, Key.RETURN);
    // console.log("logging element", element);
    // element.submit();
});

Then('the page title should be {string}', async function (string) {
	// Write code here that turns the phrase above into concrete actions
	let title = await driver.findElement(By.tagName("title")).getAttribute("innerText");
	console.log(title, string);
	console.log(title === string);
	assert(title === string, "test failed");
	const emailField = await driver.findElement(By.name('loginfmt'));
	emailField.sendKeys('anakeeb@purdue.edu');
	const emailSubmit = await driver.findElement(By.id('idSIButton9'));
	emailSubmit.click();
	

	// await driver.findElement(By.xpath("//a[@href='/createNewStudent']")).click();


});

AfterAll(async function(){
    await driver.quit();
});
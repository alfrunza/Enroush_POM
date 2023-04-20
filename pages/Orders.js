const {By, until, Actions, Key} = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config.json');

const MAIN_BANNER = By.css('.container .lazy');
const NORMAL_PADS = By.css('#pads a.bp-img[title="Normal"]');
const SUPER_PADS = By.css('#pads a.bp-img[title="Super"]');
const NIGHT_PADS = By.css('#pads a.bp-img[title="Noapte"]');
const MINI_TAMPONS = By.css('#tampons a.bp-img[title="Mini"]');
const NORMAL_TAMPONS = By.css('#tampons a.bp-img[title="Normal"]');
const SUPER_TAMPONS = By.css('#tampons a.bp-img[title="Super"]');
const NORMAL_LINERS = By.css('#liners a.bp-img[title="Normal"]');
const MENSTRUAL_PATCHES = By.css('#addon_products a.bp-img[title="Plasturi menstruali"]');
const INTIMATE_GEL = By.css('#addon_products a.bp-img[title="Gel intim natural"]')
const QUANTITY_BOX = By.css('.this-input[name="quantity"]');
const ADD_TO_CART = By.css('#add-to-cart-main-bottom');
const SEE_CART = By.xpath('//*[@id="pp-panel-bottom"]/div[4]/div[4]/div[2]/a[1]');
const TERMS_RADIO = By.css('.-c-os-terms-label');
const CASH_ON_DELIVERY = By.css('.btn-checkout-cod');
const EMAIL_FIELD = By.css('.input[name="email"]');
const FIRST_NAME_FIELD = By.css('.input[name="first_name"]');
const LAST_NAME_FIELD = By.css('.input[name="last_name"]');
const ADDRESS_FIELD = By.css('.input[name="address"]');
const COUNTY_FIELD = By.css('.cod-input-province .input');
const CITY_FIELD = By.css('.cod-input-city .input');
const ZIP_CODE_FIELD = By.css('.input[name="zip"]');
const PHONE_NUMBER_FIELD = By.css('.input[name="phone"]');
const FREE_SHIPPING_RADIO = By.css('.label[for="radio-free"] > .fake-checkbox-radio');
const COUPON_FIELD = By.css('#discount_code');
const SUBMIT_COUPON = By.css('.cod-discount > .btn');
const COUPON_CONFIRMATION = By.css('.cod-discount-success');
const ORDER_TOTAL = By.css('.cod-form-order-info-inner > .cod-totals > .cod-total:last-child > .cod-currency');
const SUBMIT_BUTTON = By.css('#submit-button');
const GO_TO_CART = By.css('#nav a[aria-label="cart"]');
const CONTINUE_SHOPPING = By.xpath('//*[@id="pp-panel-bottom"]/div[4]/div[4]/div[2]/a[2]');
const DISMISS_COOKIE = By.css('.module-cookie .mc-grid > .btn');
const THANK_YOU_PAGE = By.css('.cod-thank-you-page');

class Orders extends BasePage {
    constructor(driver) {
        super(driver);
    }

    async load() {
        await this.visit('https://enroush.ro/pages/all-products');
        await this.driver.manage().window().maximize();

        const isPageLoaded = await this.isDisplayed(MAIN_BANNER, 5000);
        if(!isPageLoaded) {
            throw new Error('Page didn\'t load after 5 seconds');
        }
        
        await this.click(DISMISS_COOKIE);
    }

    async basicOrder() {
        await this.click(NORMAL_PADS);
        await this.click(QUANTITY_BOX);
        await this.driver.sleep(500);
        await this.driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).sendKeys('6').perform();
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        const fieldsAndData = [
            {field: EMAIL_FIELD, data: config.baseCustomer.email},
            {field: FIRST_NAME_FIELD, data: config.baseCustomer.first_name},
            {field: LAST_NAME_FIELD, data: config.baseCustomer.last_name},
            {field: ADDRESS_FIELD, data: config.baseCustomer.address},
            {field: COUNTY_FIELD, data: config.baseCustomer.county},
            {field: CITY_FIELD, data: config.baseCustomer.city},
            {field: ZIP_CODE_FIELD, data: config.baseCustomer.zip_code},
            {field: PHONE_NUMBER_FIELD, data: config.baseCustomer.phone_number},
        ];
        for(const {field, data} of fieldsAndData) {
            await this.click(field);
            await this.type(field, data);
            await this.click(field);
            await this.driver.sleep(100);
        }
        await this.click(FREE_SHIPPING_RADIO);
        await this.click(COUPON_FIELD);
        await this.type(COUPON_FIELD, config.baseCustomer.coupon);
        await this.click(SUBMIT_COUPON);
        await this.driver.wait(until.elementLocated(COUPON_CONFIRMATION), 5000);
        const totalPrice = await this.getText(ORDER_TOTAL);
        if(parseFloat((totalPrice.toLowerCase()).replace(' ron', '')) === 0.00) {
            await this.click(SUBMIT_BUTTON);
            console.log('True');
            await this.driver.wait(until.elementLocated(THANK_YOU_PAGE), 10000);
        }
    }

    async multipleItemsOrder() {
        const products = [
            NORMAL_PADS,
            SUPER_PADS,
            NIGHT_PADS,
            MINI_TAMPONS,
            NORMAL_TAMPONS,
            SUPER_TAMPONS,
            NORMAL_LINERS,
            // MENSTRUAL_PATCHES,
            INTIMATE_GEL            
        ];

        for(const product of products) {
            await this.scrollToElement(product);
            await this.click(product);
            await this.driver.sleep(500);
            await this.click(ADD_TO_CART);
            await this.driver.sleep(500);
            await this.click(CONTINUE_SHOPPING);
        }
        await this.click(GO_TO_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        const fieldsAndData = [
            {field: EMAIL_FIELD, data: config.baseCustomer.email},
            {field: FIRST_NAME_FIELD, data: config.baseCustomer.first_name},
            {field: LAST_NAME_FIELD, data: config.baseCustomer.last_name},
            {field: ADDRESS_FIELD, data: config.baseCustomer.address},
            {field: COUNTY_FIELD, data: config.baseCustomer.county},
            {field: CITY_FIELD, data: config.baseCustomer.city},
            {field: ZIP_CODE_FIELD, data: config.baseCustomer.zip_code},
            {field: PHONE_NUMBER_FIELD, data: config.baseCustomer.phone_number},
        ];
        for(const {field, data} of fieldsAndData) {
            await this.click(field);
            await this.type(field, data);
            await this.click(field);
            await this.driver.sleep(100);
        }
        await this.scrollToElement(FREE_SHIPPING_RADIO);
        await this.click(FREE_SHIPPING_RADIO);
        await this.scrollToElement(COUPON_FIELD);
        await this.click(COUPON_FIELD);
        await this.type(COUPON_FIELD, config.baseCustomer.coupon);
        await this.click(SUBMIT_COUPON);
        await this.driver.wait(until.elementLocated(COUPON_CONFIRMATION), 5000);
        const totalPrice = await this.getText(ORDER_TOTAL);
        if(parseFloat((totalPrice.toLowerCase()).replace(' ron', '')) === 0.00) {
            await this.click(SUBMIT_BUTTON);
            console.log('True');
            await this.driver.wait(until.elementLocated(THANK_YOU_PAGE), 10000);
        }
    }

    async outsideBucharestOrder() {
        await this.click(NORMAL_PADS);
        await this.click(QUANTITY_BOX);
        await this.driver.sleep(500);
        await this.driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).sendKeys('6').perform();
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        const fieldsAndData = [
            {field: EMAIL_FIELD, data: config.outsideBucharest.email},
            {field: FIRST_NAME_FIELD, data: config.outsideBucharest.first_name},
            {field: LAST_NAME_FIELD, data: config.outsideBucharest.last_name},
            {field: ADDRESS_FIELD, data: config.outsideBucharest.address},
            {field: COUNTY_FIELD, data: config.outsideBucharest.county},
            {field: CITY_FIELD, data: config.outsideBucharest.city},
            {field: ZIP_CODE_FIELD, data: config.outsideBucharest.zip_code},
            {field: PHONE_NUMBER_FIELD, data: config.outsideBucharest.phone_number},
        ];
        for(const {field, data} of fieldsAndData) {
            await this.click(field);
            await this.type(field, data);
            await this.click(field);
            await this.driver.sleep(100);
        }
        await this.click(FREE_SHIPPING_RADIO);
        await this.click(COUPON_FIELD);
        await this.type(COUPON_FIELD, config.baseCustomer.coupon);
        await this.click(SUBMIT_COUPON);
        await this.driver.wait(until.elementLocated(COUPON_CONFIRMATION), 5000);
        const totalPrice = await this.getText(ORDER_TOTAL);
        if(parseFloat((totalPrice.toLowerCase()).replace(' ron', '')) === 0.00) {
            await this.click(SUBMIT_BUTTON);
            console.log('True');
            await this.driver.wait(until.elementLocated(THANK_YOU_PAGE), 10000);
        }
    }

    async newEmailOrder() {
        await this.click(NORMAL_PADS);
        await this.click(QUANTITY_BOX);
        await this.driver.sleep(500);
        await this.driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).sendKeys('6').perform();
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        const fieldsAndData = [
            {field: EMAIL_FIELD, data: config.newEmail.email},
            {field: FIRST_NAME_FIELD, data: config.newEmail.first_name},
            {field: LAST_NAME_FIELD, data: config.newEmail.last_name},
            {field: ADDRESS_FIELD, data: config.newEmail.address},
            {field: COUNTY_FIELD, data: config.newEmail.county},
            {field: CITY_FIELD, data: config.newEmail.city},
            {field: ZIP_CODE_FIELD, data: config.newEmail.zip_code},
            {field: PHONE_NUMBER_FIELD, data: config.newEmail.phone_number},
        ];
        for(const {field, data} of fieldsAndData) {
            await this.click(field);
            await this.type(field, data);
            await this.click(field);
            await this.driver.sleep(100);
        }
        await this.click(FREE_SHIPPING_RADIO);
        await this.click(COUPON_FIELD);
        await this.type(COUPON_FIELD, config.baseCustomer.coupon);
        await this.click(SUBMIT_COUPON);
        await this.driver.wait(until.elementLocated(COUPON_CONFIRMATION), 5000);
        const totalPrice = await this.getText(ORDER_TOTAL);
        if(parseFloat((totalPrice.toLowerCase()).replace(' ron', '')) === 0.00) {
            await this.click(SUBMIT_BUTTON);
            console.log('True');
            await this.driver.wait(until.elementLocated(THANK_YOU_PAGE), 10000);
        }
    }

    async newPhoneOrder() {
        await this.click(NORMAL_PADS);
        await this.click(QUANTITY_BOX);
        await this.driver.sleep(500);
        await this.driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).sendKeys('6').perform();
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        const fieldsAndData = [
            {field: EMAIL_FIELD, data: config.newPhone.email},
            {field: FIRST_NAME_FIELD, data: config.newPhone.first_name},
            {field: LAST_NAME_FIELD, data: config.newPhone.last_name},
            {field: ADDRESS_FIELD, data: config.newPhone.address},
            {field: COUNTY_FIELD, data: config.newPhone.county},
            {field: CITY_FIELD, data: config.newPhone.city},
            {field: ZIP_CODE_FIELD, data: config.newPhone.zip_code},
            {field: PHONE_NUMBER_FIELD, data: config.newPhone.phone_number},
        ];
        for(const {field, data} of fieldsAndData) {
            await this.click(field);
            await this.type(field, data);
            await this.click(field);
            await this.driver.sleep(100);
        }
        await this.click(FREE_SHIPPING_RADIO);
        await this.click(COUPON_FIELD);
        await this.type(COUPON_FIELD, config.baseCustomer.coupon);
        await this.click(SUBMIT_COUPON);
        await this.driver.wait(until.elementLocated(COUPON_CONFIRMATION), 5000);
        const totalPrice = await this.getText(ORDER_TOTAL);
        if(parseFloat((totalPrice.toLowerCase()).replace(' ron', '')) === 0.00) {
            await this.click(SUBMIT_BUTTON);
            console.log('True');
            await this.driver.wait(until.elementLocated(THANK_YOU_PAGE), 10000);
        }
    }
}

module.exports = Orders;
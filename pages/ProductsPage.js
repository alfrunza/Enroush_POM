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
const INTIMATE_GEL = By.css('#addon_products a.bp-img[title="Gel intim natural"]');
const ADD_TO_CART = By.css('#add-to-cart-main-bottom');
const SEE_CART = By.xpath('//*[@id="pp-panel-bottom"]/div[4]/div[4]/div[2]/a[1]');
const CART_PRODUCT_NAME = By.css('#cart .-c-product-item-heading-url');
const REMOVE_FROM_CART = By.css('.-c-product-item-remove > button');
const CONTINUE_SHOPPING = By.css('.-c-cart-empty-button');
const PRODUCTS = By.css('.bp-img');
const GO_TO_CART = By.css('#nav a[aria-label="cart"]');
const QUANTITY_BOX = By.css('.this-input[name="quantity"]');
const PLUS_BUTTON = By.css('.global-set-quantity[data-quantity="more"]');
const MINUS_BUTTON = By.css('.global-set-quantity[data-quantity="less"]');
const CART_QUANTITY_BOX = By.css('.-c-product-grid .this-input[aria-label]');
const SUBSCRIPTION_DROPDOWN = By.css('#pp-panel-bottom .pp-select-label > .input');
const ONE_MONTH_SUBSCRIPTION = By.css('#pp-panel-bottom .pp-select-label > .input > option[value="1"]');
const TWO_MONTHS_SUBSCRIPTION = By.css('#pp-panel-bottom .pp-select-label > .input > option[value="2"]');
const FOUR_MONTHS_SUBSCRIPTION = By.css('#pp-panel-bottom .pp-select-label > .input > option[value="4"]');
const SIX_MONTHS_SUBSCRIPTION = By.css('#pp-panel-bottom .pp-select-label > .input > option[value="6"]');
const OTP_RADIO = By.css('#pp-panel-bottom .pp-option:not(.pp-option-first-child) > .pp-radio-label');
const QUANTITY_JAVASCRIPT = 'return document.querySelector(\'.this-input[name="quantity"]\').value';
const CART_QUANTITY_JAVASCRIPT = 'return document.querySelector(\'.-c-product-grid .this-input[aria-label="Quantity"]\').value'
const SUBSCRIPTION_INFO = By.css('.-c-product-item-heading-info');
const PAY_BY_CARD = By.css('.btn-checkout-done');
const CASH_ON_DELIVERY = By.css('.btn-checkout-cod');
const TERMS_RADIO = By.css('.-c-os-terms-label');
const EMAIL_FIELD = By.css('.input[name="email"]');
const FIRST_NAME_FIELD = By.css('.input[name="first_name"]');
const LAST_NAME_FIELD = By.css('.input[name="last_name"]');
const ADDRESS_FIELD = By.css('.input[name="address"]');
const COUNTY_FIELD = By.css('.cod-input-province .input');
const CITY_FIELD = By.css('.cod-input-city .input');
const ZIP_CODE_FIELD = By.css('.input[name="zip"]');
const PHONE_NUMBER_FIELD = By.css('.input[name="phone"]');
const SUBMIT_BUTTON = By.css('#submit-button');
const ERROR_MESSAGE = By.css('.input-error:not([style="display: none;"]');
const SUBTOTAL = By.css('.-c-total-right');
const FREE_SHIPPING_NOTIF = By.css('.-cart-shipping-difference');
const FREE_SHIPPING_RADIO = By.css('.label[for="radio-free"] > .fake-checkbox-radio');
const ORDER_INFO = By.css('.cod-form-order-info-inner');
const DISMISS_COOKIE = By.css('.module-cookie .mc-grid > .btn');

class ProductsPage extends BasePage {
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
        await this.driver.wait(until.elementLocated(DISMISS_COOKIE), 5000);
        await this.click(DISMISS_COOKIE);
    }

    async verifyProducts() {
        const productsAndLinks = [
            {product: NORMAL_PADS, link: 'https://enroush.ro/products/normal-pads'},
            {product: SUPER_PADS, link: 'https://enroush.ro/products/super-pads'},
            {product: NIGHT_PADS, link: 'https://enroush.ro/products/night-pads'},
            {product: MINI_TAMPONS, link: 'https://enroush.ro/products/mini-tampons'},
            {product: NORMAL_TAMPONS, link: 'https://enroush.ro/products/normal-tampons'},
            {product: SUPER_TAMPONS, link: 'https://enroush.ro/products/super-tampons'},
            {product: NORMAL_LINERS, link: 'https://enroush.ro/products/regular-liners'},
            {product: MENSTRUAL_PATCHES, link: 'https://enroush.ro/products/menstrual-patches'},
            {product: INTIMATE_GEL, link: 'https://enroush.ro/products/intimate-gel'},
        ];
        
        for(const {product, link} of productsAndLinks) {
            await this.verifyProduct(product, link);
            await this.goBack();
        }
    }

    async addProductsToCart() {
        const productsAndNames = [
            {product: NORMAL_PADS, name: 'ABSORBANTE NORMALE'},
            {product: SUPER_PADS, name: 'ABSORBANTE SUPER'},
            {product: NIGHT_PADS, name: 'ABSORBANTE DE NOAPTE'},
            {product: MINI_TAMPONS, name: 'TAMPOANE MINI'},
            {product: NORMAL_TAMPONS, name: 'TAMPOANE NORMALE'},
            {product: SUPER_TAMPONS, name: 'TAMPOANE SUPER'},
            {product: NORMAL_LINERS, name: 'ABSORBANTE ZILNICE'},
            {product: MENSTRUAL_PATCHES, name: 'PLASTURI MENSTRUALI'},
            {product: INTIMATE_GEL, name: 'GEL INTIM NATURAL'},
        ];

        for(const {product, name} of productsAndNames) {
            await this.scrollToElement(product);
            await this.click(product);
            await this.click(ADD_TO_CART);
            await this.click(SEE_CART);
            await this.driver.sleep(2000);
            await this.driver.wait(until.elementIsVisible(await this.find(CART_PRODUCT_NAME), 10000));
            const text = await this.getText(CART_PRODUCT_NAME);
            expect(text).toBe(name);
            await this.click(REMOVE_FROM_CART);
            await this.click(CONTINUE_SHOPPING)
        }
    }

    async addRandomProductsToCart() {
        const products = [
            NORMAL_PADS,
            SUPER_PADS,
            NIGHT_PADS,
            MINI_TAMPONS,
            NORMAL_TAMPONS,
            SUPER_TAMPONS,
            NORMAL_LINERS,
            MENSTRUAL_PATCHES,
            INTIMATE_GEL
        ]
        this.shuffleArray(products);
        const randomProducts = products.slice(0, 2);

        for(const item of randomProducts){
            await this.scrollToElement(item);
            await this.click(item);
            await this.click(ADD_TO_CART);
            await this.driver.sleep(1000);
            await this.goBack();
        }

    }

    async verifyCartWithRandoms() {
        await this.click(GO_TO_CART);
        await this.driver.sleep(2000);
        const products = await this.findAll(CART_PRODUCT_NAME);
        const names = await Promise.all([
            this.getText(products[0]),
            this.getText(products[1]),
        ]);

        expect(names[0]).not.toBe(names[1]);
    }

    async verifyChangingQuantity() {
        const qty = this.randomNumber(2, 9);
        await this.click(NORMAL_PADS);
        await this.click(QUANTITY_BOX);
        await this.driver.sleep(500);
        await this.driver.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).sendKeys(qty.toString()).perform();
        let varQty;
        varQty = await this.driver.executeScript(QUANTITY_JAVASCRIPT);
        expect(parseInt(varQty)).toBe(qty);
        await this.click(MINUS_BUTTON);
        await this.driver.sleep(1000);
        varQty = await this.driver.executeScript(QUANTITY_JAVASCRIPT);
        expect(parseInt(varQty)).toBe(qty - 1);
        await this.click(PLUS_BUTTON);
        await this.driver.sleep(1000);
        varQty = await this.driver.executeScript(QUANTITY_JAVASCRIPT);
        expect(parseInt(varQty)).toBe(qty);
        await this.click(ADD_TO_CART);
        await this.driver.sleep(500);
        await this.click(SEE_CART);
        await this.driver.sleep(1000);
        varQty = await this.driver.executeScript(CART_QUANTITY_JAVASCRIPT);
        expect(parseInt(varQty)).toBe(qty);
    }

    async addEachSubscriptionTypeToCart() {
        await this.click(NORMAL_PADS);
        const dropdownOptions = [
            ONE_MONTH_SUBSCRIPTION,
            TWO_MONTHS_SUBSCRIPTION,
            FOUR_MONTHS_SUBSCRIPTION,
            SIX_MONTHS_SUBSCRIPTION,
        ]
        for(const option of dropdownOptions) {
            await this.click(SUBSCRIPTION_DROPDOWN);
            await this.click(option);
            await this.driver.sleep(500);
            await this.click(ADD_TO_CART);
            await this.driver.sleep(500);
        }
        await this.click(SEE_CART);
        await this.driver.sleep(500);
    }

    async verifySubscriptionInfoPresent() {
        await this.driver.wait(until.urlIs('https://enroush.ro/checkout'), 5000);
        const subscriptionInfoArray = await this.findAll(SUBSCRIPTION_INFO);
        expect(subscriptionInfoArray.length).toBe(4);
        const infoTexts = await Promise.all([
            this.getText(subscriptionInfoArray[0]),
            this.getText(subscriptionInfoArray[1]),
            this.getText(subscriptionInfoArray[2]),
            this.getText(subscriptionInfoArray[3]),
        ]);
        const controlTexts = [
            'La fiecare 1 luni',
            'La fiecare 2 luni',
            'La fiecare 4 luni',
            'La fiecare 6 luni',
        ]
        for(let i = 0; i < infoTexts.length; i++) {
            expect(infoTexts[i]).toContain(controlTexts[i]);
        }
    }

    async subscriptionAndOtpToCart() {
        const clicks = [
            {first: SUBSCRIPTION_DROPDOWN, second: ONE_MONTH_SUBSCRIPTION},
            {first: OTP_RADIO, second: null}
        ];
        await this.click(NORMAL_PADS);
        for(const {first, second} of clicks){
            await this.click(first);
            if(second){
                await this.click(second);
            }
            await this.click(ADD_TO_CART);
            await this.driver.sleep(1000);
        }
        await this.click(SEE_CART);
    }

    async verifySubscriptionAndOtpInCart() {
        await this.driver.wait(until.elementLocated(CART_PRODUCT_NAME), 5000);
        const productNames = await this.findAll(CART_PRODUCT_NAME);
        const subscriptionInfo = await this.findAll(SUBSCRIPTION_INFO);
        expect(productNames.length).toBe(2);
        expect(subscriptionInfo.length).toBe(1);
    }

    async termsAndConditionsRadio() {
        await this.click(NORMAL_PADS);
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(CASH_ON_DELIVERY), 5000);
        await this.click(CASH_ON_DELIVERY);
        expect(await this.driver.getCurrentUrl()).toBe('https://enroush.ro/checkout');
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        expect(await this.driver.getCurrentUrl()).toBe('https://enroush.ro/checkout/shipping');
    }

    async payByCard() {
        await this.click(NORMAL_PADS);
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART)
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(PAY_BY_CARD);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        const fieldsAndData = [
            {locator: EMAIL_FIELD, data: config.baseCustomer.email},
            {locator: FIRST_NAME_FIELD, data: config.baseCustomer.first_name},
            {locator: LAST_NAME_FIELD, data: config.baseCustomer.last_name},
            {locator: ADDRESS_FIELD, data: config.baseCustomer.address},
            {locator: COUNTY_FIELD, data: config.baseCustomer.county},
            {locator: CITY_FIELD, data: config.baseCustomer.city},
            {locator: ZIP_CODE_FIELD, data: config.baseCustomer.zip_code},
            {locator: PHONE_NUMBER_FIELD, data: config.baseCustomer.phone_number}
        ];
        for(const {locator, data} of fieldsAndData) {
            await this.click(locator);
            await this.type(locator, data);
            await this.driver.sleep(100);
        }
        await this.click(SUBMIT_BUTTON);
        await this.driver.wait(until.urlContains('checkout.enroush.ro'), 15000);
        expect(await this.driver.getCurrentUrl()).toContain('checkout.enroush.ro');
    }

    async cashOnDelivery() {
        await this.click(NORMAL_PADS);
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        expect(await this.driver.getCurrentUrl()).toBe('https://enroush.ro/checkout/shipping');
    }

    async mandatoryFields() {
        await this.click(NORMAL_PADS);
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(TERMS_RADIO), 5000);
        await this.click(TERMS_RADIO);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(EMAIL_FIELD), 5000);
        await this.click(SUBMIT_BUTTON);
        await this.driver.wait(until.elementLocated(ERROR_MESSAGE), 5000);
        const errors = await this.findAll(ERROR_MESSAGE);
        expect(await this.driver.getCurrentUrl()).toBe('https://enroush.ro/checkout/shipping');
        expect(errors.length).toBe(8);
    }

    async verifyFreeShipping() {
        await this.click(NORMAL_PADS);
        await this.click(ADD_TO_CART);
        await this.driver.sleep(1000);
        await this.click(SEE_CART);
        await this.driver.wait(until.elementLocated(SUBTOTAL));
        expect(await this.find(FREE_SHIPPING_NOTIF)).toBeDefined();
        let helper = await this.getText(SUBTOTAL);
        let price = parseFloat(helper.replace(' RON', ''));
        while(price < 100) {
            await this.click(PLUS_BUTTON);
            await this.driver.sleep(2000);
            helper = await this.getText(SUBTOTAL);
            price = parseFloat(helper.replace(' RON', ''));
        }
        try {
            await this.find(FREE_SHIPPING_NOTIF);
        } catch(error) {
            expect(error.toString()).toContain('Unable to locate element:');
        }
        await this.click(TERMS_RADIO);
        await this.driver.sleep(500);
        await this.click(CASH_ON_DELIVERY);
        await this.driver.wait(until.elementLocated(ORDER_INFO), 5000);
        await this.click(FREE_SHIPPING_RADIO);
        expect(await this.getText(FREE_SHIPPING_RADIO)).toBe('Gratis - 0 RON');
    }
}

module.exports = ProductsPage;

// function myFunction() {
//     let x = document.querySelector('.-c-totals .-c-total-right').innerText;  
//     if (!x) {
//         return false; 
//     } 
//     let totalPrice = parseFloat(x.replace(' RON', ''));  
//     if(100 - totalPrice > 0 && typeof document.querySelector('.-cart-shipping-difference') !== 'undefined') {     
//         return true; 
//     }  
//     return false; 
// } 
// return myFunction();
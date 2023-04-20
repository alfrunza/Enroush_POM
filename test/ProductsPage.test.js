const {Builder, By} = require('selenium-webdriver');
const path = ('path');
const assert = ('assert');
const ProductsPage = require('../pages/ProductsPage');

describe('Products Page', function() {
    jest.setTimeout(60 * 1000);
    let driver;
    let productspage;

    beforeEach(async() => {
        driver = await new Builder().forBrowser('chrome').build();
        productspage = new ProductsPage(driver);
        await productspage.load();
    })

    afterEach(async() => {
        await driver.quit();
    })

    test('Products in the shop lead to the correct pages', async() => {
        await productspage.verifyProducts();
    })

    test('Products can be added to cart', async () => {
        await productspage.addProductsToCart();
    })

    test('Different products can be added to the cart', async () => {
        await productspage.addRandomProductsToCart();
        await productspage.verifyCartWithRandoms();
    })

    test('Quantity can be changed in Product Page and carries over to Cart', async () => {
        await productspage.verifyChangingQuantity();
    })

    test('All subscription types can be added to cart and the difference is shown in the cart', async () => {
        await productspage.addEachSubscriptionTypeToCart();
        await productspage.verifySubscriptionInfoPresent();
    })

    test('OTP and Subscription can be added to cart at the same time', async () => {
        await productspage.subscriptionAndOtpToCart();
        await productspage.verifySubscriptionAndOtpInCart();
    })

    test('User can get to shipping page only after confirming Terms & Conditions', async () => {
        await productspage.termsAndConditionsRadio();
    })

    test('Pay by card flow', async () => {
        await productspage.payByCard();
    })

    test('Cash on delivery flow', async () => {
        await productspage.cashOnDelivery();
    })

    test('Orders can only be placed after completing mandatory fields', async () => {
        await productspage.mandatoryFields();
    })

    test('Orders above 100 RON benefit from free shipping', async () => {
        await productspage.verifyFreeShipping();
    })
})
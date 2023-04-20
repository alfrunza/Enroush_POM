const {Builder, By} = require('selenium-webdriver');
const path = ('path');
const assert = ('assert');
const Orders = require('../pages/Orders');

describe('Orders', () => {
    jest.setTimeout(60 * 1000);
    let driver;
    let orders;

    beforeEach(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        orders = new Orders(driver);
        await orders.load();
    })

    afterEach(async () => {
        await driver.quit();
    })

    test('Order with 6x same item; known email; known phone; Bucharest', async () => {
        await orders.basicOrder();
    })

    test('Order with multiple items (one of each); known email; known phone; Bucharest', async () => {
        await orders.multipleItemsOrder();
    })

    test('Order with 6x same item; known email; known phone; Outside Bucharest', async () => {
        await orders.outsideBucharestOrder();
    })

    test('Order with 6x same item; new email; known phone; Bucharest', async () => {
        await orders.newEmailOrder();
    })

    test('Order with 6x same item; known email; new phone; Bucharest', async () => {
        await orders.newPhoneOrder();
    })
})
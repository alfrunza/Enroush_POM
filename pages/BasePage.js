const {until, Actions, WebElement} = require('selenium-webdriver');

class BasePage {
    constructor(driver) {
        this.driver = driver;
    }

    async visit(url) {
        await this.driver.get(url);
    }

    async find(locator) {
        if (locator instanceof WebElement) {
            return locator;
        }

        return this.driver.findElement(locator);
    }

    findAll(locator) {
        return this.driver.findElements(locator);
    }

    async click(locator) {
        const element = await this.find(locator);
        await element.click();
    }

    async type(locator, inputText) {
        const input = await this.find(locator);
        await input.sendKeys(inputText);
    }

    async isDisplayed(locator, timeout) {
        if(timeout) {
            if (!(locator instanceof WebElement)) {
                await this.driver.wait(until.elementLocated(locator), timeout);
            }
            await this.driver.wait(until.elementIsVisible(await this.find(locator)), timeout);
            return true;
        }

        try {
            const element = await this.find(locator);
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }
    
    async clickVerify(locator, url) {
        await this.click(locator);
        return await this.driver.getCurrentUrl() === url;
    }

    async goBack() {
        await this.driver.navigate().back();
    }

    async hover(locator) {
        const actions = this.driver.actions({bridge: true});
        let elem = await this.find(locator);
        await actions.move({duration: 5000, origin: elem, x:0, y:0}).perform();
    }

    async getText(locator) {
        if (locator instanceof WebElement) {
            return locator.getText();
        }

        const element = await this.find(locator);
        return element.getText();
    }

    async scrollToElement(locator) {
        let visible = false;
        do {
            await this.driver.executeScript("window.scroll({ top: 10, left: 0});");
            visible = await this.isDisplayed(locator);
        }while(!visible);
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async textTransform(text) {
        text = text.toLowerCase();
        text = text.replace(' &', '');
        text = text.replace('(', '');
        text = text.replace('+)', '');
        text = text.replace(/ /g, '-');
        return text;
    }

    async verifyProduct(locator, url) {
        await this.scrollToElement(locator);
        const bool = await this.clickVerify(locator, url);
        if(!bool) {
            throw new Error('Error: The expected URL is different from the one verified (' + url + ')');
        }
    }
}

module.exports = BasePage

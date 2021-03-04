import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import puppeteer from 'puppeteer';

const HOST_IP = process.env.HOST_IP;
let browser: any;

const testFn = imageSnapshot({
    storybookUrl: 'file:///opt/storybook-static',
    getCustomBrowser: async () => {
        browser = await puppeteer.connect({
            browserURL: (() => {
                // For CI env's: If running in docker inside docker, you'll need the IP address of the host
                if (HOST_IP) {
                    return `http://${HOST_IP}:9222`;
                }
                return 'http://localhost:9222';
            })(),
        });
        return browser;
    },
    beforeScreenshot: async (page) => {
        await page.evaluateHandle('document.fonts.ready');
        await page.setViewport({ deviceScaleFactor: 2, width: 800, height: 600 });
    },
    getScreenshotOptions: () => {
        return {
            encoding: 'base64',
            fullPage: false,
        };
    },
});

// Override 'afterAll' so jest doesn't hang
testFn.afterAll = async () => {
    if (browser) {
        browser.close();
    }
};

initStoryshots({
    test: testFn,
});
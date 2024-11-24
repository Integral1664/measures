// Import modules
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'it',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


// Function to scrape data
const scrapeDynamicContent = async (url) => {
    const browser = await puppeteer.launch(); // Launch headless browser
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    try {
        await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for content to load
        // Extract the HTML content of the page
        let content = await page.content(); // the page itself
        // Use Cheerio to parse HTML content
        let $ = require('cheerio').load(content);

        const items = [];
        $('lib-accordion a').each((i, element) => {
            const title = $(element).text();
            const description = 'https://www.gosuslugi.ru' + $(element).attr('href');
            items.push({ title, url: description});
        });

        for(const item of items){
            await page.goto(item.url, { waitUntil: 'networkidle2' });

            await page.waitForSelector(`#mainInfo`);
            // Use Cheerio to parse HTML content
            const elementContent = await page.$eval(`#mainInfo`, el => el.innerHTML);
            //let $ = require('cheerio').load(elementContent);


            // let documentsLinks = [];
            // $('div[_ngcontent-ng-c1524504797] > div[_ngcontent-ng-c1524504797] a').each((i,item) => {
            //     documentsLinks.push({ name: $(item).text(), url: $(item).attr('href')});
            // })
            item.information = elementContent;

        }
        await browser.close();
        return items;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        return [];
    }
};

// Function to save scraped data to PostgreSQL
const saveToDatabase = async (data) => {
    const client = await pool.connect();
    try {
        for (const item of data) {
            await client.query(
                'INSERT INTO tax_incentives (title, url, information) VALUES ($1, $2, $3)',
                [item.title, item.url, item.information]
            );
        }
        console.log('Data saved to database.');
    } catch (error) {
        console.error('Error saving to database:', error);
    } finally {
        client.release();
    }
};

// Main function
const main = async () => {
    const url = 'https://www.gosuslugi.ru/itindustry/tax_incentives'; // Replace with the target URL
    const scrapedData = await scrapeDynamicContent(url);
    if (scrapedData.length > 0) {
        await saveToDatabase(scrapedData);
    } else {
        console.log('No data scraped.');
    }
};

main();
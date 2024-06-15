# Puppeteer Book Scraper

This project is a web scraper built with Puppeteer to extract book details from the website "Books to Scrape" and save the data in a JSON file.

## Features

- Scrapes book titles, prices, availability, ratings, and image URLs from the "Books to Scrape" website.
- Saves the extracted data into a JSON file (`books.json`).

## Prerequisites

- Node.js installed on your machine.
- Puppeteer library.
- File System (fs) module (part of Node.js core modules).

## Installation

1. Clone the repository.

    ```bash
    git clone https://github.com/your-username/puppeteer-book-scraper.git
    cd puppeteer-book-scraper
    ```

2. Install the necessary dependencies.

    ```bash
    npm install puppeteer
    ```

## Usage

1. Run the script.

    ```bash
    node scraper.js
    ```

    The script will:

    - Launch a Chromium browser.
    - Navigate to the "Books to Scrape" website.
    - Extract book details from the homepage.
    - Save the data in a `books.json` file in the same directory.

## Code Explanation

### Required Modules

- The script uses Puppeteer to automate the browser.
- The File System module (`fs`) is used to write the extracted data to a file.

    ```javascript
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    ```

### The `start` Function

- The `start` function launches the browser and opens a new page.
- It navigates to the "Books to Scrape" website.

    ```javascript
    async function start(){
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      await page.goto('http://books.toscrape.com/');
    ```

### Extracting Book Details

- The script selects all elements with the class `product_pod` and iterates over them to extract book details.
- For each book, it extracts the title, price, availability, rating, and image URL.

    ```javascript
    const allElements = await page.$$('.product_pod');
    objArray = new Array();
    for(const element of allElements){
        const title = await page.evaluate(el => el.querySelector('h3 > a').textContent, element);
        const price = await page.evaluate(el => el.querySelector('.product_price > p').textContent, element);
        const availability = await page.evaluate(el => el.querySelector('.product_price > .availability').textContent, element);
        const rating = await page.evaluate(el => el.querySelector('p').className, element);
        const imageUrl = await page.evaluate(el => el.querySelector('.image_container > a > img').getAttribute('src'), element);

        obj = new Object();
        obj.imageUrl = imageUrl;
        obj.rating = rating.split(" ").pop();
        obj.title = title;
        obj.price = price;
        obj.availability = availability.trim() === 'In stock' ? true : false;
        objArray.push(obj);
    }
    ```

### Saving Data to a JSON File

- The extracted data is saved to a JSON file (`books.json`).

    ```javascript
    const myData = JSON.stringify(objArray);
    fs.writeFile("./books.json", myData, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    await browser.close();
    ```

### Running the Script

- Finally, the `start` function is called to execute the script.

    ```javascript
    start();
    ```

## Output

The script outputs a `books.json` file containing an array of objects, each representing a book with the following properties:

- `imageUrl`: URL of the book's image.
- `rating`: Rating of the book.
- `title`: Title of the book.
- `price`: Price of the book.
- `availability`: Boolean indicating whether the book is in stock.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

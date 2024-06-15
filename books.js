const puppeteer = require('puppeteer')
const fs = require('fs')


async function start(){
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('http://books.toscrape.com/');

  const allElements = await page.$$('.product_pod')
  objArray = new Array()
  for(const element of allElements){
    const title = await page.evaluate(el => el.querySelector('h3 > a').textContent, element)
    const price = await page.evaluate(el => el.querySelector('.product_price > p').textContent, element)
    const availability = await page.evaluate(el => el.querySelector('.product_price > .availability').textContent, element)
    //console.log(availability.trim())
    const rating = await page.evaluate(el => el.querySelector('p').className, element)
    const imageUrl = await page.evaluate(el => el.querySelector('.image_container > a > img').getAttribute('src'), element)

    obj = new Object()
    obj.imageUrl = imageUrl
    obj.rating = rating.split(" ").pop()
    obj.title = title
    obj.price = price
    obj.availability = availability.trim() === 'In stock'? true : false
    objArray.push(obj)
    
  }
  console.log(objArray)
  const myData = JSON.stringify(objArray);
  fs.writeFile("./books.json", myData, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

await browser.close();
}

start()
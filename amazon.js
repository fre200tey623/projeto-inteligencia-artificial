const puppeteer = require('puppeteer');

const results = [];

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
          '--disable-web-security',
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--start-maximized',
          '--disable-notifications'
        ],
        pipe: true,
        channel: 'chrome',
        product: 'chrome',
        behavior: 'allow'
      });

  const page = await browser.newPage();
  await page.goto('https://www.amazon.com.br/');

  await page.waitForSelector("#twotabsearchtextbox", { visible: true })

  const produto = "iphone 11"

  await page.type("#twotabsearchtextbox", produto);
  


  await Promise.all([
      page.waitForNavigation(),
      //função para clicar
      await page.click("#nav-search-submit-button")
  ]);
  
  //função para pegar todos os produtos do site e jogar em um array
  const links = await page.$$eval('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > div > span > div > div > div.s-product-image-container.aok-relative.s-text-center.s-image-overlay-grey.puis-image-overlay-grey.s-padding-left-small.s-padding-right-small.puis-spacing-small.s-height-equalized.puis.puis-v2i8lr88yqj5ia2k6fpoqno4x6g > span > a', el => el.map(link => link.href));

 //console.log(links);

//   //console.log(links);
  

   for(const link of links){
  //     console.log('Pagina ', c);
     await page.goto(link);
  //     await page.waitForSelector('.ui-pdp-title');

      let title = ""
      try{
        title = await page.$eval("#productTitle", element => element .innerText);
      }
      catch (error){
        title = "Produto sem nome";
      }

     const price = await page.$eval('.a-price-whole', element => element .innerText);

     let pricesArray = price.split("\n")
     //console.log(price.replaceAll('\n', '').replace("R\$", ""));
     let aval = ""
     let avalArray = ""
     let numAval = ""
     try{

       aval = await page.$eval(".a-size-base.a-nowrap", element => element .innerText);
       avalArray = aval.split("de");
       
      } 
     catch (error){
       aval = "Não tem avaliação";
     }

     try{
        numAval = await page.$eval("#acrCustomerReviewText", element => element .innerText);
     }
     catch (error){
        numAval = "Não tem avaliação";
     }

    let product = {
      title: title,
      price: pricesArray[0].trim(),
      aval: avalArray[0].trim(),
      numAval: numAval,
      link: link,
    }

    results.push(product);

}

  for (let i = 0; i < results.length; i++){
    console.log(results[i])
  }
  
  await new Promise((resolve) => setTimeout(resolve, 3000))

  await browser.close();
  
}

main();
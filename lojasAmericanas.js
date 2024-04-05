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
try{
    await page.goto('https://www.americanas.com.br/');

    //função para esperar o selector
    await page.waitForSelector('#rsyswpsdk > div > header > div.src__Inner-sc-q7wx4i-2.kXfNUu > div.src__Container-sc-q7wx4i-3.fVZPdo > div > div.search__Container-sc-1wvs0c1-0.fpjaUO > form > input');
  
    searchfor = "iphone 11";
  
    await page.click('#rsyswpsdk > div > header > div.src__Inner-sc-q7wx4i-2.kXfNUu > div.src__Container-sc-q7wx4i-3.fVZPdo > div > div.search__Container-sc-1wvs0c1-0.fpjaUO > form > input');
    //função usada para escrever
    await page.type('#rsyswpsdk > div > header > div.src__Inner-sc-q7wx4i-2.kXfNUu > div.src__Container-sc-q7wx4i-3.fVZPdo > div > div.search__Container-sc-1wvs0c1-0.fpjaUO > form > input', searchfor);
  
    await Promise.all([
        page.waitForNavigation(),
        //função para clicar
        await page.keyboard.press('Enter')
    ]);
    //função para pegar todos os produtos do site e jogar em um array
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const links = await page.$$eval('#rsyswpsdk > div > main > div > div.col__StyledCol-sc-1snw5v3-0.bIoTYC.theme-grid-col.search-result__ColUI-sc-gvih6f-4.jExBLM > div.grid__StyledGrid-sc-1man2hx-0.iFeuoP.src__GridItem-sc-122lblh-0.gGJHBq > div > div > div > a', el => el.map(link => link.href));
  
   // console.log(links);
  
  //   //console.log(links);
    
     for(const link of links){
    //     console.log('Pagina ', c);
       await page.goto(link);
    //     await page.waitForSelector('.ui-pdp-title');
      let title = ""
      try{
        title = await page.$eval(".product-title__Title-sc-1hlrxcw-0.jyetLr", element => element .innerText);
      }
      catch (error){
        title = "Produto sem nome";
      }
       const price = await page.$eval('.styles__PriceText-sc-1o94vuj-0.kbIkrl.priceSales', element => element .innerText);
       //console.log(price.replaceAll('\n', '').replace("R\$", ""));
       let aval = ""
       let numAval = ""
       let numAvalArray = [];
        let numAvalFinal = "";
       try{
  
         aval = await page.$eval(".Styled__RatingAverageStyle-sc-12fc0ii-1.instlt", element => element .innerText);
         
        } 
       catch (error){
         aval = "Não tem avaliação";
       }
       try{
        numAval = await page.$eval(".src__Count-sc-gi2cko-1.laMxpU", element => element .innerText);
        numAvalArray = numAval.replace("(","").replace(")","").split(/\s/);
        numAvalFinal = numAvalArray[0];
       }
       catch (error){
         numAval = "0";
          numAvalFinal = numAval;
       }
      
  
      let product = {
        title: title,
        price: price.replaceAll('\n', '').replace("R\$", "").trim(),
        aval: aval,
        numAval: numAvalFinal,
        link: link,
      }
  
      results.push(product);
  
  }
  
  
    for (let i = 0; i < results.length; i++){
      console.log(results[i]);
    }
    
    
  
}
catch (error){
    console.log("Erro")
}
finally{
    await new Promise((resolve) => setTimeout(resolve, 3000))
  await browser.close();
}
  
}

main();
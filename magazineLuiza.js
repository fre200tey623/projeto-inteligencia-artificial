const puppeteer = require("puppeteer");

const results = [];

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--disable-web-security",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--start-maximized",
      "--disable-notifications",
    ],
    pipe: true,
    channel: "chrome",
    product: "chrome",
    behavior: "allow",
  });

  const page = await browser.newPage();
  await page.goto("https://www.magazineluiza.com.br/");

  try {
    //função para esperar o selector
    await page.waitForSelector("#search-container");

    searchfor = "iphone 11";

    await page.click("#search-container");
    //função usada para escrever
    await page.type("#search-container", searchfor);

    await Promise.all([
      page.waitForNavigation(),
      //função para clicar
      await page.keyboard.press("Enter"),
    ]);

    //função para pegar todos os produtos do site e jogar em um array
    const links = await page.$$eval(
      "#__next > div > main > section:nth-child(5) > div.sc-dcJsrY.hmLryf > div > ul > li > a",
      (el) => el.map((link) => link.href)
    );

    //console.log(links);

    //console.log(links);

    for (const link of links) {
      //     console.log('Pagina ', c);
      await page.goto(link);
      //     await page.waitForSelector('.ui-pdp-title');
      let title = "";
      try {
        title = await page.$eval(
          ".sc-kpDqfm.gXZPqL",
          (element) => element.innerText
        );
      } catch (error) {
        title = "Produto sem nome"
      }
      let price = "";
      try {
        price = await page.$eval(
          ".sc-kpDqfm.eCPtRw.sc-bOhtcR.dOwMgM",
          (element) => element.innerText
        );
      } catch (error) {
        price = "Produto sem preço";
      }
      //console.log(price.replaceAll('\n', '').replace("R\$", ""));

      let aval = "";
      let numAval = "";
      let numAvalArray = [];
      let numAvalFinal = "";
      try {
        aval = await page.$eval(
          ".sc-kpDqfm.jYhqpO",
          (element) => element.innerText
        );
      } catch (error) {
        aval = "Não tem avaliação";
      }

      try {
        numAval = await page.$eval(
          ".sc-kpDqfm.kFPGHQ",
          (element) => element.innerText
        );
        
        numAvalArray = numAval.split(/\s/);
        numAvalFinal = numAvalArray[0];
      } catch (error) {
        numAval = "Não tem avaliação";
        numAvalFinal = numAval;
      }

      //console.log(price);

      let product = {
        title: title,
        price: price.replaceAll("\n", "").replace("R$", "").trim(),
        aval: aval,
        numAval: numAvalFinal,
        link: link,
      };

      results.push(product);
    }

    for (let i = 0; i < results.length; i++) {
      console.log(results[i]);
    }
  } catch (error) {
    console.log("Erro ao acessar o site");
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await browser.close();
  }
}

main();

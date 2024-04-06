const results = [];

async function getCasasBahiaProducts(browser, searchfor) {
  try {
    const page = await browser.newPage();

    await page.goto("https://www.casasbahia.com.br/");

    //função para esperar o selector
    await page.waitForSelector("#search-form-input");

    await page.click("#search-form-input");
    //função usada para escrever
    await page.type("#search-form-input", searchfor);

    await Promise.all([
      page.waitForNavigation(),
      //função para clicar
      await page.keyboard.press("Enter"),
    ]);

    //função para pegar todos os produtos do site e jogar em um array

    await new Promise((resolve) => setTimeout(resolve, 5000));
    const links = await page.$$eval(
      "#testeScroll > div > div > div > div > div:nth-child(3) > div.Item-sc-815c7bf9-0.epcKyG > div.css-1ph6foh > div.css-1v7jgiv > div > div > div > div > a",
      (el) => el.map((link) => link.href)
    );

    //console.log(links);

    //   //console.log(links);

    for (const link of links) {
      //     console.log('Pagina ', c);
      await page.goto(link);
      //     await page.waitForSelector('.ui-pdp-title');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        let title = "";
        try {
          title = await page.$eval(
            ".dsvia-heading.css-1xmpwke",
            (element) => element.innerText
          );
        } catch (error) {
          title = "Produto sem nome";
        }
        const price = await page.$eval(
          ".dsvia-text.css-1luipqs",
          (element) => element.innerText
        );

        //console.log(price.replaceAll('\n', '').replace("R\$", ""));
        const pricesArray = price.split("\n");
        let aval = "";
        let numAval = "";
        let numAvalArray = [];
        let numAvalFinal = "";

        try {
          aval = await page.$eval(
            ".dsvia-heading.css-1v8gq7a",
            (element) => element.innerText
          );
        } catch (error) {
          aval = "Não tem avaliação";
        }

        try {
          numAval = await page.$eval(
            ".dsvia-text.css-13lzxf3",
            (element) => element.innerText
          );
          numAvalArray = numAval.split(/\s/);
          numAvalFinal = numAvalArray[0];
        } catch (error) {
          numAval = "0";
          numAvalFinal = numAval;
        }

        let product = {
          title: title,
          price: pricesArray[pricesArray.length - 1]
            .replaceAll("\n", "")
            .replace("R$", "")
            .trim(),
          aval: aval,
          numAval: numAvalFinal,
          link: link,
        };

        results.push(product);
      } catch (error) {
        console.log("Erro");
      }
    }

    return results;
  } catch (error) {
    console.log("Erro");

    return null;
  }
}

module.exports = { getCasasBahiaProducts };

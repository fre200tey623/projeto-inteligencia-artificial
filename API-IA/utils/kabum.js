const results = [];

async function getKabumProducts(browser, searchfor) {
  try {
    const page = await browser.newPage();
    await page.goto("https://www.kabum.com.br/");

    //função para esperar o selector
    await page.waitForSelector("#input-busca");

    await page.click("#input-busca");
    //função usada para escrever
    await page.type("#input-busca", searchfor);

    await Promise.all([
      page.waitForNavigation(),
      //função para clicar
      await page.keyboard.press("Enter"),
    ]);

    //função para pegar todos os produtos do site e jogar em um array
    const links = await page.$$eval(
      "#listing > div.sc-dlfnuX.sc-1f1372c4-2.gndICW.gpmJKB > div > div > div.sc-dIUeWJ.gwMFoo > div > main > article > a",
      (el) => el.map((link) => link.href)
    );

    for (const link of links) {
      //     console.log('Pagina ', c);
      await page.goto(link);
      //     await page.waitForSelector('.ui-pdp-title');

      let title = "";

      try {
        title = await page.$eval(
          ".sc-58b2114e-6.brTtKt",
          (element) => element.innerText
        );
      } catch (error) {
        title = "Produto sem nome";
      }

      const price = await page.$eval(
        ".sc-5492faee-2.ipHrwP.finalPrice",
        (element) => element.innerText
      );
      //console.log(price.replaceAll('\n', '').replace("R\$", ""));
      let aval = "";
      try {
        aval = await page.$eval(
          ".sc-57aea7be-1.gAjNhT",
          (element) => element.innerText
        );
      } catch (error) {
        aval = "Não tem avaliação";
      }

      let numAval = "";
      //let numAvalArray = [];
      let numAvalFinal = "0";
      try {
        numAval = await page.$eval(
          ".sc-e32b6973-1.hEcDvi.labelTotalAvaliacoes",
          (element) => element.innerText
        );
        numAvalFinal = numAval
          .replaceAll("\n", "")
          .replace("(", "")
          .replace(")", "");
      } catch (error) {
        numAval = "0";
        numAvalFinal = numAval;
      }

      let product = {
        title: title,
        price: price.replaceAll("\n", "").replace("R$", "").trim(),
        aval: aval,
        numAval: numAvalFinal,
        link: link,
      };

      results.push(product);
    }

    results.map((result) => {
      result.price = parseFloat(
        result.price.replaceAll(".", "").replace(",", ".")
      );

      result.aval = parseInt(result.aval.includes("Não") ? 1 : result.aval);

      result.numAval = parseInt(
        result.numAval.includes("Não") ? 0 : result.numAval
      );
    });

    return results;
  } catch (error) {
    console.log("Erro");

    return null;
  }
}

module.exports = { getKabumProducts };

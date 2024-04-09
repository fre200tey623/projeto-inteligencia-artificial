const results = [];

async function getMagazineLuizaProducts(browser, searchfor) {
  const page = await browser.newPage();
  await page.goto("https://www.magazineluiza.com.br/");

  try {
    //função para esperar o selector
    await page.waitForSelector("#search-container");

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

    let i = 0;
    for (const link of links) {
      if (i === 20) {
        break;
      }

      await page.goto(link);
      //     await page.waitForSelector('.ui-pdp-title');
      let title = "";
      try {
        title = await page.$eval(
          ".sc-kpDqfm.gXZPqL",
          (element) => element.innerText
        );
      } catch (error) {
        title = "Produto sem nome";
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

      let product = {
        title: title,
        price: price.replaceAll("\n", "").replace("R$", "").trim(),
        aval: aval,
        numAval: numAvalFinal,
        link: link,
      };

      results.push(product);
      i++;
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
    console.log("Erro ao acessar o site");

    return null;
  }
}

module.exports = { getMagazineLuizaProducts };

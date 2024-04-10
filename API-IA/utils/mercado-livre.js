const results = [];

async function getMercadoLivreProducts(browser, searchfor) {
  try {
    console.log("Mercado Livre");
    const page = await browser.newPage();
    await page.goto("https://www.mercadolivre.com.br/");

    //função para esperar o selector
    await page.waitForSelector("#cb1-edit");

    //função usada para escrever
    await page.type("#cb1-edit", searchfor);

    await Promise.all([
      page.waitForNavigation(),
      //função para clicar
      await page.click(
        "body > header > div > div.nav-area.nav-top-area.nav-center-area > form > button > div"
      ),
    ]);

    //função para pegar todos os produtos do site e jogar em um array
    const links = await page.$$eval(
      ".ui-search-item__group.ui-search-item__group--title > a",
      (el) => el.map((link) => link.href)
    );

    for (const link of links) {
      await page.goto(link);

      let imgUrl = "";
      new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        imgUrl = await page.$eval(
          ".ui-pdp-image.ui-pdp-gallery__figure__image",
          (element) => element.getAttribute("src")
        );
      } catch (error) {
        imgUrl = "sem imagem";
      }

      let title = "";

      try {
        title = await page.$eval(
          ".ui-pdp-header__title-container",
          (element) => element.innerText
        );
      } catch (error) {
        title = "Produto sem nome";
      }
      const price = await page.$eval(
        ".andes-money-amount__fraction",
        (element) => element.innerText
      );
      let aval = "";
      let numAval = "";
      let numAvalFinal = "";
      try {
        aval = await page.$eval(
          "#ui-pdp-main-container > div.ui-pdp-container__col.col-3.ui-pdp-container--column-center.pb-40 > div > div.ui-pdp-container__row.ui-pdp-with--separator--fluid.ui-pdp-with--separator--40 > div.ui-pdp-container__col.col-2.mr-32 > div.ui-pdp-container__top-wrapper.mt-40 > div > div.ui-pdp-header__info > a > span.ui-pdp-review__rating",
          (element) => element.innerText
        );
      } catch (error) {
        aval = "Não tem avaliação";
      }

      try {
        numAval = await page.$eval(
          ".ui-pdp-review__amount",
          (element) => element.innerText
        );
        numAvalFinal = numAval.replace("(", "").replace(")", "");
      } catch (error) {
        numAval = "Não tem avaliação";
        numAvalFinal = numAval;
      }

      let product = {
        title: title,
        price: price,
        aval: aval,
        numAval: numAvalFinal,
        link: link,
        imgUrl: imgUrl,
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

    console.log("Mercado Livre Results");

    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = { getMercadoLivreProducts };

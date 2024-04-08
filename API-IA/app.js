/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const puppeteer = require("puppeteer");

const { getAmazonProducts } = require("./utils/amazon");
const { getAmericanasProducts } = require("./utils/americanas");
const { getCasasBahiaProducts } = require("./utils/casas-bahia");
const { getKabumProducts } = require("./utils/kabum");
const { getMagazineLuizaProducts } = require("./utils/magazine-luiza");
const { getMercadoLivreProducts } = require("./utils/mercado-livre");
const { main } = require("./lasso_regression_search");

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/", async (req, res) => {
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

  try {
    const search = req.query.search;

    let atLeastOne = false;

    const [
      amazonResults,
      // americanasResults,
      // casasBahiaResults,
      kabumResults,
      magazineLuizaResults,
      mercadoLivreResults,
    ] = await Promise.all([
      getAmazonProducts(browser, search),
      // getAmericanasProducts(browser, search),
      // getCasasBahiaProducts(browser, search),
      getKabumProducts(browser, search),
      getMagazineLuizaProducts(browser, search),
      getMercadoLivreProducts(browser, search),
    ]);

    // rever algoritmo para kabum

    atLeastOne =
      atLeastOne ||
      (amazonResults && amazonResults.length > 0) ||
      // (americanasResults && americanasResults.length > 0) ||
      // (casasBahiaResults && casasBahiaResults.length > 0);
      (kabumResults && kabumResults.length > 0) ||
      (magazineLuizaResults && magazineLuizaResults.length > 0) ||
      (mercadoLivreResults && mercadoLivreResults.length > 0);

    if (!atLeastOne) {
      return res.status(404).json({ message: "Nenhum produto encontrado" });
    }

    let allResults = [
      ...amazonResults,
      // ...americanasResults,
      // ...casasBahiaResults,
      ...kabumResults,
      ...magazineLuizaResults,
      ...mercadoLivreResults,
    ];

    console.log(allResults);

    allResults = allResults.filter((result) => {
      return result.price && result.price > 0;
    });

    allResults = allResults.map((result) => {
      result.price = parseFloat(
        result.price.replaceAll(".", "").replace(",", ".")
      );
      result.aval = parseInt(result.aval.includes("Não") ? 1 : result.aval);
      result.numAval = parseInt(result.numAval);
    });

    allResults = allResults.filter((result) => {
      if (
        search.startsWith("smartphone") ||
        search.startsWith("celular") ||
        search.startsWith("iphone")
      ) {
        return result.price > 400;
      }
    });

    allResults = allResults.filter((result) => {
      const queryParts = search.split(" ");

      for (const queryPart of queryParts) {
        if (!result.title.toLowerCase().includes(queryPart.toLowerCase())) {
          return false;
        }
      }
    });

    allResults = allResults.sort((a, b) => a.price - b.price);

    console.log(allResults);

    const betterProduct = main(allResults);

    res.status(200).json(betterProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno" });
  } finally {
    // await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

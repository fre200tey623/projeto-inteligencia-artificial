/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const cors = require("cors");
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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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
      amazonResults ||
      // (americanasResults && americanasResults.length > 0) ||
      // (casasBahiaResults && casasBahiaResults.length > 0);
      kabumResults ||
      magazineLuizaResults ||
      mercadoLivreResults;

    if (!atLeastOne) {
      return res.status(404).json({ message: "Nenhum produto encontrado" });
    }

    let allResults = [
      ...(amazonResults ?? []),
      // ...americanasResults,
      // ...casasBahiaResults,
      ...(kabumResults ?? []),
      ...(magazineLuizaResults ?? []),
      ...(mercadoLivreResults ?? []),
    ];

    allResults = allResults.filter((result) => {
      return result.price && result.price > 0;
    });

    allResults = allResults.filter((result) => {
      if (
        search.startsWith("smartphone") ||
        search.startsWith("celular") ||
        search.startsWith("iphone")
      ) {
        return result.price > 200;
      }

      return true;
    });

    console.log(allResults);

    allResults = allResults.filter((result) => {
      const matchPoints = search
        .split(" ")
        .filter((part) =>
          result.title.toLowerCase().includes(part.toLowerCase())
        ).length;

      return matchPoints === search.split(" ").length;
    });

    allResults = allResults.sort((a, b) => a.price - b.price);

    console.log(allResults);

    const betterProduct = main(allResults);

    res.status(200).json(betterProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno" });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

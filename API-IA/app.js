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
    headless: "new",
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

    const promises = [];

    promises.push(getAmazonProducts(browser, search));

    await new Promise((resolve) => setTimeout(resolve, 7000));

    promises.push(getKabumProducts(browser, search));

    await new Promise((resolve) => setTimeout(resolve, 7000));

    promises.push(getMagazineLuizaProducts(browser, search));

    await new Promise((resolve) => setTimeout(resolve, 7000));

    promises.push(getMercadoLivreProducts(browser, search));

    const [
      amazonResults,
      kabumResults,
      magazineLuizaResults,
      mercadoLivreResults,
    ] = await Promise.all(promises);

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

    allResults = allResults.filter((result) => {
      const matchPoints = search
        .split(" ")
        .filter((part) =>
          result.title.toLowerCase().includes(part.toLowerCase())
        ).length;

      return matchPoints === search.split(" ").length;
    });

    allResults = allResults.sort((a, b) => a.price - b.price);

    const betterProduct = main(allResults);

    console.log(betterProduct);

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

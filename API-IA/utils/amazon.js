async function getAmazonProducts(browser, query) {
  try {
    const page = await browser.newPage();

    await page.goto("https://www.amazon.com.br/");

    await page.waitForSelector("#twotabsearchtextbox", { visible: true });

    await page.type("#twotabsearchtextbox", query);

    await page.click("#nav-search-submit-button");

    await page.waitForNavigation();

    const products = await page.evaluate((query) => {
      const products = [];

      const elements = document.querySelectorAll(".puis-card-container");
      const queryParts = query.split(" ");

      for (const element of elements) {
        const allText = element.innerText;
        const name = element.querySelector("div > div > div > h2 > a");

        const matchPoints = queryParts.filter((part) =>
          name.innerText
            .toLowerCase()
            .replace("gb", "")
            .includes(` ${part.toLowerCase().replace("gb", "")} `)
        ).length;

        if (matchPoints < queryParts.length) {
          continue;
        }

        const textParts = allText.split("\n");

        let value = 0;
        let aval = 0;
        let numAval = 0;

        for (let i = 0; i < textParts.length; i++) {
          const part = textParts[i];

          if (part.toLowerCase().includes("estrelas")) {
            aval = Number(part.split(" ")[0].replace(",", "."));

            numAval = Number(textParts[i + 1].trim().replace(".", ""));
          }

          if (part.startsWith("R$")) {
            value = Number(
              part.replace("R$", "").replace(".", "").replace(",", ".")
            );
            break;
          }
        }

        if (value === 0 || isNaN(value)) {
          continue;
        }

        const newProduct = {
          title: name.innerText,
          price: value,
          aval,
          numAval,
          link: name.href,
        };

        products.push(newProduct);
      }

      return products;
    }, query);

    return products;
  } catch (error) {
    return null;
  }
}

module.exports = { getAmazonProducts };

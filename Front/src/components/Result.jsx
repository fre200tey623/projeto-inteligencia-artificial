import React from "react";

export default function Result(betterProduct) {
  const finalData = betterProduct.betterProduct;

  console.log("Final Data");
  console.log(betterProduct);
  console.log(finalData);

  return (
    <div className="flex flex-col w-full items-center gap-8 mt-12">
      <label>Encontrei uma recomendação para sua busca</label>
      <div className="flex gradient-container w-full rounded-3xl gap-4 md:gap-12">
        <div className="flex justify-center items-center pl-4 md:pl-8">
          <img
            src="https://http2.mlstatic.com/D_NQ_NP_993028-MLA52131045262_102022-O.webp"
            alt="Imagem do Produto"
          />
        </div>
        <div className="w-full pt-6 flex flex-col justify-between">
          <div>
            <div>
              <h1 className="text-sm md:text-xl">{finalData.title}</h1>
              <p>R${finalData.price}</p>
            </div>
            <div className="flex gap-1 md:gap-4">
              <div>
                {Array.from({ length: Math.round(finalData.aval) }).map(
                  (_, index) => (
                    <span key={index}>★</span>
                  )
                )}
              </div>
              <div>
                {finalData.aval} ({finalData.numAval} avaliações)
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <a
              href={finalData.link}
              target="_blank"
              className="px-4 py-2 mb-5 md:mb-10 bg-white rounded-full text-gray-700 font-semibold text-sm"
            >
              Acessar produto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

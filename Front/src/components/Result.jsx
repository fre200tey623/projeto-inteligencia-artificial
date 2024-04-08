import React from "react";

export default function Result() {
  const avaliacoes = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className="flex flex-col w-full items-center gap-8 mt-12">
      <label>Encontrei uma recomendação para sua busca</label>
      <div className="flex gradient-container w-full rounded-3xl gap-12">
        <div className="flex justify-center items-center pl-8">
          <img src="https://picsum.photos/200/300" alt="Imagem do Produto" />
        </div>
        <div className="w-full pt-6 flex flex-col justify-between">
          <div>
          <div>
            <h1 className="text-xl">
              Usado: iPhone 11 128GB Branco Bom - Trocafone
            </h1>
            <p>R$ 9.999,00</p>
          </div>
          <div className="flex gap-4">
            <div>
              {avaliacoes.map((avaliacao, index) => (
                <span key={index}>★</span>
              ))}
            </div>
            <div>4,5 (1000 avaliações)</div>
          </div>
            </div>
          <div className="flex justify-center">
            <button className="px-4 py-2 mb-10 bg-white rounded-full text-gray-700 font-semibold text-sm">
              Acessar produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

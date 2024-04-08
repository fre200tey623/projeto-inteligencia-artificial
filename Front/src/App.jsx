import { useState } from "react";
import Fundo from "./assets/Fundo.png";
import Amazon from "./assets/amazon.png";
import Americanas from "./assets/americanas.png";
import MercadoLivre from "./assets/mercadoLivre.png";
import MagazineLuiza from "./assets/magalu.png";
import CasasBahia from "./assets/casasBahia.png";
import Kabum from "./assets/kabum.png";
import Layout from "./components/Layoult";
import { IoSearch } from "react-icons/io5";
import Loading from "./components/Loading";


function App() {

  const [valorPesquisa, setValorPesquisa] = useState("");
  const [visivel, setVisivel] = useState(true);

  const pesquisar = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log(valorPesquisa);
    }
  }

  const handleInput = () => {
    setVisivel(false);
  }
  
  return (
    <>
      <div className={`bg-[url(./assets/Fundo.png)] h-screen w-screen bg-no-repeat bg-cover flex justify-center`}>
        <Layout>
          <div className="text-white w-full">
            <div className={`flex gap-14 flex-col ${visivel ? 'pt-[18%]' : 'pt-[8%]'}`}>
              { visivel && 
              <div className="flex gap-10 flex-col">
              <div className="flex gap-4 flex-col">
                <h1 className="text-2xl font-semibold">
                  Bem-vindo ao Nosso Site de Pesquisa!
                </h1>
                <p className=" text-lg">
                  Com nossa inteligência artificial avançada, basta digitar o
                  nome do produto desejado e buscaremos as informações mais
                  relevantes e atualizadas para você.
                </p>
              </div>
              <div className="flex gap-8 flex-wrap items-center">
                <img src={CasasBahia} alt="Fundo"  />
                <img src={Amazon} alt="Fundo" className="h-8" />
                <img src={MercadoLivre} alt="Fundo" className="h-10" />
                <img src={Americanas} alt="Fundo" />
                <img src={MagazineLuiza} alt="Fundo" className="h-8"/>
                <img src={Kabum} alt="Fundo" className="h-8"/>
              </div>
            </div>
              }
              <div className="flex items-center border-2 rounded-full pl-10 h-14 ">
                <IoSearch />
                <input
                  onClick={handleInput}
                  onKeyDown={pesquisar}
                  onChange={(e) => setValorPesquisa(e.target.value)}
                  type="text"
                  placeholder="Pesquise um produto"
                  value={valorPesquisa}
                  className=" w-full bg-transparent  px-2 py-1 focus:outline-none focus:border-transparent"
                />
              </div>
            </div>
            {/* <Loading /> */}
          </div>
        </Layout>
      </div>
    </>
  );
}

export default App;

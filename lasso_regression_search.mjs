import { createInterface } from "readline";
import { stdin, stdout } from "process"; // Importa stdin e stdout explicitamente
import pkgBahia from "./casasBahia.js";
import pkgKabum from "./kabum.js";
// eslint-disable-next-line quotes
import pkgAmazon from './amazon.js';
import pkgAmericanas from "./lojasAmericanas.js";
import pkgLuiza from "./magazineLuiza.js";
import pkgMercado from "./mercado_livre.js";

const rl = createInterface({
	input: stdin, // Usa stdin diretamente
	output: stdout // Usa stdout diretamente
});

function lassoRegression(X, y, lambda, alpha, maxIterations) {
	const m = X.length;
	const n = X[0].length;
	let weights = new Array(n).fill(0);
	let intercept = 0;

	for (let iter = 0; iter < maxIterations; iter++) {
		let weightsUpdated = weights.slice();
		let interceptUpdated = intercept;

		// Atualiza intercept
		let errors = [];
		for (let i = 0; i < m; i++) {
			errors.push(y[i] - predict(X[i], weights, intercept));
		}
		interceptUpdated = intercept + alpha * (1 / m) * errors.reduce((a, b) => a + b, 0);

		// Atualiza weights
		for (let j = 0; j < n; j++) {
			let sum = 0;
			for (let i = 0; i < m; i++) {
				sum += X[i][j] * (y[i] - predict(X[i], weights, intercept));
			}
			if (weights[j] > 0) {
				weightsUpdated[j] = weights[j] + alpha * (1 / m) * sum - lambda;
			} else if (weights[j] < 0) {
				weightsUpdated[j] = weights[j] + alpha * (1 / m) * sum + lambda;
			} else {
				if (sum < -lambda) {
					weightsUpdated[j] = weights[j] + alpha * (1 / m) * sum + lambda;
				} else if (sum > lambda) {
					weightsUpdated[j] = weights[j] + alpha * (1 / m) * sum - lambda;
				} else {
					weightsUpdated[j] = 0;
				}
			}
		}

		// Verifica a convergência
		if (converged(weights, intercept, weightsUpdated, interceptUpdated, 1e-5)) {
			break;
		}

		weights = weightsUpdated;
		intercept = interceptUpdated;
	}

	return { weights, intercept };
}

function predict(x, weights, intercept) {
	let result = intercept;
	for (let i = 0; i < x.length; i++) {
		result += x[i] * weights[i];
	}
	return result;
}

function converged(weights, intercept, weightsUpdated, interceptUpdated, threshold) {
	for (let i = 0; i < weights.length; i++) {
		if (Math.abs(weights[i] - weightsUpdated[i]) > threshold) {
			return false;
		}
	}
	if (Math.abs(intercept - interceptUpdated) > threshold) {
		return false;
	}
	return true;
}

function normalizeData(data) {
	const min = Math.min(...data);
	const max = Math.max(...data);
	return data.map(value => (value - min) / (max - min));
}

function lassoRegressionPolynomial(X, y, degree, lambda, alpha, maxIterations) {
	// Expande as características originais em um conjunto de características polinomiais
	const XPolynomial = [];
	for (let i = 0; i < X.length; i++) {
		const x = X[i];
		const xPolynomial = [];
		for (let d = 0; d <= degree; d++) {
			xPolynomial.push(Math.pow(x, d));
		}
		XPolynomial.push(xPolynomial);
	}

	// Aplica a regressão Lasso no conjunto expandido de características
	return lassoRegression(XPolynomial, y, lambda, alpha, maxIterations);
}

// Dados fictícios de exemplo (preço, nota de avaliação)
let precos = [];
let notas = [];
let site = [];
let nomes = [];
let quantidade_aval = [];



function questionAsync(prompt) {
	return new Promise((resolve) => {
		rl.question(prompt, resolve);
	});
}

async function main() {
	const produto = await questionAsync("Digite aqui o nome do produto que você deseja pesquisar: ");
	console.log(`Você deseja pesquisar pelo produto: ${produto}`);
	console.log("\n");
	// Aqui você pode realizar a pesquisa do produto ou qualquer outra operação com o nome do produto
	rl.close();
	return produto; // Retorna o produto para que seja acessível fora da função
}

(async () => {
	const produto = await main();
	// Aqui você pode usar o valor de produto
})();


const produtoAmazon = pkgAmazon;
const produtoAmericanas = pkgAmericanas;
const produtoBahia = pkgBahia;
const produtoKabum = pkgKabum;
const produtoLuiza = pkgLuiza;
const produtoMercado = pkgMercado;

for(let i = 0; i < produtoAmazon.length; i++){
	//preços dos produtos
	precos.push(produtoAmazon[i].price);
	//avaliações dos produtos
	if(produtoAmazon[i].aval === "Não tem avaliação"){
		notas.push(1);
	}else{
		notas.push(produtoAmazon[i].aval);
	}
	//links dos produtos
	site.push(produtoAmazon[i].link);
	//nomes dos produtos
	nomes.push(produtoAmazon[i].name);
	//quantidade de avaliações dos produtos
	quantidade_aval.push(produtoAmazon[i].numAval);
}

for(let i = 0; i < produtoAmericanas.length; i++){
	//preços dos produtos
	precos.push(produtoAmericanas[i].price);
	//avaliações dos produtos
	if(produtoAmericanas[i].aval === "Não tem avaliação"){
		notas.push(1);
	}else{
		notas.push(produtoAmericanas[i].aval);
	}
	//links dos produtos
	site.push(produtoAmericanas[i].link);
	//nomes dos produtos
	nomes.push(produtoAmericanas[i].name);
	//quantidade de avaliações dos produtos
	quantidade_aval.push(produtoAmericanas[i].numAval);
}
for(let i = 0; i < produtoKabum.length; i++){
	//preços dos produtos
	precos.push(produtoKabum[i].price);
	//avaliações dos produtos
	if(produtoKabum[i].aval === "Não tem avaliação"){
		notas.push(1);
	}else{
		notas.push(produtoKabum[i].aval);
	}
	//links dos produtos
	site.push(produtoKabum[i].link);
	//nomes dos produtos
	nomes.push(produtoKabum[i].name);
	//quantidade de avaliações dos produtos
	quantidade_aval.push(produtoKabum[i].numAval);
}

for(let i = 0; i < produtoBahia.length; i++){
	//preços dos produtos
	precos.push(produtoBahia[i].price);
	//avaliações dos produtos
	if(produtoBahia[i].aval === "Não tem avaliação"){
		notas.push(1);
	}else{
		notas.push(produtoBahia[i].aval);
	}
	//links dos produtos
	site.push(produtoBahia[i].link);
	//nomes dos produtos
	nomes.push(produtoBahia[i].name);
	//quantidade de avaliações dos produtos
	quantidade_aval.push(produtoBahia[i].numAval);
}

for(let i = 0; i < produtoLuiza.length; i++){
	//preços dos produtos
	precos.push(produtoLuiza[i].price);
	//avaliações dos produtos
	if(produtoLuiza[i].aval === "Não tem avaliação"){
		notas.push(1);
	}else{
		notas.push(produtoLuiza[i].aval);
	}
	//links dos produtos
	site.push(produtoLuiza[i].link);
	//nomes dos produtos
	nomes.push(produtoLuiza[i].name);
	//quantidade de avaliações dos produtos
	quantidade_aval.push(produtoLuiza[i].numAval);
}

for(let i = 0; i < produtoMercado.length; i++){
	//preços dos produtos
	precos.push(produtoMercado[i].price);
	//avaliações dos produtos
	if(produtoMercado[i].aval === "Não tem avaliação"){
		notas.push(1);
	}else{
		notas.push(produtoMercado[i].aval);
	}
	//links dos produtos
	site.push(produtoMercado[i].link);
	//nomes dos produtos
	nomes.push(produtoMercado[i].name);
	//quantidade de avaliações dos produtos
	quantidade_aval.push(produtoMercado[i].numAval);
}

// Grau do polinômio
const degree = 1;
const lambda = 0.0001;
const alpha = 0.0001;
const maxIterations = 150;

for(let i = 0; i < notas.length; i++){
	notas[i] = ponderarNotas(notas[i], quantidade_aval[i]);
}

//função para dar peso as notas de acordo com a quantidade de avaliações
function ponderarNotas(notas, quantidade_aval){
	return notas*quantidade_aval;
}

// Normaliza os dados de preço e nota de avaliação
const precosNormalized = normalizeData(precos);
const notasNormalized = normalizeData(notas);
let intercept;
let weights;

// Usando a função lassoRegressionPolynomial para calcular os pesos e o intercepto
// Verifica se X é uma matriz válida antes de chamar a função lassoRegressionPolynomial
if (Array.isArray(precosNormalized) && precosNormalized.length > 0 && Array.isArray(notasNormalized) && notasNormalized.length > 0) {
	const resultadoLasso = lassoRegressionPolynomial(precosNormalized, notasNormalized, degree, lambda, alpha, maxIterations);
	// Restante do seu código que usa weights e intercept
	intercept = resultadoLasso.intercept;
	weights = resultadoLasso.weights;
} else {
	console.log("X não é uma matriz válida.");
}

let melhorCustoBenefico = Number.POSITIVE_INFINITY;
let indice = 0;

// Função para prever a relação custo/benefício de um novo produto
function preverCustoBeneficio(preco) {
	const valorTemporario = predict([preco, 1], weights, intercept);
	if(valorTemporario < melhorCustoBenefico){
		melhorCustoBenefico = valorTemporario;
		return true;
	}
	return false;
}

for(let i = 0; i < precos.length; i++){
	if(preverCustoBeneficio(precos[i])){
		indice = i;
	}
}

console.log(`O link do site com melhor custo/benefício para o produto ${nomes[indice]}: ${site[indice]}`);
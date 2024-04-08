function main(allResults){

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
	let quantidade_aval = [];

	for(const results of allResults){
		precos.push(results.price);
		notas.push(results.aval);
		quantidade_aval.push(results.numAval);
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

		
	function predictPrice(x, weights, intercept) {
		let result = intercept;
		for (let i = 0; i < x.length; i++) {
			result += x[i] * weights[i];
		}
		return result;
	}

	// Função para prever a relação custo/benefício de um novo produto
	function preverCustoBeneficio(preco, nota) {
		const valorTemporario = predictPrice([preco, nota], weights, intercept);
		if(valorTemporario < melhorCustoBenefico){
			melhorCustoBenefico = valorTemporario;
			return true;
		}
		return false;
	}

	for(let i = 0; i < precos.length; i++){
		if(preverCustoBeneficio(precos[i], notas[i])){
			indice = i;
		}
	}

	return {
		message: "O produto com o melhor custo benefício encontrado nos sites buscados foi",
		data: allResults[indice]
	};
}

module.exports = { main };

"use strict";

// 8.1 The estimation game


const MSE  = (estimates, actual, ddof=0) => statistic.CentralMoment(estimates, 2, actual, ddof);
const RMSE = (estimates, actual, ddof=0) => Math.sqrt(MSE(estimates, actual, ddof));


(function() {

	const title = "8.1 The estimation game";

	printTitle(title);


	/////////////////////////////////////////////

	function Estimate1(mu=0, sigma=1, n=7, m=1000, ddof=0)
	{

		const means = [];
		const medians = [];

		while(m-- > 0)
		{
			const xs = Array.from({length: n}, (_) => gauss.Variate([mu, sigma]) );

			const x̄ = statistic.Mean(xs);
			const median = statistic.Median(xs);

			means.push(x̄);
			medians.push(median);
		}

		console.log (
			'\trmse x̄ =', RMSE(means, mu, ddof).fixFloat() ,
			'\n\trmse median =', RMSE(medians, mu, ddof).fixFloat()
		);
	}


	/////////////////////////////////////////////

	Estimate1(0, 1, 6, 10000);

	var sample = [-0.441, 1.774, -0.101, -1.138, 2.975, -2.138];

	var mu     = statistic.Mean(sample);
	var sigma  = statistic.Std(sample, mu);
	var median = statistic.Median(sample);

	console.log (
		"mu =", mu.fixFloat(),
		"\nmedian=", median.fixFloat(),
		"\nsigma=", sigma.fixFloat()
	);

	Estimate1(mu, sigma, 6, 10000);

	var sample = [-0.441, 1.774, -0.101, -1.138, 2.975, -213.8];

	var mu     = statistic.Mean(sample);
	var sigma  = statistic.Std(sample, mu);
	var median = statistic.Median(sample);

	console.log (
		"mu =", mu.fixFloat(),
		"\nmedian =", median.fixFloat(),
		"\nsigma =", sigma.fixFloat()
	);

	Estimate1(mu, sigma, 6, 10000);

})();

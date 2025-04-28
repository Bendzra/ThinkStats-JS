"use strict";

// 8.2 Guess the variance


const MeanError = (estimates, actual) => statistic.CentralMoment(estimates, 1, actual);


(function() {

	const title = "8.2 Guess the variance";

	printTitle(title);


	/////////////////////////////////////////////

	var sample = [-0.441, 1.774, -0.101, -1.138, 2.975, -2.138];

	var mu       = statistic.Mean(sample);
	var variance = statistic.Variance(sample, mu, 0);
	var sigma    = statistic.Std(sample, mu, variance, 0)
	var median   = statistic.Median(sample);

	var variance_unbiased = statistic.Variance(sample, mu, 1);

	console.log(
		"mu =", mu.fixFloat(),
		"\nmedian =", median.fixFloat(),
		"\nsigma  =", sigma.fixFloat(),
		"\n\nvariance:",
		"\n\tbiased =", variance.fixFloat(),
		"\n\tunbiased =", variance_unbiased.fixFloat()
	);


	function Estimate2(mu = 0, sigma = 1, n=7, m=1000)
	{
		const estimates1 = [];
		const estimates2 = [];

		while(m-- > 0)
		{
			const xs = Array.from({length: n}, (_) => gauss.Variate([mu, sigma]) );

			const biased   = statistic.Variance(xs, NaN, 0);
			const unbiased = statistic.Variance(xs, NaN, 1);

			estimates1.push(biased);
			estimates2.push(unbiased);
		}

		console.log(
			'mean error biased =', MeanError(estimates1, sigma**2).fixFloat(),
			'\nmean error unbiased =', MeanError(estimates2, sigma**2).fixFloat()
		);
	}


	/////////////////////////////////////////////

	Estimate2(0, 1, 7, 1000);

})();

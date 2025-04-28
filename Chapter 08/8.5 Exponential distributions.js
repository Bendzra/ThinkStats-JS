"use strict";

// 8.5 Exponential distributions

(function() {

	const title = "8.5 Exponential distributions";

	printTitle(title);


	/////////////////////////////////////////////


	function Estimate3(n=7, m=1000)
	{
		const lambda = 2;
		const means = [];
		const medians = [];

		while(m-- > 0)
		{
			const xs = Array.from({length: n}, (_) => exponential.Variate(lambda) );
			const L = 1 / statistic.Mean(xs);
			const Lm = Math.log(2) / statistic.Median(xs);
			means.push(L);
			medians.push(Lm);
		}

		console.log(
			'rmse L =', RMSE(means, lambda),
			'\nrmse Lm =', RMSE(medians, lambda),
			'\nmean error L =', MeanError(means, lambda),
			'\nmean error Lm =', MeanError(medians, lambda)
		);
	}


	const sample = [5.384, 4.493, 19.198, 2.790, 6.122, 12.844];

	const x̄ = statistic.Mean(sample);
	const L = 1 / x̄;

	console.log(x̄, L);

	Estimate3(7, 10000);



})();

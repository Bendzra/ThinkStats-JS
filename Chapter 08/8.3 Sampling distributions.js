"use strict";

// 8.3 Sampling distributions

(function() {

	const title = "8.3 Sampling distributions";

	printTitle(title);


	/////////////////////////////////////////////

	function SimulateSample(mu=90, sigma=7.5, n=9, m=1000)
	{
		const means = [];

		while(m-- > 0)
		{
			const xs = Array.from({length: n}, (_) => gauss.Variate([mu, sigma]) );
			const x̄ = statistic.Mean(xs);
			means.push(x̄);
		}

		const cdf = new Cdf(means, null, `mu=${mu}, sigma=${sigma}`);
		const ci = [cdf.Percentile(5).fixFloat(), cdf.Percentile(95).fixFloat()];
		const stderr = RMSE(means, mu).fixFloat();

		console.log("stderr =", stderr, "\nci =", ci);

		return cdf;
	}


	const cdf = SimulateSample();

	var plotData = [];
	plotData.push(cdf.ChartData({type:"line"}));
	plotData = addVericals(plotData, [{"5%":cdf.Percentile(5)}, {"95%":cdf.Percentile(95)}]);
	var axes = {
		x:{title:'sample mean'},
		y:{title:"CDF"}
	};
	var caption = `Figure 8.1: Sampling distribution of x̄, with confidence interval.`;
	renderPlot(caption, plotData, "chart_1_", axes);


})();

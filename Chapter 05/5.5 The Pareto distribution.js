"use strict";

// 5.5 The Pareto distribution

(function() {

	const title = "5.5 The Pareto distribution";

	printTitle(title);


	var df = PEP_2012_PEPANNRES_with_ann;

	const pops = [];
	df.respop72012.data.forEach( (n) => { if(!isNaN(n) && n > 0) pops.push(n); } );
	pops.sort( (a, b) => a - b );

	console.log('Number of cities/towns =', pops.length);
	console.log('population: min =', pops[0], '\r\n\tmax =', pops[pops.length-1]);


	/// Data CDF:

	var cdf = new Cdf(pops, null, "data CDF");

	var mu  = cdf.Mean();
	var std = cdf.Std(mu);
	console.log( "mean =", mu.fixFloat(1), "\r\nstd =", std.fixFloat(1) );

	var plotData = [];
	plotData.push(cdf.ChartData({type:"line"}));


	/// Model: Pareto

	var ccdf        = cdf.Copy("data CCDF");
	var pareto_cdf  = cdf.Copy("pareto CDF");
	var pareto_ccdf = cdf.Copy("pareto CCDF");

	// var xmin = 1000, α=0.8;
	var xmin = 5000, α=1.4;

	for(var i = 0; i < cdf.xs.length; i++)
	{
		ccdf.ps[i]        = 1 - cdf.ps[i];
		pareto_cdf.ps[i]  = (cdf.xs[i]< xmin) ? 0 : pareto.evalCdf(cdf.xs[i], [xmin, α]);
		pareto_ccdf.ps[i] = 1 - pareto_cdf.ps[i];
	}

	plotData.push(ccdf.ChartData({type:"line"}));
	plotData.push(pareto_cdf.ChartData({type:"line"}));
	plotData.push(pareto_ccdf.ChartData({type:"line"}));

	var axes = {
		x:{title:`population`, maximum:500000},
		y:{title:`CDF & CCDF`}
	};
	var caption = "CCDFs of city and town populations";
	var prefix  = "cart_pareto_"
	renderPlot(caption, plotData, prefix, axes);


	/// Log scales Data

	var log_ccdf = new Cdf(null, null, "data");
	var log_pareto_ccdf = new Cdf(null, null, "pareto model");
	for(var i = 0, j = 0; i < ccdf.xs.length; i++)
	{
		if(ccdf.xs[i] <= 0 || ccdf.ps[i] <=0 ) continue;

		log_ccdf.xs[j] = Math.log10(ccdf.xs[i]);
		log_ccdf.ps[j] = ccdf.ps[i];

		log_pareto_ccdf.xs[j] = Math.log10(pareto_ccdf.xs[i]);
		log_pareto_ccdf.ps[j] = pareto_ccdf.ps[i];

		j++;
	}

	var plotData = [];
	plotData.push(log_ccdf.ChartData({type:"line"}));
	plotData.push(log_pareto_ccdf.ChartData({type:"line"}));

	var axes = {
		x:{title:`population`},
		y:{title:`CCDF`, logarithmic: true, minimum:1.0e-6}
	};
	var caption = "CCDFs of city and town populations, on a log-log scale";
	var prefix  = "cart_pareto_LOG_"
	renderPlot(caption, plotData, prefix, axes);


	/// Log-Normal

	var plotData = [];

	var log_pops = pops.map((pop) => Math.log10(pop));

	var cdf = new Cdf(log_pops, null, "data");
	plotData.push(cdf.ChartData({type:"line"}));

	var mu  = cdf.Mean();
	var std = cdf.Std(mu);

	var cdf = gauss.cdfFromRange("log-normal model", [mu, std], {"xs":log_pops});
	plotData.push(cdf.ChartData({type:"line"}));

	var axes = {
		x:{title:`log10 population`},
		y:{title:`CDF`}
	};
	var caption = "Figure 5.11: CDF of city and town populations on a log-x scale";
	var prefix  = "chart_Figure_5_11_";
	renderPlot(caption, plotData, prefix, axes);


	function render(dataset, label, caption, prefix)
	{
		var plotData = [];

		var cdf = new Cdf(dataset, null, "data");

		var hist = new Hist(null, `data`);
		cdf.ps.forEach( (p, i) => hist.Set(gauss.Quantile(p), cdf.xs[i]) );
		plotData.push(hist.ChartData({type:"line"}));

		var xs = [...hist.Values()];

		var mu  = cdf.Mean();
		var std = cdf.Std(mu);
		console.log(`population (${label}) mean = ${mu.toFixed(2)}, std = ${std.toFixed(2)}`);

		var hist = graph.histLine(`log-normal model`, std, mu, {"xs":xs});

		plotData.push(hist.ChartData({type:"line"}));

		var axes = {
			x:{title:`z`},
			y:{title:`population (${label})`}
		};
		renderPlot(caption, plotData, prefix, axes);
	}

	render(pops, "linear", "Normal probability plots for populations on a linear scale", "chart_lenear2_");
	render(log_pops, "log10", "Normal probability plot of log-transformed populations", "chart_log2_");

})();

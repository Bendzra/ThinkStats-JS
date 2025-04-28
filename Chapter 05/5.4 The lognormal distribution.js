"use strict";

// 5.4 The lognormal distribution

(function() {

	const title = "5.4 The lognormal distribution";

	printTitle(title);

})();

(function() {

	const subtitle = "DF Tests";

	printTitle(subtitle);

	const df = cdc_brfss2008;

	const TOTAL = 414509;

	/// AGE (Reported Age in Years)
	var tests = [
		["Don’t know/Not sure",    280,	      7],
		["Refused	 "        ,   3373,	      9],
		["Age 18 - 24"        ,  14050,	[18,24]],
		["Age 25 - 34"        ,  39374,	[25,34]],
		["Age 35 - 44"        ,  61903,	[35,44]],
		["Age 45 - 54"        ,  84268,	[45,54]],
		["Age 55 - 64"        ,  87834,	[55,64]],
		["Age 65 or older"	  , 123427,	[65,99]]
	];
	validateData(df, "age", tests, TOTAL);


	/// WTYRAGO (Reported Weight year ago in Pounds)
	var tests = [
		["Weight (pounds)",    389924,     [50,999]],
		["Don’t know/Not sure",  7705,	       7777],
		["Weight (kilograms)",    475,	[9000,9998]],
		["Refused",               595,	       9999],
		["Not asked or Missing",15810,	        '.']
	];
	validateData(df, "wtyrago", tests, TOTAL);

	/// SEX (Respondents Sex)
	var tests = [
		["Male",   155703, 1 ],
		["Female", 258806, 2 ],
	];
	validateData(df, "sex", tests, TOTAL);

	/// _FINALWT (Final weight assigned to each respondent)
	var tests = [
		// ["HIDDEN", 414509, "---"]
	];
	validateData(df, "_finalwt", tests, TOTAL);

	/// HTM3 (Computed Height in Meters)
	var tests = [
		["Height in meters",         409129, [1,998]],
		["Don’t know/Refused/Missing", 5380,     999]
	];
	validateData(df, "htm3", tests, TOTAL);

	/// WTKG2 (Computed Weight in Kilograms)
	var tests = [
		["Weight in kilograms",   398484, [1,99998]],
		["Don’t know/Refused/Missing", 16025, 99999]
	];
	validateData(df, "wtkg2", tests, TOTAL);


})();


(function() {

	const subtitle = "Log Normal vs Normal CDFs";

	printTitle(subtitle);

	const df = cdc_brfss2008;

	///

	const weights = [];
	df.wtkg2.data.forEach( (kg) => { if(!isNaN(kg)) weights.push(kg); } );
	weights.sort( (a, b) => a - b );

	const log_weights = weights.map( (kg) => Math.log10(kg) );

	function render(dataset, label, caption, prefix)
	{
		var plotData = [];

		var cdf = new Cdf(dataset, null, "weights");
		plotData.push(cdf.ChartData({type:"line"}));

		var mu  = cdf.Mean();
		var std = cdf.Std(mu);
		console.log(`weights(${label}) mean = ${mu.toFixed(2)}, std = ${std.toFixed(2)}`);

		var cdf = gauss.cdfFromRange( `model`, [mu, std], {nDots:cdf.xs.length, low:cdf.xs[0], high:cdf.xs[cdf.xs.length-1]} );
		plotData.push(cdf.ChartData({type:"line"}));

		var axes = {
			x:{title:`adult weight (${label})`},
			y:{title:"CDF"}
		};
		renderPlot(caption, plotData, prefix, axes);
	}

	render(weights, "kg", "CDF of adult weights on a linear scale", "chart_lenear_");
	render(log_weights, "log10 kg", "CDF of adult weights on a log scale", "chart_log_");

})();

(function() {

	const subtitle = "Normal probability plots";

	printTitle(subtitle);

	const df = cdc_brfss2008;

	///

	const weights = [];
	df.wtkg2.data.forEach( (kg) => { if(!isNaN(kg)) weights.push(kg); } );
	weights.sort( (a, b) => a - b );

	const log_weights = weights.map( (kg) => Math.log10(kg) );

	function render(dataset, label, caption, prefix)
	{
		var plotData = [];

		var cdf = new Cdf(dataset, null, "weights");

		var hist = new Hist(null, `weights`);
		cdf.ps.forEach( (p, i) => hist.Set(gauss.Quantile(p), cdf.xs[i]) );
		plotData.push(hist.ChartData({type:"line"}));

		var xs = [...hist.Values()];

		var mu  = cdf.Mean();
		var std = cdf.Std(mu);
		console.log(`weights(${label}) mean = ${mu.toFixed(2)}, std = ${std.toFixed(2)}`);

		var hist = graph.histLine(`model`, std, mu, {"xs":xs});

		plotData.push(hist.ChartData({type:"line"}));

		var axes = {
			x:{title:`z`},
			y:{title:`weights (${label})`}
		};
		renderPlot(caption, plotData, prefix, axes);
	}

	render(weights, "kg", "Normal probability plots for adult weight on a linear scale", "chart_lenear2_");
	render(log_weights, "log10 kg", "Normal probability plots for adult weight on a log scale", "chart_log2_");

})();

"use strict";

// 5.1 The exponential distribution

(function() {

	const title = "5.1 The exponential distribution";

	printTitle(title);

	///

	const xs = spreadDots(null, 100, 0, 3);

	var plotData = [];

	const λs = [2, 1, 0.5];

	λs.forEach( (λ) => {
		var ps = xs.map( (x) => exponential.evalCdf(x, λ) );
		var cdf = new Cdf(xs, ps, `λ = ${λ}`);
		plotData.push(cdf.ChartData({type:"line"}));
	});

	var axes = {
		x:{title:"x"},
		y:{title:"CDF"}
	};
	var caption = "Figure 5.1: CDFs of exponential distributions with various parameters";
	renderPlot(caption, plotData, "chart_exp_", axes);

})();

(function() {

	const title = "Babyboom";

	printTitle(title);

	const db = babyboom;

	const diffs = db.minutes.data.map( (m, i, minutes) => {return minutes[i+1] - m;} );

	var cdf = new Cdf(diffs, null, 'actual');

	var plotData = [cdf.ChartData({type:"line"})];
	var axes = {
		x:{title:"minutes"},
		y:{title:"CDF"}
	};
	var caption = "Figure 5.2: CDF of interarrival times";
	renderPlot(caption, plotData, "chart_boom_", axes);

	const cps = cdf.ps.map( (p) => {return 1-p;})

	const ccdf = new Cdf(cdf.xs.slice(0,-1), cps.slice(0,-1), "complementary");

	var plotData = [ccdf.ChartData({type:"line"})];
	var axes = {
		x:{title:"minutes"},
		y:{title:"CDF", logarithmic: true}
	};
	var caption = "Figure 5.2: CCDF on a log-y scale";
	renderPlot(caption, plotData, "chart_log_", axes);

})();

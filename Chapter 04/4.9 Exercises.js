"use strict";

// 4.9 Exercises

(function() {

	const title = "Exercise 4.1";

	printTitle(title);

	const preg = nsfg_2002FemPreg;

	var live   = {totalwgt_lb:[]};
	var firsts = {totalwgt_lb:[]};
	var others = {totalwgt_lb:[]};

	preg.totalwgt_lb.data.forEach( (lbs, i) => {
		if(preg.outcome.data[i] === 1)
		{
			live.totalwgt_lb.push(lbs);
			if (preg.birthord.data[i] === 1) firsts.totalwgt_lb.push(lbs);
			else others.totalwgt_lb.push(lbs);
		}
	});

	var live_cdf   = new Cdf(  live.totalwgt_lb, null, "live");
	var firsts_cdf = new Cdf(firsts.totalwgt_lb, null, "firsts");
	var others_cdf = new Cdf(others.totalwgt_lb, null, "others");

	const w = 4.3 * 2.2046;

	console.log(`live_cdf.PercentileRank(${ w })   =` ,   live_cdf.PercentileRank(w).fixFloat(5) );
	console.log(`firsts_cdf.PercentileRank(${ w }) =` , firsts_cdf.PercentileRank(w).fixFloat(5) );
	console.log(`others_cdf.PercentileRank(${ w }) =` , others_cdf.PercentileRank(w).fixFloat(5) );

})();

(function() {

	const title = "Exercise 4.2";

	printTitle(title);

	const N = 1000;

	const xs = (Array.from({length: N}, (_) => Math.random())).sort( (a,b) => {return a-b;} );

	const pmf = new Pmf(xs, "PMF");
	const cdf = new Cdf(xs, "PMF");

	var plotData = [cdf.ChartData({type:"line"})];
	var axes = {
		x:{title:"Math.random"},
		y:{title:"CDF"}
	};
	var caption = "Exercise 4.2: CDF of Math.random";
	renderPlot(caption, plotData, "chart_cdf_", axes);

	var plotData = [pmf.ChartData({type:"line"})];
	var axes = {
		x:{title:"Math.random"},
		y:{title:"PMF"}
	};
	var caption = "Exercise 4.2: PMF of Math.random";
	renderPlot(caption, plotData, "chart_pmf_", axes);


})();

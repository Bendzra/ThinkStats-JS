"use strict";

// 10.8 Exercises


(function() {


	const title = "10.8 Exercises";

	printTitle(title);


	/////////////////////////////////////////////

	const subtitle = "Exercise 10.1: BRFSS";

	printTitle(subtitle);


	/// BRFSS

	const db = cdc_brfss2008;
	const subset = ['_finalwt', 'htm3', 'wtkg2'];
	const df = dropna( db, subset);


	/// compute the linear least squares fit for log(weight) versus height

	const xs = df.htm3;
	const ys = df.wtkg2.map( (w) => Math.log(w) );

	const [inter, slope] = LeastSquares(xs, ys);

	console.log("inter, slope =", [inter, slope]);

	const scatter = new Cdf(xs, ys);
	const hl = graph.histLine("", slope, inter, {"xs":xs});

	var plotData = [];
	plotData.push(scatter.ChartData({type:"scatter", markerSize:3}));
	plotData.push(hl.ChartData({type:"line"}));
	var axes = {
		x:{title:'htm3'},
		y:{title:"log(wtkg2)"}
	};
	var caption = `log(weight) versus height`;
	renderPlot(caption, plotData, `chart_1_`, axes);


	/// Use resampling, with and without weights

	const iters = 101;

	var estimates = Array.from( {length: iters}, (_) => statistic.Mean(ResampleRows(df).htm3) );
	var cdf = new Cdf(estimates);
	var ci = cdf.CredibleInterval(90);

	console.log("Unweighted:",
		"\n\tmean htm3 =", statistic.Mean(estimates).fixFloat(),
		"\n\tstandard =", statistic.Std(estimates).fixFloat(),
		"\n\t90% CI =", [ci[0].fixFloat(), ci[1].fixFloat()]
	);

	var estimates = Array.from( {length: iters}, (_) => statistic.Mean(ResampleRowsWeighted(df, '_finalwt').htm3) );
	var cdf = new Cdf(estimates);
	var ci = cdf.CredibleInterval(90);

	console.log("Weighted:",
		"\n\tmean htm3 =", statistic.Mean(estimates).fixFloat(),
		"\n\tstandard =", statistic.Std(estimates).fixFloat(),
		"\n\t90% CI =", [ci[0].fixFloat(), ci[1].fixFloat()]
	);

})();

"use strict";

// Exercise 7.1

(function() {

	const title = "Exercise 7.1";

	printTitle(title);


	///

	const db = nsfg_2002FemPreg;

	const subset = ['agepreg', 'totalwgt_lb'];
	const LIVE_BIRTHS = ( (i) => db.outcome.data[i] === 1 );
	const df = dropna( db, subset, LIVE_BIRTHS );

	const [[minAge, maxAge], [minWgt, maxWgt]] = df.agepreg.reduce( (minmax, age, i) => {

		let [[minA, maxA], [minW, maxW]] = minmax;

		if(minA > df.agepreg[i]) minA = df.agepreg[i];
		if(maxA < df.agepreg[i]) maxA = df.agepreg[i];
		if(minW > df.totalwgt_lb[i]) minW = df.totalwgt_lb[i];
		if(maxW < df.totalwgt_lb[i]) maxW = df.totalwgt_lb[i];

		return [[minA, maxA], [minW, maxW]];

	}, [[Infinity, -Infinity], [Infinity, -Infinity]]);

	console.log("Records:", df.agepreg.length, "\nMinMax Age:", [minAge, maxAge], "\nMinMax Weight:", [minWgt, maxWgt]);

	///

	var scatter = new Cdf(df.agepreg, df.totalwgt_lb);

	var plotData = [];
	plotData.push(scatter.ChartData({type:"scatter", markerColor: 'rgba(0,0,255,0.09)'/*, markerSize: 8*/}));
	var axes = {
		x:{title:'mother’s age'},
		y:{title:"birth weight (lb)"}
	};
	var caption = `birth weight versus mother’s age, unjittered`;
	renderPlot(caption, plotData, "chart_1_", axes, {height:600, width:700});

	///

	var pearson_corr = statistic.Corr(df.agepreg, df.totalwgt_lb);
	var spearman_rank_corr = statistic.SpearmanCorr(df.agepreg, df.totalwgt_lb);

	console.log("correlation (agepreg, totalwgt_lb):",
		"\n\tPearson’s  =", pearson_corr,
		"\n\tSpearman’s rank =", spearman_rank_corr);


	// heights ranged (in bins):

	const low   = 13,
	      high  = 42,
	      step  = 1;

	const indices = digitizeIndices(df.agepreg, low, high, step);
	const groups = groupby(df, indices);

	for (const name in groups) {
		const count = groups[name].map( (arr) => arr.length );
		console.log(name, "bin counts:", count);
	}

	var ages = groups.agepreg.map( (xs) => statistic.Mean(xs) );
	var cdfs = groups.totalwgt_lb.map( (ws) => new Cdf(ws) );

	const percents = [75, 50, 25];
	var plotData = [];
	percents.forEach( (percent) => {
		const weights = cdfs.map( (cdf) => cdf.Percentile(percent) );
		const label = `${percent} % percent`;
		const cdf = new Cdf(ages, weights, label);
		plotData.push( cdf.ChartData({type:"line"}) );
	});

	var axes = {
		x:{title:'mother’s age'},
		y:{title:"birth weight (lb)"}
	};
	var caption = `Percentiles of weight for a range of age bins`;
	renderPlot(caption, plotData, "chart_2_", axes, {height:600, width:700});

})();

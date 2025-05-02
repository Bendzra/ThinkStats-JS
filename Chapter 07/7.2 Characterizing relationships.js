"use strict";

// 7.2 Characterizing relationships


(function() {

	const title = "7.2 Characterizing relationships";

	printTitle(title);


	///

	const db = cdc_brfss2008;

	const subset = ['htm3', 'wtkg2'];
	const df = dropna(db, subset);


	// heights ranged (in bins):

	const low   = 135,
		  high  = 210,
		  step  = 5;

	const indices = digitizeIndices(df.htm3, low, high, step);

	// grouping weights as to height groups

	const groups = groupby(df, indices);

	for (const name in groups) {
		const count = groups[name].map( (arr) => arr.length );
		console.log(name, "bin counts:", count);
	}

	var heights = groups.htm3.map( (hs) => statistic.RawMoment(hs, 1) );
	var cdfs    = groups.wtkg2.map( (ws) => new Cdf(ws) );

	const percents = [75, 50, 25];
	var plotData = [];
	percents.forEach( (percent) => {
		const weights = cdfs.map( (cdf) => cdf.Percentile(percent) );
		const label = `${percent} % percent`;
		const cdf = new Cdf(heights, weights, label);
		plotData.push( cdf.ChartData({type:"line"}) );
	});

	var axes = {
		x:{title:'height (cm)'},
		y:{title:"weight (kg)"}
	};
	var caption = `Figure 7.3: Percentiles of weight for a range of height bins`;
	renderPlot(caption, plotData, "chart_7_3_", axes);

})();

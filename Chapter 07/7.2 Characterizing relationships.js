"use strict";

// 7.2 Characterizing relationships

function digitizeIndices(arr, low, high, step)
{
	const nBins = 1 + Math.floor( fixFloat((high - low) / step) ) + 1;

	// indices: arr index ==> bin index

	const indices = new Array(arr.length);

	arr.forEach( (v, index) => {

		let ibin = NaN;

		if      (v  <  low) ibin = 0;
		else if (v >= high) ibin = nBins - 1;
		else ibin = 1 + Math.floor( fixFloat((v - low) / step) );

		indices[index] = ibin;
	});

	return indices;
}


function groupby(df, indices)
{
	const groups = {};
	for(const name in df) groups[name] = [];

	indices.forEach( (ibin, i) => {
		for(const name in df)
		{
			if(!groups[name][ibin]) groups[name][ibin] = [];
			groups[name][ibin].push(df[name][i]);
		}
	});

	return groups;
}

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

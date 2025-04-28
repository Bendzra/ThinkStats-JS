"use strict";

///////////////////////////////////////////////////////////////////////////////
// 4.3 CDFs
//
// The percentile rank is the fraction of people who scored lower than you (or the same).

(function() {

	const title = "4.3 CDFs";

	printTitle(title);

	///

	function EvalCdf(sample, x)
	{
		var count = 0;
		sample.forEach( (value) => { if (value <= x) count += 1;});
		const prob = count / sample.length;
		return prob;
	}

	const sample = [1, 2, 2, 3, 5];

	const hist = new Hist();

	sample.forEach( (val) => hist.Set(val, EvalCdf(sample, val)) );

	hist.Print();

	var plotData = [hist.ChartData({type:"stepArea"})];
	var axes = {
		x:{title:""},
		y:{title:"CDF"}
	};
	var caption = "Figure 4.2: Example of a CDF";
	renderPlot(caption, plotData, "chart_", axes);


})();

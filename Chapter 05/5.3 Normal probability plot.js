"use strict";

///////////////////////////////////////////////////////////////////////////////

// 5.3 Normal probability plot


///////////////////////////////////////////////////////////////////////////////

(function() {

	const title = "5.3 Normal probability plot";

	printTitle(title);


	///

	const preg = nsfg_2002FemPreg ;

	var live      = {totalwgt_lb:[]};
	var full_term = {totalwgt_lb:[]};
	var others    = {totalwgt_lb:[]};

	preg.totalwgt_lb.data.forEach( (pounds, i) => {
		if(preg.outcome.data[i] === 1)
		{
			live.totalwgt_lb.push(pounds);
			if (preg.prglngth.data[i] > 36) full_term.totalwgt_lb.push(pounds);
			else others.totalwgt_lb.push(pounds);
		}
	});


	var plotData = [];
	var xs = spreadDots(null, 2000, -4, 4);

	var toPlot = [
		{label: "full term", data: full_term},
		{label: "all live" , data: live}
	];

	toPlot.forEach( (tp, i) => {

		var sorted = [];
		tp.data.totalwgt_lb.forEach( (v) => { if(!isNaN(v)) sorted.push(v); } );
		sorted.sort( (a, b) => a - b );

		// Normal probability plot:

		var hist = gauss.distProbPlot(sorted, [0,1], `${tp.label} (random)`, {"xs":xs}, 1);
		plotData.push(hist.ChartData({type:"line"}));


		// juxtapose with direct quantiles:

		var hist = gauss.distProbPlot(sorted, [0,1], `${tp.label} (quantile)`, null, 3);
		plotData.push(hist.ChartData({type:"line"}));


		// 4. Graph: y = mean∙x + std

		var pmf = new Pmf(sorted);
		var mu  = pmf.Mean();
		var std = pmf.Std(mu);
		console.log(`${tp.label} weights:\r\nmean=${mu.toFixed(2)}, std=${std.toFixed(2)}`);

		var hist = graph.histLine(`${tp.label} (y = ${std.toFixed(2)} * x + ${mu.toFixed(2)})`, std, mu, {"xs":xs});
		plotData.push(hist.ChartData({type:"line"}));

	});

	var axes = {
		x:{title:"standard normal sample"},
		y:{title:"sample values (lbs)"}
	};
	var caption = "Figure 5.6: Normal probability plot of birth weights";
	renderPlot(caption, plotData, "chart_", axes);

})();

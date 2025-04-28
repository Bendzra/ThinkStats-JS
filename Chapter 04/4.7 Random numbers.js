"use strict";

///////////////////////////////////////////////////////////////////////////////
// 4.7 Random numbers
//

(function() {

	const title = "4.7 Random numbers";

	printTitle(title);

	///

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

	var cdf = new Cdf(live.totalwgt_lb, null, "totalwgt_lb");

	console.log("*** median = ", cdf.Percentile(50));
	console.log("*** iqr = ", cdf.IQR());
	console.log("*** mean = ", cdf.Mean().fixFloat(3));

	var sample = Array(100).fill(0).map( (_) => {
		var i = Math.floor(Math.random() * live.totalwgt_lb.length);
		return live.totalwgt_lb[i];
	});


	var ranks = sample.map( (x) => {return cdf.PercentileRank(x)} );

	var cdf = new Cdf(ranks, null, "percentile ranks");

	var plotData = [cdf.ChartData({type:"stepLine"})];
	var axes = {
		x:{title:"Percentile rank"},
		y:{title:"CDF"}
	};
	var caption = "Figure 4.5: CDF of percentile ranks for a random sample of birth weights";
	renderPlot(caption, plotData, "chart_", axes);


})();

"use strict";

///////////////////////////////////////////////////////////////////////////////
// 4.5 Comparing CDFs
//


(function() {

	const title = "4.5 Comparing CDFs";

	printTitle(title);

	///

	const preg = nsfg_2002FemPreg;

	var live   = {totalwgt_lb:[]};
	var firsts = {totalwgt_lb:[]};
	var others = {totalwgt_lb:[]};

	preg.totalwgt_lb.data.forEach( (pounds, i) => {
		if(preg.outcome.data[i] === 1)
		{
			live.totalwgt_lb.push(pounds);
			if (preg.birthord.data[i] === 1) firsts.totalwgt_lb.push(pounds);
			else others.totalwgt_lb.push(pounds);
		}
	});

	var plotData = [];

	var first_cdf = new Cdf(firsts.totalwgt_lb, null, "first");
	plotData.push(first_cdf.ChartData({type:"stepLine"}));

	var others_cdf = new Cdf(others.totalwgt_lb, null, "others");
	plotData.push(others_cdf.ChartData({type:"stepLine"}));

	var axes = {
		x:{title:"Birth weight (pounds)"},
		y:{title:"CDF"}
	};
	var caption = "Figure 4.4: CDF of birth weights for first babies and others";
	renderPlot(caption, plotData, "chart_", axes);


})();

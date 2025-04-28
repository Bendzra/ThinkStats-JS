"use strict";

///////////////////////////////////////////////////////////////////////////////
// 4.4 Representing CDFs
//


(function() {

	const title = "4.4 Representing CDFs";

	printTitle(title);

	///

	const preg = nsfg_2002FemPreg;

	var live   = {prglngth:[]};
	var firsts = {prglngth:[]};
	var others = {prglngth:[]};

	preg.prglngth.data.forEach( (weeks, i) => {
		if(preg.outcome.data[i] === 1)
		{
			live.prglngth.push(weeks);
			if (preg.birthord.data[i] === 1) firsts.prglngth.push(weeks);
			else others.prglngth.push(weeks);
		}
	});

	var cdf = new Cdf(live.prglngth, null, "prglngth");
	var plotData = [cdf.ChartData({type:"stepLine"})];
	var axes = {
		x:{title:"Pregnancy length (weeks)"},
		y:{title:"CDF"}
	};
	var caption = "Figure 4.3: CDF of pregnancy length";
	renderPlot(caption, plotData, "chart_", axes);


})();

"use strict";

// 2.6 First babies

(function() {

	const title = "2.6 First babies";

	printTitle(title);

	const df = nsfg_2002FemPreg;

	var firsts = {index:[], birthord:[], prglngth:[]};
	var others = {index:[], birthord:[], prglngth:[]};

	df.prglngth.data.forEach( (weeks, i) => {
		if(df.outcome.data[i] === 1)
		{
			if (df.birthord.data[i] === 1)
			{
				firsts.index.push(i);
				firsts.birthord.push(1)
				firsts.prglngth.push(weeks);
			}
			else
			{
				others.index.push(i);
				others.birthord.push(df.birthord.data[i])
				others.prglngth.push(weeks);
			}
		}
	});

	var first_hist = new Hist(firsts.prglngth, 'first');
	var other_hist = new Hist(others.prglngth, 'other');

	var plotData = [];
	plotData.push(first_hist.ChartData({type:"column"})); // {type:"stackedColumn"}
	plotData.push(other_hist.ChartData({type:"column"})); // {type:"stackedColumn"}
	var axes = {
		x:{title:"weeks", minimum:27, maximum:46},
		y:{title:"frequency"}
	};
	renderPlot("Figure 2.5: Histogram of pregnancy lengths", plotData, "chart_first_", axes);

})();

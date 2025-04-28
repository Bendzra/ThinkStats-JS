"use strict";

// 3.3 Other visualizations

(function() {

	const title = "3.3 Other visualizations";

	printTitle(title);

	const preg = nsfg_2002FemPreg;

	var firsts = {prglngth:[]};
	var others = {prglngth:[]};

	preg.prglngth.data.forEach( (weeks, i) => {
		if(preg.outcome.data[i] === 1)
		{
			if (preg.birthord.data[i] === 1) firsts.prglngth.push(weeks);
			else others.prglngth.push(weeks);
		}
	});

	var first_pmf = new Pmf(firsts.prglngth, 'first');
	var other_pmf = new Pmf(others.prglngth, 'other');

	var plotData = [];
	plotData.push(first_pmf.ChartData({type:"stepArea"})); // {type:"stackedColumn"}
	plotData.push(other_pmf.ChartData({type:"stepLine"})); // {type:"stackedColumn"}
	var axes = {
		x:{title:"weeks", minimum:35, maximum:46},
		y:{title:"probability"}
	};
	var caption = "Figure 3.1: PMF of pregnancy lengths for first babies and others";
	renderPlot(caption, plotData, "chart_first_", axes);

	var diffs_hist = new Hist(null, "diffs = firsts - others");

	for( const [week, p1] of first_pmf.Items())
	{
		if (35 <= week && week <= 46)
		{
			var p2 = other_pmf.Prob(week);
			var diff = 100 * (p1 - p2);
			diffs_hist.Set(week, diff);
		}
	}

	var plotData = [diffs_hist.ChartData({type:"stepArea"})];
	var axes = {
		x:{title:"weeks"},
		y:{title:"percentage points"}
	};
	var caption = "Figure 3.2: Difference, in percentage points, by week";
	renderPlot(caption, plotData, "chart_diffs_", axes);

})();

"use strict";

// Exercise 3.3

(function() {

	const title = "Exercise 3.3";

	printTitle(title);

	const preg = nsfg_2002FemPreg;

	// computing the differences of "prglngth" between
	// first and others ("birthord")
	// of live ("outcome") for respondents who have at least two babies

	function preglens()
	{
		this.first = NaN;
		this.other = [];
	}

	var cpm = {}; // a map from caseid to pregnancy lengths spreading

	preg.caseid.data.forEach( (caseid, i) => {
		if( !(caseid in cpm) ) cpm[caseid] = new preglens();
		if(preg.outcome.data[i] === 1)
		{
			var prglngth = preg.prglngth.data[i];
			if(preg.birthord.data[i] === 1) cpm[caseid].first = prglngth;
			else cpm[caseid].other.push(prglngth);
		}
	});

	var first_pmf = new Pmf(null, 'firsts');
	var other_pmf = new Pmf(null, 'others');

	for(var caseid in cpm)
	{
		if(cpm[caseid].other.length)
		{
			first_pmf.Incr(cpm[caseid].first);
			cpm[caseid].other.forEach( (prglngth) => other_pmf.Incr(prglngth) );
		}
	}
	first_pmf.Normalize();
	other_pmf.Normalize();

	var plotData = [];
	plotData.push(first_pmf.ChartData({type:"spline"}));
	plotData.push(other_pmf.ChartData({type:"spline"}));
	var axes = {
		x:{title:"weeks", minimum:35, maximum:46},
		y:{title:"probability"}
	};
	var caption = "Distribution of the pregnancy length";
	renderPlot(caption, plotData, "chart_prglngth_", axes);

	/////////////////////////////

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

	var plotData = [diffs_hist.ChartData({type:"splineArea"})];
	var axes = {
		x:{title:"weeks"},
		y:{title:"percentage points"}
	};
	var caption = "Difference, in percentage points, by week";
	renderPlot(caption, plotData, "chart_diffs_", axes);


})();

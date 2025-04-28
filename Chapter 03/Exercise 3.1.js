"use strict";

// Exercise 3.1

(function() {

	const title = "Exercise 3.1";

	printTitle(title);

	const resp = nsfg_2002FemResp;

	// NUMKDHH (Number of bio/adopt/related/legal children under age 18 in household)
	var tests = [
		["NO CHILDREN"       , 3563, 0],
		["1 CHILD"           , 1636, 1],
		["2 CHILDREN"        , 1500, 2],
		["3 CHILDREN"        , 666 , 3],
		["4 CHILDREN"        , 196 , 4],
		["5 CHILDREN OR MORE", 82  , 5]
		// Total 7643
	];
	validateData(resp, "numkdhh", tests, 7643);

	console.log("--------");

	const actual_pmf = new Pmf(null, 'actual');
	tests.forEach( ([label, freq, val]) => actual_pmf.Set(val, freq) );
	actual_pmf.Normalize();

	const biased_pmf = BiasPmf(actual_pmf, 'biased');

	console.log("actual mean =", fixFloat(actual_pmf.Mean()) );
	console.log("biased mean =", fixFloat(biased_pmf.Mean()) );
	console.log("actual variance =", fixFloat(actual_pmf.Variance()) );
	console.log("biased variance =", fixFloat(biased_pmf.Variance()) );
	console.log("actual std =", fixFloat(actual_pmf.Std()) );
	console.log("biased std =", fixFloat(biased_pmf.Std()) );

	var plotData = [];
	plotData.push(actual_pmf.ChartData({type:"spline"}));
	plotData.push(biased_pmf.ChartData({type:"spline"}));
	var axes = {
		x:{title:"number"},
		y:{title:"PMF"}
	};
	var caption = "Distribution of the number of children under 18 in the household";
	renderPlot(caption, plotData, "chart_classes_", axes);

})();

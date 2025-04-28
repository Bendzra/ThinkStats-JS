"use strict";

// 3.4 The class size paradox

function BiasPmf(pmf, label)
{
	const new_pmf = pmf.Copy(label);
	for( const [x, p] of pmf.Items() ) new_pmf.Mult(x, x);
	new_pmf.Normalize();
	return new_pmf;
}

function UnbiasPmf(pmf, label)
{
	const new_pmf = pmf.Copy(label);
	for( const [x, p] of pmf.Items() ) new_pmf.Mult(x, 1/x);
	new_pmf.Normalize();
	return new_pmf;
}

(function() {

	const title = "3.4 The class size paradox";

	printTitle(title);

	const sizes = [ [5,9], [10,14], [15,19], [20,24], [25,29], [30,34], [35,39], [40,44], [45,49] ];
	const count = [     8,       8,      14,       4,       6,      12,       8,       3,      2  ];

	const actual_pmf = new Pmf(null, 'actual');
	sizes.forEach( ([a,b], i) => actual_pmf.Set( (b+a)/2, count[i]) );
	actual_pmf.Normalize();
	console.log("actual mean =", fixFloat(actual_pmf.Mean()) );

	const biased_pmf = BiasPmf(actual_pmf, 'observed');
	console.log("biased mean =", fixFloat(biased_pmf.Mean()) );

	var plotData = [];
	plotData.push(actual_pmf.ChartData({type:"spline"}));
	plotData.push(biased_pmf.ChartData({type:"spline"}));
	var axes = {
		x:{title:"class size"},
		y:{title:"PMF"}
	};
	var caption = "Figure 3.3: Distribution of class sizes, actual and as observed by students";
	renderPlot(caption, plotData, "chart_classes_", axes);

})();

"use strict";

// 10.2 Implementation


/////////////////////////////////////////////

function LeastSquares(xs, ys)
{
	const meanx = statistic.Mean(xs);
	const varx  = statistic.Variance(xs, meanx);
	const meany = statistic.Mean(ys);
	const slope = statistic.Cov(xs, ys, meanx, meany) / varx;
	const inter = meany - slope * meanx;
	return [inter, slope];
}

const [live, firsts, others] = liveFirstsOthers(nsfg_2002FemPreg, ['totalwgt_lb', 'agepreg'], true);
const ages = live.agepreg;
const weights = live.totalwgt_lb;


/////////////////////////////////////////////

(function() {

	const title = "10.2 Implementation";

	printTitle(title);

	/////////////////////////////////////////////

	const [inter, slope] = LeastSquares(ages, weights);

	console.log("inter, slope =", [inter, slope]);

	const scatter = new Cdf(ages, weights);
	const hl = graph.histLine("", slope, inter, {"xs":ages});

	var plotData = [];
	plotData.push(scatter.ChartData({type:"scatter", markerSize:3}));
	plotData.push(hl.ChartData({type:"line"}));
	var axes = {
		x:{title:'age (years)'},
		y:{title:"birth weight (lbs)"}
	};
	var caption = `Figure 10.1: Scatter plot of birth weight and mother’s age with a linear fit`;
	renderPlot(caption, plotData, `chart_1_`, axes);

})();

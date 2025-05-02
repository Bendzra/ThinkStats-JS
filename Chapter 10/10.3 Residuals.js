"use strict";

// 10.3 Residuals

function Residuals(xs, ys, inter, slope)
{
	const res = xs.map( (x, i) => ys[i] - (inter + slope * x) );
	return res;
}

(function() {

	const title = "10.3 Residuals";

	printTitle(title);

	/////////////////////////////////////////////


	const [inter, slope] = LeastSquares(ages, weights);

	// ages ranged (in bins):

	const low   = 15,
		  high  = 39,
		  step  = 3;

	const indices = digitizeIndices(ages, low, high, step);

	// grouping Residuals as to Age groups

	const df = {"ages": ages, "residuals": Residuals(ages, weights, inter, slope) };

	const groups = groupby(df, indices);

	for (const name in groups) {
		const count = groups[name].map( (arr) => arr.length );
		console.log(name, "bin counts:", count);
	}

	var grouped_ages = groups.ages.map( (xs) => statistic.Mean(xs) );
	var res_cdfs     = groups.residuals.map( (ys) => new Cdf(ys) );

	const percents = [75, 50, 25];
	var plotData = [];
	percents.forEach( (percent) => {
		const residuals = res_cdfs.map( (cdf) => cdf.Percentile(percent) );
		const label     = `${percent}th`;
		const cdf       = new Cdf(grouped_ages, residuals, label);
		plotData.push( cdf.ChartData({type:"line"}) );
	});

	var axes = {
		x:{title:'age (years)'},
		y:{title:"residual (lbs)", maximum:1.2}
	};
	var caption = `Figure 10.2: Residuals of the linear fit`;
	renderPlot(caption, plotData, "chart_2_", axes);

})();

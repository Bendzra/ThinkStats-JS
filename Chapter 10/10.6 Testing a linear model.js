"use strict";

// 10.6 Testing a linear model


/////////////////////////////////////////////

(function() {

	const title = "10.6 Testing a linear model";

	printTitle(title);

	/////////////////////////////////////////////


	class SlopeTest extends HypothesisTest
	{
		TestStatistic(data)
		{
			const [ages, weights] = data;
			const [_, slope] = LeastSquares(ages, weights);
			return slope;
		}

		MakeModel()
		{
			const [_, weights] = this.data;
			this.ybar = statistic.Mean(weights);
			this.res = weights.map( (w) => w - this.ybar, this);
		}

		RunModel()
		{
			const [ages, _] = this.data
			const res = shuffle( this.res.slice() );
			const weights = res.map( (r) => this.ybar + r, this);
			return [ages, weights];
		}
	}


	const ht = new SlopeTest( [ages, weights] );
	var pvalue = ht.PValue();

	console.log("pvalue =", pvalue.fixFloat(),
		"\nactual =", ht.actual.fixFloat(),
		"\nmax =", ht.MaxTestStat().fixFloat()
	);

	var plotData = ht.ChartData("null hypothesis");

	const [inters, slopes] = SamplingDistributions(live, 1001);

	const slope_cdf = new Cdf(slopes, null, "sampling distribution");
	var pvalue = slope_cdf.Prob(0)

	console.log("pvalue =", pvalue.fixFloat());

	plotData.push( slope_cdf.ChartData({type:"line"}, false) );

	addVericals(plotData, [{"0":0}]);

	var axes = {
		x:{title:'slope (lbs / year)'},
		y:{title:"CDF"}
	};
	var caption = `Figure 10.4: The sampling distribution of the estimated slope and the distribution of slopes generated under the null hypothesis. The vertical lines are at 0 and the observed slope, 0.017 lbs/year.`;
	renderPlot(caption, plotData, `chart_10_4_`, axes);


})();

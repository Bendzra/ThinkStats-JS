"use strict";

// 9.2 HypothesisTest


class HypothesisTest
{
	// Represents a hypothesis test

	constructor(data)
	{
		// data: data in whatever form is relevant

		this.data = data;
		this.MakeModel();
		this.actual = this.TestStatistic(data);
		this.test_stats = null;
		this.test_cdf = null;
	}

	PValue(iters=1000)
	{
		// Computes the distribution of the test statistic and p-value.

		// iters: number of iterations

		// returns: float p-value

		this.test_stats = Array.from({length: iters}, (_) => this.TestStatistic(this.RunModel()));
		this.test_cdf = new Cdf(this.test_stats);
		const a = this.actual;
		const count = this.test_stats.reduce( (sum, x) => {
			if ( x >= a ) sum++;
			return sum;
		}, 0);

		return count / iters;
	}

	MaxTestStat()
	{
		// Returns the largest test statistic seen during simulations

		const [min, max] = this.test_stats.minmax();

		return max;
	}

    ChartData(label="")
    {
        // Draws a Cdf with vertical lines at the observed test stat

		const plotData = [];
		this.test_cdf.label = label;
		plotData.push(this.test_cdf.ChartData({type:"line"}));
		addVericals( plotData, [{"actual": this.actual}] );
		return plotData;
    }

	TestStatistic(data)
	{
		// Computes the test statistic.

		// data: data in whatever form is relevant

		throw new UnimplementedMethodError();
	}

	MakeModel()
	{
		// Build a model of the null hypothesis

		// pass;

	}

	RunModel()
	{
		// Run the model of the null hypothesis.

		// returns: simulated data

		throw new UnimplementedMethodError();
	}

}

(function() {

	const title = "9.2 HypothesisTest";

	printTitle(title);


	/////////////////////////////////////////////


	class CoinTest extends HypothesisTest
	{
		constructor(data)
		{
			super(data);
		}

		TestStatistic(data)
		{
			const [heads, tails] = data;
			const test_stat = Math.abs(heads - tails);
			return test_stat;
		}

		RunModel()
		{
			const [heads, tails] = this.data;
			const n = heads + tails;

			const sample = Array.from({length:n}, (_) => (Math.random() < 0.5) ? 'H' : 'T');

			const hist = new Hist(sample);
			const data = [hist.Freq('H'), hist.Freq('T')];

			return data;
		}

	}

	const data = [140, 110];
	const ct = new CoinTest( data );
	const pvalue = ct.PValue(10*1000);

	console.log('[heads, tails]', data, '\npvalue =', pvalue);

})();

"use strict";

// 10.4 Estimation


/////////////////////////////////////////////

function SampleRows(df, nrows, replace=false)
{
	// Choose a sample of rows from a DataFrame

	const L = df[ Object.keys(df)[0] ].length;
	var indices = null;

	if(!replace) indices = shuffle( Array.from({length: L}, (_, i) => i), nrows );
	else indices = Array.from({length: nrows}, (_) => Math.floor(Math.random() * L) );

	const sample = {};
	for(const key in df)
	{
		sample[key] = [];
		indices.forEach( (i) => sample[key].push(df[key][i]) );
	}

	return sample;
}

function ResampleRows(df)
{
	// Resamples rows from a DataFrame

	return SampleRows(df, df[ Object.keys(df)[0] ].length, true)
}

function SamplingDistributions(live, iters=101)
{
	const inters = [],
		  slopes = [];

	while(iters-- > 0)
	{
		const sample = ResampleRows(live);
		const ages = sample.agepreg;
		const weights = sample.totalwgt_lb;
		const [inter, slope] = LeastSquares(ages, weights);

		inters.push(inter);
		slopes.push(slope);
	}

	return [inters, slopes];
}


/////////////////////////////////////////////

(function() {

	const title = "10.4 Estimation";

	printTitle(title);

	/////////////////////////////////////////////


	function Summarize(estimates, actual)
	{
		const [inters, slopes] = estimates;
		const [actual_inter, actual_slope] = actual;

		const mean   = [statistic.Mean(inters), statistic.Mean(slopes)];
		const stderr = [statistic.Std(inters, actual_inter), statistic.Std(slopes, actual_slope)];


		const cdfs = [new Cdf(inters), new Cdf(slopes)];
		const ci  =  [cdfs[0].CredibleInterval(90), cdfs[1].CredibleInterval(90)];

		console.log("\nmean =", mean, "\nSE =", stderr, "\nCI =", ci);
	}


	/////////////////////////////////////////////

	const estimates = SamplingDistributions(live); // [inters, slopes]
	const actual = LeastSquares(ages, weights);    // [actual_inter, actual_slope]

	Summarize(estimates, actual);


	/////////////////////////////////////////////

	function PercentileRow(array, p)
	{
		// Selects the row from a sorted array that maps to percentile p

		// p: float 0--100

		// returns: array (one row)

		const [rows, cols] = [array.length, array[0].length];
		const index = Math.round(rows * p / 100);

		return array[index];
	}


	function PercentileRows(ys_seq, percents)
	{
		// Given a collection of lines, selects percentiles along vertical axis

		// For example, if ys_seq contains simulation results like ys as a
		// function of time, and percents contains (5, 95), the result would
		// be a 90% CI for each vertical slice of the simulation results.

		// ys_seq: sequence of lines (y values)
		// percents: list of percentiles (0-100) to select

		// returns: list of arrays, one for each percentile

		const array = ys_seq.map( (ys) => ys);
		columnHoarSort(array);
		const rows = percents.map( (p) => PercentileRow(array, p));

		return rows;
	}

	function PlotConfidenceIntervals(xs, [inters, slopes])
	{
		const fys_seq = [];
		let hist = new Hist();
		inters.forEach(	 (inter, i) => {
			hist = graph.histLine("", slopes[i], inter, {"xs":xs});
			fys_seq.push([...hist.GetDict().values()]);
		});

		///

		const plot_xs = [...hist.Values()]; // = hist.d.keys()
		const plotData = [];

		///

		var percent = 90;
		var p = (100 - percent) / 2;
		var percents = [p, 100 - p];
		var [low, high] = PercentileRows(fys_seq, percents);

		hist.label = `${percent}%`;
		plot_xs.forEach( (x, i) => hist.Set(x, [low[i], high[i]]) );
		plotData.push( hist.ChartData({type:"rangeArea"}, false) );

		///

		var percent = 50;
		var p = (100 - percent) / 2;
		var percents = [p, 100 - p];
		var [low, high] = PercentileRows(fys_seq, percents);

		hist.label = `${percent}%`;
		plot_xs.forEach( (x, i) => hist.Set(x, [low[i], high[i]]) );
		plotData.push( hist.ChartData({type:"rangeArea"}, false) );

		return plotData;
	}


	const plotData = PlotConfidenceIntervals(ages, estimates);

	const axes = {
		x:{title:'age (years)'},
		y:{title:"birth weight (lbs)"}
	};
	const caption = `Figure 10.3: 50% and 90% confidence intervals showing variability in the fitted line due to sampling error of inter and slope.`;

	renderPlot(caption, plotData, `chart_10_3_`, axes);

})();

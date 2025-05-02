"use strict";

// 10.7 Weighted resampling


function ResampleRowsWeighted(df, column='finalwgt')
{
	const weights = df[column];

	const hist = new Hist();
	weights.forEach( (w, i) => hist.Set(i, w));
	const cdf = new Cdf(hist);
	const indices = cdf.Sample( weights.length );

	const sample = {};
	for(const key in df)
	{
		sample[key] = [];
		indices.forEach( (i) => sample[key].push(df[key][i]) );
	}

	return sample;
}


/////////////////////////////////////////////

(function() {

	const title = "10.7 Weighted resampling";

	printTitle(title);

	/////////////////////////////////////////////


	const db = nsfg_2002FemPreg;

	const subset = ['finalwgt', 'totalwgt_lb'];
	const LIVE_BIRTHS = ( (i) => db.outcome.data[i] === 1 );
	const df = dropna( db, subset, LIVE_BIRTHS );

	const iters = 101;

	var estimates = Array.from( {length: iters}, (_) => statistic.Mean(ResampleRows(df).totalwgt_lb) );
	var cdf = new Cdf(estimates);
	var ci = cdf.CredibleInterval(90);

	console.log("Unweighted:",
		"\n\tmean birth weight (lbs) =", statistic.Mean(estimates).fixFloat(),
		"\n\tstandard =", statistic.Std(estimates).fixFloat(),
		"\n\t90% CI =", [ci[0].fixFloat(), ci[1].fixFloat()]
	);

	var estimates = Array.from( {length: iters}, (_) => statistic.Mean(ResampleRowsWeighted(df).totalwgt_lb) );
	var cdf = new Cdf(estimates);
	var ci = cdf.CredibleInterval(90);

	console.log("Weighted:",
		"\n\tmean birth weight (lbs) =", statistic.Mean(estimates).fixFloat(),
		"\n\tstandard =", statistic.Std(estimates).fixFloat(),
		"\n\t90% CI =", [ci[0].fixFloat(), ci[1].fixFloat()]
	);

})();

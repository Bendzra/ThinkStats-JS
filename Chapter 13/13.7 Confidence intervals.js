"use strict";

// 13.7 Confidence intervals


(function() {

	const title = "13.7 Confidence intervals";

	printTitle(title);


	/////////////////////////////////////////////


	function ResampleSurvival(resp=woman, iters=101)
	{
		let [low, high] = resp.agemarry.minmax();

		const ts = spreadDots(null, 12 * (high - low) + 1, low, high );

		// console.log(resp.agemarry, [low, high], ts);

		const ss_seq = [];

		while(iters-- > 0)
		{
			// const sample = thinkstats2.ResampleRowsWeighted(resp)
			// hf, sf = EstimateSurvival(sample)
			// ss_seq.append(sf.Probs(ts))
		}

		// low, high = thinkstats2.PercentileRows(ss_seq, [5, 95])
		// thinkplot.FillBetween(ts, low, high)
	}


	ResampleSurvival();

})();

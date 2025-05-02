"use strict";

// 9.10 Power


(function() {

	const title = "9.10 Power";

	printTitle(title);


	/////////////////////////////////////////////

	function Resample(xs)
	{
		return xs.map( (_) => xs.at(Math.floor(xs.length * Math.random())) );
	}

	function FalseNegRate(data, num_runs=100)
	{
		const [group1, group2] = data;
		let count = 0;
		for(let i = 0; i < num_runs; i++)
		{
			const sample1 = Resample(group1);
			const sample2 = Resample(group2);

			const ht = new DiffMeansPermute([sample1, sample2]);
			const pvalue = ht.PValue(101);

			if (pvalue > 0.05) count += 1;
		}
		return count / num_runs;
	}

	/////////////////////////////////////////////

	const [live, firsts, others] = liveFirstsOthers();

	var data = [firsts.prglngth, others.prglngth];
	var neg_rate = FalseNegRate(data);

	console.log("neg_rate =", neg_rate);

})();

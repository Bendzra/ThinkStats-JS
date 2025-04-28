"use strict";

// 9.5 Testing a correlation



(function() {

	const title = "9.5 Testing a correlation";

	printTitle(title);


	/////////////////////////////////////////////

	class CorrelationPermute extends HypothesisTest
	{
		constructor(data) { super(data); }

		TestStatistic(data)
		{
			const [xs, ys] = data;
			const test_stat = Math.abs(statistic.Corr(xs, ys));
			return test_stat;
		}

		RunModel()
		{
			let [xs, ys] = this.data;
			xs = shuffle( xs.slice() );
			return [xs, ys];
		}
	}


	/////////////////////////////////////////////

	const db = nsfg_2002FemPreg;

	const LIVE_BIRTHS = ( (i) => db.outcome.data[i] === 1 );
	const subset = ['agepreg', 'totalwgt_lb'];
	const live = dropna( db, subset, LIVE_BIRTHS);


	/////////////////////////////////////////////

	const data = [live.agepreg, live.totalwgt_lb];
	const ht = new CorrelationPermute(data)
	const pvalue = ht.PValue();

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat()
	);


})();

"use strict";

// 9.7 Chi-squared tests


(function() {

	const title = "9.7 Chi-squared tests";

	printTitle(title);


	/////////////////////////////////////////////

	class DiceChiTest extends DiceTest
	{

		TestStatistic(data)
		{
			const observed = data;
			const n = observed.reduce( (sum, x) => sum += x, 0 );
			const expected = Array(6).fill(n / 6);
			const test_stat = observed.reduce( (sum, _, i) => sum += (observed[i] - expected[i])**2 / expected[i], 0);
			return test_stat
		}
	}


	const data = [8, 9, 19, 5, 8, 11];
	const ht = new DiceChiTest(data);
	const pvalue = ht.PValue();

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat()
	);


})();

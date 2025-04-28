"use strict";

// 9.6 Testing proportions


/////////////////////////////////////////////

class DiceTest extends HypothesisTest
{
	TestStatistic(data)
	{
		const observed = data;
		const n = observed.reduce( (sum, x) => sum += x, 0 );
		const expected = Array(6).fill(n / 6);

		const test_stat = observed.reduce( (sum, _, i) => sum += Math.abs(observed[i] - expected[i]), 0);
		return test_stat;
	}

	RunModel()
	{
		const n = this.data.reduce( (sum, x) => sum += x, 0 );
		const values = [1, 2, 3, 4, 5, 6];
		const rolls = Array.from( {length:n}, (_) => values[Math.floor(Math.random() * values.length)] );
		const hist = new Hist(rolls);
		const freqs = hist.Freqs(values);
		return freqs;
	}
}


(function() {

	const title = "9.6 Testing proportions";

	printTitle(title);


	/////////////////////////////////////////////

	const data = [8, 9, 19, 5, 8, 11];
	const ht = new DiceTest(data);
	const pvalue = ht.PValue();

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat()
	);


})();

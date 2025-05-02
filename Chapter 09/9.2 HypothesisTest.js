"use strict";

// 9.2 HypothesisTest


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

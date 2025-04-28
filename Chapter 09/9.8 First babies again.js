"use strict";

// 9.8 First babies again


(function() {

	const title = "9.8 First babies again";

	printTitle(title);


	/////////////////////////////////////////////

	class PregLengthTest extends HypothesisTest
	{
		MakeModel()
		{
			const [firsts, others] = this.data;
			this.n = firsts.length;
			this.pool = [...firsts, ...others];

			const pmf = new Pmf(this.pool);

			this.values = [35, 36, 37, 38, 39, 40, 41, 42, 43];
			this.expected_probs = pmf.Probs(this.values);
		}

		RunModel()
		{
			shuffle(this.pool);
			const data = [ this.pool.slice(0, this.n), this.pool.slice(this.n) ];
			return data;
		}

		TestStatistic(data)
		{
			const [firsts, others] = data;
			const stat = this.ChiSquared(firsts) + this.ChiSquared(others);
			return stat;
		}

		ChiSquared(lengths)
		{
			const hist = new Hist(lengths);
			const observed = hist.Freqs(this.values);
			const expected = this.expected_probs.map( (x) => x * lengths.length );
			const stat = observed.reduce( (sum, _, i) => sum += (observed[i] - expected[i])**2 / expected[i], 0);
			return stat;
		}

	}


	/////////////////////////////////////////////

	const db = nsfg_2002FemPreg;

	const LIVE_BIRTHS = ( (i) => db.outcome.data[i] === 1 );
	const subset = ['birthord', 'prglngth'];
	const df = dropna( db, subset, LIVE_BIRTHS, false );

	const firsts = {prglngth:[]};
	const others = {prglngth:[]};

	df.birthord.forEach( (o, i) => {
		const ord = ((o === 1) ? firsts : others);
		ord.prglngth.push( df.prglngth[i] );
	});


	/////////////////////////////////////////////

	var data = [firsts.prglngth, others.prglngth];
	var ht = new PregLengthTest( data );
	var pvalue = ht.PValue();

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat()
	);

})();

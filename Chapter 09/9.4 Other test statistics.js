"use strict";

// 9.4 Other test statistics



(function() {

	const title = "9.4 Other test statistics";

	printTitle(title);


	/////////////////////////////////////////////

	class DiffMeansOneSided extends DiffMeansPermute
	{
		TestStatistic(data)
		{
			const [group1, group2] = data;
			const test_stat = statistic.Mean(group1) - statistic.Mean(group2);
			return test_stat;
		}
	}


	/////////////////////////////////////////////

	class DiffStdPermute extends DiffMeansPermute
	{
		TestStatistic(data)
		{
			const [group1, group2] = data;
			const test_stat = statistic.Std(group1) - statistic.Std(group2);
			return test_stat;
		}
	}


	/////////////////////////////////////////////

	const db = nsfg_2002FemPreg;

	const LIVE_BIRTHS = ( (i) => db.outcome.data[i] === 1 );
	const subset = ['birthord', 'totalwgt_lb', 'prglngth'];
	const df = dropna( db, subset, LIVE_BIRTHS, false );

	const firsts = {totalwgt_lb:[],prglngth:[]};
	const others = {totalwgt_lb:[],prglngth:[]};

	df.birthord.forEach( (o, i) => {
		const ord = ((o === 1) ? firsts : others);
		ord.totalwgt_lb.push( df.totalwgt_lb[i] );
		ord.prglngth.push( df.prglngth[i] );
	});


	/////////////////////////////////////////////

	/// DiffMeansOneSided

	console.log("**\nprglngth DiffMeansOneSided:");

	var data = [firsts.prglngth, others.prglngth];
	var ht = new DiffMeansOneSided( data );
	var pvalue = ht.PValue();

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat(),
		"\nn =", ht.n, ", m =", ht.m
	);


	/// DiffStdPermute

	console.log("**\nprglngth DiffStdPermute (one-sided):");

	var data = [firsts.prglngth, others.prglngth];
	var ht = new DiffStdPermute( data );
	var pvalue = ht.PValue();

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat(),
		"\nn =", ht.n, ", m =", ht.m
	);

})();

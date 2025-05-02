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

	const [live, firsts, others] = liveFirstsOthers();


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

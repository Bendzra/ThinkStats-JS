"use strict";

// 9.3 Testing a difference in means


///////////////////////////////////////////////////////////////////////////////


class DiffMeansPermute extends HypothesisTest
{
	constructor(data)
	{
		super(data);
	}

	TestStatistic(data)
	{
		const [group1, group2] = data;
		const test_stat = Math.abs( statistic.Mean(group1) - statistic.Mean(group2) );
		return test_stat;
	}

	MakeModel()
	{
		const [group1, group2] = this.data;
		[this.n, this.m] = [group1.length, group2.length];
		this.pool = [...group1, ...group2];
	}

	RunModel()
	{
		shuffle(this.pool);
		const data = [this.pool.slice(0, this.n), this.pool.slice(this.n)];
		return data;
	}
}


(function() {

	const title = "9.3 Testing a difference in means";

	printTitle(title);


	/////////////////////////////////////////////

	const db = nsfg_2002FemPreg;

	const LIVE_BIRTHS = ( (i) => db.outcome.data[i] === 1 );
	const subset = ['birthord', 'totalwgt_lb', 'prglngth'];
	const df = dropna( db, subset, LIVE_BIRTHS , false);

	const firsts = {totalwgt_lb:[],prglngth:[]};
	const others = {totalwgt_lb:[],prglngth:[]};

	df.birthord.forEach( (o, i) => {
		const ord = ((o === 1) ? firsts : others);
		ord.totalwgt_lb.push( df.totalwgt_lb[i] );
		ord.prglngth.push( df.prglngth[i] );
	});

	console.log("\nfirsts.length =", firsts.totalwgt_lb.length, "others.length =", others.totalwgt_lb.length);

	/////////////////////////////////////////////

	console.log("**\ntotalwgt DiffMeansPermute (two-sided):");

	var data = [firsts.totalwgt_lb.filter((v) => !isNaN(v)), others.totalwgt_lb.filter((v) => !isNaN(v))];

	var ht = new DiffMeansPermute( data );
	var pvalue = ht.PValue();

	var plotData = ht.ChartData();
	var axes = {
		x:{title:'difference in means (pounds)'},
		y:{title:"CDF"}
	};
	var caption = `CDF of difference in mean birth weight under the null hypothesis`;
	renderPlot(caption, plotData, `chart_01_`, axes);

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat(),
		"\nn =", ht.n, ", m =", ht.m
	);


	/////////////////////////////////////////////

	console.log("**\nprglngth DiffMeansPermute (two-sided):");

	var data = [firsts.prglngth.filter((v) => !isNaN(v)), others.prglngth.filter((v) => !isNaN(v))];

	var ht = new DiffMeansPermute( data );
	var pvalue = ht.PValue();

	var plotData = ht.ChartData();
	var axes = {
		x:{title:'difference in means (weeks)'},
		y:{title:"CDF"}
	};
	var caption = `CDF of difference in mean pregnancy length under the null hypothesis`;
	renderPlot(caption, plotData, `chart_02_`, axes);

	console.log("pvalue =", pvalue,
		"\nactual =", ht.actual,
		"\nmax =", ht.MaxTestStat(),
		"\nn =", ht.n, ", m =", ht.m
	);


})();

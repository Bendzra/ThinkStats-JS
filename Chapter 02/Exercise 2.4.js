"use strict";

//////////////////////
// Exercise 2.4*
//
// Altered: Using respondent "totincr" vs pregnancy "totalwgt_lb",
//          and vs pregnancy "prglngth", investigate whether rich
//          babies are lighter or heavier than others.
//
// How does it compare to the difference in pregnancy length?
//
// Compute Cohen’s d to quantify the difference between the groups.

(function() {

	const title = "Exercise 2.4* (altered)";

	printTitle(title);

	const preg = nsfg_2002FemPreg;
	const resp = nsfg_2002FemResp;

	function DataShot(name)
	{
		this.name = name;

		this.caseid      = []; // resondent id
		this.index       = []; // pregnancy record index
		this.totincr     = []; // resp total income
		this.totalwgt_lb = []; // baby total weight
		this.prglngth    = []; // pregnancy length

		this.update = function(caseid, index, totincr, totalwgt_lb, prglngth) {
			this.caseid.push(caseid);
			this.index.push(index);
			this.totincr.push(totincr);
			this.totalwgt_lb.push(totalwgt_lb);
			this.prglngth.push(prglngth);
		};

	 	this.stats = function(prop) {
			const m   = mean(this[prop]);
			const v   = variance(m, this[prop]);
			const std = Math.sqrt(v);
			console.log(`${this.name}.${prop}:\n\tmean=${m.toFixed(4)}\r\n\tvariance=${v.toFixed(4)}\r\n\tstd=${std.toFixed(4)}`);
			return [m, v, std];
		};
	}

	var live   = new DataShot("live");
	var rich   = new DataShot("rich");
	var others = new DataShot("others");

	// cim - maps a respondent (caseid) to pregnancy records (indices)
	const cim = MakePregMap(preg);

	resp.caseid.data.forEach( (caseid, r) => {
		if(caseid in cim)
		{
			var totincr = resp.totincr.data[r];
			cim[caseid].forEach( (index) => {

				if(preg.outcome.data[index] === 1)
				{
					var totalwgt_lb = preg.totalwgt_lb.data[index];
					var prglngth    = preg.prglngth.data[index];

					live.update(caseid, index, totincr, totalwgt_lb, prglngth);
					if (totincr === 14) rich.update(caseid, index, totincr, totalwgt_lb, prglngth);
					else others.update(caseid, index, totincr, totalwgt_lb, prglngth);
				}
			});
		}
	});

	/////////////////////////

	var hist     = new Hist(live.totalwgt_lb, 'live');
	var plotData = [hist.ChartData({type:"column"})];
	var axes     = { x:{title:"lbs"}, y:{title:"frequency"} };
	renderPlot("Histogram of the totalwgt_lb", plotData, "chart_live_totalwgt_lb_", axes);

	var hist     = new Hist(rich.totalwgt_lb, 'live rich');
	var plotData = [hist.ChartData({type:"column"})];
	renderPlot("Histogram of the totalwgt_lb", plotData, "chart_rich_totalwgt_lb_", axes);

	var hist     = new Hist(others.totalwgt_lb, 'live others');
	var plotData = [hist.ChartData({type:"column"})];
	renderPlot("Histogram of the totalwgt_lb", plotData, "chart_others_totalwgt_lb_", axes);

	/////////////////////////

	var [m0, v0, std0] = live.stats("totalwgt_lb");
	var [m1, v1, std1] = rich.stats("totalwgt_lb");
	var [m2, v2, std2] = others.stats("totalwgt_lb");

	console.log(`(m1-m2)/m = ${(100*(m1-m2)/m0).toFixed(4)} %`);

	var d = CohenEffectSize(rich.totalwgt_lb, others.totalwgt_lb);
	console.log(`CohenEffectSize = ${d.toFixed(4)}`);

	/////////////////////////

	var hist     = new Hist(live.prglngth, 'live');
	var plotData = [hist.ChartData({type:"column"})];
	var axes     = { x:{title:"weeks", minimum:27, maximum:46}, y:{title:"frequency"} };
	renderPlot("Histogram of the prglngth", plotData, "chart_live_prglngth_", axes);

	var hist     = new Hist(rich.prglngth, 'live rich');
	var plotData = [hist.ChartData({type:"column"})];
	renderPlot("Histogram of the prglngth", plotData, "chart_rich_prglngth_", axes);

	var hist     = new Hist(others.prglngth, 'live others');
	var plotData = [hist.ChartData({type:"column"})];
	renderPlot("Histogram of the prglngth", plotData, "chart_others_prglngth_", axes);

	/////////////////////////

	var [m0, v0, std0] = live.stats("prglngth");
	var [m1, v1, std1] = rich.stats("prglngth");
	var [m2, v2, std2] = others.stats("prglngth");

	console.log(`(m1-m2)/m = ${(100*(m1-m2)/m0).toFixed(4)} %`);

	var d = CohenEffectSize(rich.prglngth, others.prglngth);
	console.log(`CohenEffectSize = ${d.toFixed(4)}`);


})();


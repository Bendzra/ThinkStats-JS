"use strict";

// 2.4 NSFG variables

(function() {

	const title = "2.4 NSFG variables";

	printTitle(title);

	const df = nsfg_2002FemPreg;

	var hist = new Hist(df.caseid.data, "caseid");
	var plotData = [ hist.ChartData({type:"column"}) ];
	renderPlot( "Histogram of respondent cases", plotData, "chart_caseid_", {x:{title:"respondent ID"},y:{title:"frequencies"}} );

	var hist = new Hist(df.totalwgt_lb.data, "totalwgt_lb");
	var plotData = [ hist.ChartData({type:"column"}) ];
	renderPlot( "Histogram of birth total weight", plotData, "chart_totalwgt_lb_", {x:{title:"pounds"},y:{title:"frequencies"}} );

	{
		var hist = new Hist(df.birthwgt_lb.data, "birthwgt_lb");
		var plotData = [ hist.ChartData({type:"column"}) ];
		renderPlot( "Figure 2.1: Histogram of the pound part of birth weight", plotData, "chart_birthwgt_lb_", {x:{title:"pounds"},y:{title:"frequencies"}} );

		var hist = new Hist(df.birthwgt_oz.data, "birthwgt_oz");
		var plotData = [ hist.ChartData({type:"column"}) ];
		renderPlot( "Figure 2.2: Histogram of the ounce part of birth weight", plotData, "chart_birthwgt_oz_", {x:{title:"ounces"},y:{title:"frequencies"}} );

		var hist = new Hist(df.agepreg.data, "agepreg");
		var plotData = [ hist.ChartData({type:"column"}) ];
		renderPlot( "Figure 2.3: Histogram of mother’s age at end of pregnancy", plotData, "chart_agepreg_", {x:{title:"years"},y:{title:"frequencies"}} );

		var hist = new Hist(df.prglngth.data, "prglngth");
		var plotData = [ hist.ChartData({type:"column"}) ];
		renderPlot( "Figure 2.4: Histogram of pregnancy length in weeks", plotData, "chart_prglngth_", {x:{title:"weeks"},y:{title:"frequencies"}} );
	}

	var hist = new Hist(df.pregordr.data, "pregordr");
	var plotData = [ hist.ChartData({type:"column"}) ];
	renderPlot( "Histogram of pregnancy order (number)", plotData, "chart_pregordr_", {x:{title:"number"},y:{title:"frequencies"}} );

	var hist = new Hist(df.outcome.data, "outcome");
	var plotData = [ hist.ChartData({type:"column"}) ];
	renderPlot( "Histogram of pregnancy outcome", plotData, "chart_outcome_", {x:{title:"recode"},y:{title:"frequencies"}} );

	var hist = new Hist(df.birthord.data, "birthord");
	var plotData = [ hist.ChartData({type:"column"}) ];
	renderPlot( "Histogram of birth order", plotData, "chart_birthord_", {x:{title:"recode"},y:{title:"frequencies"}} );

	var hist = new Hist(df.finalwgt.data, "finalwgt");
	var plotData = [ hist.ChartData({type:"column"}) ];

	// hist.Print();
	// console.log(plotData[0].dataPoints);

	renderPlot( "Histogram of final post-stratified and adjusted weight", plotData, "chart_finalwgt_", {x:{title:"finalwgt"},y:{title:"frequencies"}} );

})();

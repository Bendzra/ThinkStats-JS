"use strict";

// 6.8 Skewness

(function() {

	const title = "6.8 Skewness";

	printTitle(title);


	/// NSFG

	var df = nsfg_2002FemPreg;

	const live   = {totalwgt_lb:[]};
	const firsts = {totalwgt_lb:[]};
	const others = {totalwgt_lb:[]};

	df.totalwgt_lb.data.forEach( (pounds, i) => {
		if(df.outcome.data[i] === 1)
		{
			live.totalwgt_lb.push(pounds);
			if (df.birthord.data[i] === 1) firsts.totalwgt_lb.push(pounds);
			else others.totalwgt_lb.push(pounds);
		}
	});

	var data = live.totalwgt_lb.filter( (x) => !isNaN(x) );
	var pdf = new EstimatedPdf(data, 'birth weight');

	var plotData = [];
	plotData.push(pdf.ChartData({type:"line"}));

	var mean     = statistic.RawMoment(data, 1);
	var median   = statistic.Median(data);
	var skewness = statistic.Skewness(data);
	var pms      = statistic.PearsonMedianSkewness(data);

	console.log("NSFG:",
		"\r\n\tmean =", mean.fixFloat(3),
		"\r\n\tmedian =", median.fixFloat(3),
		"\r\n\tsample skewness =", skewness.fixFloat(3),
		"\r\n\tPearson’s median skewness =", pms.fixFloat(3));

	plotData = addVericals(plotData, [{"mean":mean}, {"median":median}]);

	var axes = {
		x:{title:`lbs`},
		y:{title:"PDF"}
	};
	var caption = `Figure 6.3: Estimated PDF of birthweight data from the NSFG`;
	renderPlot(caption, plotData, "chart_nsfg_", axes);


	/// BRFSS

	var df = cdc_brfss2008;

	var data = df.wtkg2.data.filter( (x) => !isNaN(x) );
	var pdf = new EstimatedPdf(data, 'adult weight');

	var plotData = [];
	plotData.push(pdf.ChartData({type:"line"}));

	var mean     = statistic.RawMoment(data, 1);
	var median   = statistic.Median(data);
	var skewness = statistic.Skewness(data);
	var pms      = statistic.PearsonMedianSkewness(data);

	console.log("BRFSS:",
		"\r\n\tmean =", mean.fixFloat(3),
		"\r\n\tmedian =", median.fixFloat(3),
		"\r\n\tsample skewness =", skewness.fixFloat(3),
		"\r\n\tPearson’s median skewness =", pms.fixFloat(3));

	plotData = addVericals(plotData, [{"mean":mean}, {"median":median}]);

	var axes = {
		x:{title:`kg`},
		y:{title:"PDF"}
	};
	var caption = `Figure 6.4: Estimated PDF of adult weight data from the BRFSS`;
	renderPlot(caption, plotData, "chart_brfss_", axes);


})();



"use strict";

// 5.8 Exercises

(function() {

	const title = "5.8 Exercises";

	printTitle(title);

})();

(function() {

	const subtitle = "Exercise 5.1: Blue Man Group";

	printTitle(subtitle);

	const df = cdc_brfss2008;

	const men   = {heights:[]};
	const women = {heights:[]};

	const heights = [];
	df.htm3.data.forEach( (cm, i) => {

		if(isNaN(cm)) return;

		if(df.sex.data[i] === 1) men.heights.push(cm);
		else women.heights.push(cm);
	} );

	men.heights.sort( (a, b) => a - b );
	women.heights.sort( (a, b) => a - b );

	var plotData = [];

	var cdf = new Cdf(women.heights, null, "women.heights");
	plotData.push(cdf.ChartData({type:"line"}));

	var min = cdf.xs[0];
	var max = cdf.xs[cdf.xs.length-1];
	var mu  = cdf.Mean();
	var std = cdf.Std(mu);
	console.log("women.heights",
		"\r\n\tmean =", mu.fixFloat(2),
		"\r\n\tstd =", std.fixFloat(2),
		"\r\n\tmin =", min,
		"\r\n\tmax =", max );

	var cdf = new Cdf(men.heights, null, "men.heights");
	plotData.push(cdf.ChartData({type:"line"}));

	var min = cdf.xs[0];
	var max = cdf.xs[cdf.xs.length-1];
	var mu  = cdf.Mean();
	var std = cdf.Std(mu);
	console.log("men.heights",
		"\r\n\tmean =", mu.fixFloat(2),
		"\r\n\tstd =", std.fixFloat(2),
		"\r\n\tmin =", min,
		"\r\n\tmax =", max );

	// In order to join Blue Man Group, you have to be male between 5’10” and 6’1”:

	var l = 5 * 30.48 + 10 * 2.54;
	var h = 6 * 30.48 +  1 * 2.54;

	console.log("data:")
	console.log("\tProb( ≤", h, ") =", (cdf.Prob(h)*100).fixFloat(2), "%" );
	console.log("\tProb( ≤", l, ") =", (cdf.Prob(l)*100).fixFloat(2), "%" );
	console.log("\tΔP =",  ((cdf.Prob(h) - cdf.Prob(l)) * 100).fixFloat(2), "%" );

	var cdf = gauss.cdfFromRange("model (men)", [mu, std], {nDots:men.heights.length, low:men.heights[0], high:men.heights[men.heights.length-1]});
	plotData.push(cdf.ChartData({type:"line"}));

	console.log("model:")
	console.log("\tProb( ≤", h, ") =", (cdf.Prob(h)*100).fixFloat(2), "%" );
	console.log("\tProb( ≤", l, ") =", (cdf.Prob(l)*100).fixFloat(2), "%" );
	console.log("\tΔP =",  ((cdf.Prob(h) - cdf.Prob(l)) * 100).fixFloat(2), "%" );

	var axes = {
		x:{title:`height`},
		y:{title:"CDF"}
	};
	renderPlot(subtitle, plotData, "chart_5_1_", axes);

})();

(function() {

	const subtitle = "Exercise 5.2: Pareto human height";

	printTitle(subtitle);


	const xmin  = 1; //meter
	const alpha = 1.7;

	var mean   = pareto.Mean([xmin, alpha]);
	var median = pareto.Median([xmin, alpha]);
	var mRank  = pareto.evalCdf(mean, [xmin, alpha]) * 100;

	console.log("Formula:",
		"\r\n\tmean =", mean.fixFloat(2),
		"\r\n\tmedian =", median.fixFloat(2),
		"\r\n\trank(mean) =", mRank.fixFloat(2), "%");

	var plotData = [];
	var cdf = pareto.cdfFromRange("pareto", [xmin, alpha], {nDots:200000, low:xmin, high:1000*xmin});
	plotData.push(cdf.ChartData({type:"line"}));
	var axes = {
		x:{title:`height`, maximum:20},
		y:{title:"CDF"}
	};
	renderPlot(subtitle, plotData, "chart_5_2_", axes);

	var mean   = cdf.Mean();
	var median = cdf.Median();
	var mRank  = cdf.PercentileRank(mean);
	console.log("CDF:",
		"\r\n\tmean =", mean.fixFloat(2),
		"\r\n\tmedian =", median.fixFloat(2),
		"\r\n\trank(mean) =", mRank.fixFloat(2), "%");

	var p1km= pareto.evalCdf(1*1000, [xmin, alpha]);
	console.log("p(≤ 1 km) =", p1km);

	const N = 7*1000*1000*1000; // population
	console.log("Taller than 1 km =", (N*(1-p1km)).fixFloat(0), "/", N );

})();

(function() {

	const subtitle = "Exercise 5.3: Weibull distribution";

	printTitle(subtitle);

	// ...[λ, k]...
	const λks = [ [2, 0.5], [2, 1], [2, 2], [2, 5] ];

	var pmfPlotData  = [];
	var cdfPlotData  = [];
	var qqPlotData   = [];
	var linPlotData  = [];

	var N    = 1000;  // generated sample length;
	var high = 40;
	var low  = 0.025;
	var xs   = spreadDots(null, 100*N, low, high);

	λks.forEach( ([λ,k]) => {

		var sample = [];
		for(var i = 0; i < N; i++)
		{
			var x = weibull.Variate([λ,k]);
			if(x > 0.02) sample.push(x);
		}
		sample.sort( (a,b) => a-b );

		var pmf = weibull.pmfFromRange( `λ=${λ}, k=${k}`, [λ,k], {"xs":sample});
		pmfPlotData.push(pmf.ChartData({type:"line"}));

		var cdf = weibull.cdfFromRange( `λ=${λ}, k=${k}`, [λ,k], {"xs":sample});
		cdfPlotData.push(cdf.ChartData({type:"line"}));

		var hist = weibull.distProbPlot(sample, [λ,k], `λ=${λ}, k=${k}`, {"xs":xs}, 1)
		qqPlotData.push(hist.ChartData({type:"scatter"}));

		// CDF(x) = 1 - exp( -pow(x/λ, k) ); => ln(-ln(1-CDF(x))) = k * ln(x) - k * ln(λ)

		var hist = new Hist(null, `log-log: λ=${λ}, k=${k}`);
		cdf.Items().forEach( ([x, p]) => {
			var y = Math.log(-Math.log(1-p));
			hist.Set(Math.log(x), y);
		});
		linPlotData.push(hist.ChartData({type:"scatter"}));

		var hist = graph.histLine(`model: λ=${λ}, k=${k}`, k, -k*Math.log(λ), {"xs":xs});
		linPlotData.push(hist.ChartData({type:"line"}));

	});


	var axes = {
		x:{title:`x`, minimum:0, maximum:(high>5)?5:high},
		y:{title:"PMF"}
	};
	renderPlot("Probability density function (Weibull)", pmfPlotData, "chart_pmf_5_3_", axes);

	var axes = {
		x:{title:`x`, minimum:0, maximum:(high>5)?5:high},
		y:{title:"CDF"}
	};
	renderPlot("Cumulative distribution function (Weibull)", cdfPlotData, "chart_cdf_5_3_", axes);

	var axes = {
		x:{title:`reconstructed quantiles`, minimum:0, maximum:(high>10)?10:high},
		y:{title:"data quantiles"}
	};
	renderPlot("Weibull plot", qqPlotData, "chart_QQ_5_3_", axes);

	var axes = {
		x:{title:`ln(x)`, minimum:0, maximum:5},
		y:{title:"ln ( -ln ( 1 - CDF(x) ) )"}
	};
	renderPlot("Weibull straight line", linPlotData, "chart_line_5_3_", axes);

})();


(function() {

	const subtitle = "Exercise 5.4: Exponential births";

	printTitle(subtitle);

	const db = babyboom;

	const diffs = [];
	for(var i = 1, m = db.minutes.data[0]; i < db.minutes.data.length; i++)
	{
		diffs.push(db.minutes.data[i] - m);
		m = db.minutes.data[i];
	}
	diffs.sort( (a,b) => a-b );

	var plotData = [];

	var cdf_diffs = new Cdf(diffs, null, 'actual');

	plotData.push(cdf_diffs.ChartData({type:"line"}));

	const mean = cdf_diffs.Mean();
	const λ    = 1 / mean;

	console.log( "mean =", mean.fixFloat(3), ", λ =", λ.fixFloat(4) );

	var l = diffs.length * 5;
	var xs = spreadDots(diffs, l, 0);

	var sample = [];
	while(l > 0)
	{
		var x = exponential.Variate(λ);
		if(x > 0.02)
		{
			sample.push(x);
			l--;
		}
	}
	sample.sort( (a,b) => a-b );

	var cdf_sample = exponential.cdfFromRange( `model`, λ, {"xs":sample});
	plotData.push(cdf_sample.ChartData({type:"line"}));

	var axes = {
		x:{title:"minutes"},
		y:{title:"CDF"}
	};
	var caption = "Interval times";
	renderPlot(caption, plotData, "chart_births_", axes);

	///

	var plotData = [];

	var hist = exponential.distProbPlot(diffs, λ, "actual", {"xs":xs}, 3);
	plotData.push(hist.ChartData({type:"scatter"}));

	var hist = exponential.distProbPlot(sample, λ, "model", {"xs":xs}, 3);
	plotData.push(hist.ChartData({type:"scatter"}));

	var axes = {
		x:{title:"minutes (analitic)"},
		y:{title:"minutes (data)"}
	};
	var caption = "Exponential Probability Plots";
	renderPlot(caption, plotData, "chart_epp_", axes);


	// CDF(x) = 1 - exp(-λ*x) => ln( CCDF(x) ) = -λ*x;

	var plotData = [];

	var hist = new Hist(null, 'actual');
	cdf_diffs.Items().forEach( ([x,p]) => {
		if( p >= 1) return;
		hist.Set(x, Math.log(1-p));
	});
	plotData.push(hist.ChartData({type:"scatter"}));

	var hist = new Hist(null, 'model');
	cdf_sample.Items().forEach( ([x,p]) => {
		if( p >= 1) return;
		hist.Set(x, Math.log(1-p));
	});
	plotData.push(hist.ChartData({type:"scatter"}));

	var xs = cdf_sample.xs;
	var hist = graph.histLine(`λ=${λ.toFixed(4)}`, -λ, 0, {"xs":xs});
	plotData.push(hist.ChartData({type:"line"}));

	var axes = {
		x:{title:"x"},
		y:{title:"ln ( CCDF(x) )"}
	};
	var caption = "Exponential straight";
	renderPlot(caption, plotData, "chart_straight_", axes);

})();


(function() {

	const subtitle = "Exercise 5.5: Mystery";

	printTitle(subtitle);

	const db = mystery;

	for(var n in db) db[n].data.sort( (a,b) => a-b );

	const analitics = [uniform, triangular, exponential, gauss, pareto, weibull, "lognormal", gumbel];

	for(var n in db)
	{
		var sorted = db[n].data;

		///

		var plotData = [];

		var cdf = new Cdf(sorted, null, `mystery${n}`);
		plotData.push(cdf.ChartData({type:"scatter"}));

		var axes = {
			x:{title:"x"},
			y:{title:"CDF(x)"}
		};

		var caption = `mystery${n} CDF`;
		renderPlot(caption, plotData, `chart_cdf_mystery${n}_`, axes);

		// straighten:

		analitics.forEach( (clss) =>
		{
			var name = (clss=='lognormal') ? 'lognormal' : clss.prototype.constructor.name;

			if(n == 0 && (false           || name=='triangular' || name=='exponential' || name=='gauss' || name=='lognormal' || name=='pareto' || name=='weibull' || name=='gumbel')) return; // uniform
			if(n == 1 && (name=='uniform' || false              || name=='exponential' || name=='gauss' || name=='lognormal' || name=='pareto' || name=='weibull' || name=='gumbel')) return; // triangular
			if(n == 2 && (name=='uniform' || name=='triangular' || false               || name=='gauss' || name=='lognormal' || name=='pareto' || false           || name=='gumbel')) return; // exponential (weibull)
			if(n == 3 && (name=='uniform' || name=='triangular' || name=='exponential' || false         || name=='lognormal' || name=='pareto' || name=='weibull' || name=='gumbel')) return; // gauss
			if(n == 4 && (name=='uniform' || name=='triangular' || name=='exponential' || name=='gauss' || false             || name=='pareto' || name=='weibull' || name=='gumbel')) return; // lognormal
			if(n == 5 && (name=='uniform' || name=='triangular' || name=='exponential' || name=='gauss' || name=='lognormal' || false          || name=='weibull' || name=='gumbel')) return; // pareto
			if(n == 6 && (name=='uniform' || name=='triangular' || name=='exponential' || false         || name=='lognormal' || name=='pareto' || false           || name=='gumbel')) return; // weibull (gauss)
			if(n == 7 && (name=='uniform' || name=='triangular' || name=='exponential' || name=='gauss' || false             || name=='pareto' || name=='weibull' || false         )) return; // gumbel (lognormal)

			var axes = {
				x:{title:`(x)`},
				y:{title:`(y)`}
			};

			if (name == 'lognormal')
			{
				clss = gauss;
				axes = {
					x:{title:`(x)`, logarithmic: true},
					y:{title:`(y)`}
				};
			}

			var caption = `mystery${n} (${name})`;
			var hist = new Hist(null, caption);

			cdf.Items().forEach( ([x,p]) => {

				var [xl, yl] = clss.straightenCdf(x, p);

				if( isNaN(xl) || isNaN(yl) ) return;

				if(yl === Infinity) return;
				if(yl === -Infinity) return;

				// if (n == 1 && name == "exponential") console.log(xl, yl);


				hist.Set(xl, yl);

			});
			var plotData = [hist.ChartData({type:"line"})];

			renderPlot(caption, plotData, `chart_mystery${n}_${name}_`, axes);
		});

	}


})();


(function() {

	const subtitle = "Exercise 5.6: Income";

	printTitle(subtitle);

	const from_hinc06 = {
		income: ["Under $5000","$5000 to  $9999","$10000 to $14999","$15000 to $19999","$20000 to $24999","$25000 to $29999","$30000 to $34999","$35000 to $39999","$40000 to $44999","$45000 to $49999","$50000 to $54999","$55000 to $59999","$60000 to $64999","$65000 to $69999","$70000 to $74999","$75000 to $79999","$80000 to $84999","$85000 to $89999","$90000 to $94999","$95000 to $99999","$100000 to $104999","$105000 to $109999","$110000 to $114999","$115000 to $119999","$120000 to $124999","$125000 to $129999","$130000 to $134999","$135000 to $139999","$140000 to $144999","$145000 to $149999","$150000 to $154999","$155000 to $159999","$160000 to $164999","$165000 to $169999","$170000 to $174999","$175000 to $179999","$180000 to $184999","$185000 to $189999","$190000 to $194999","$195000 to $199999","$200000 to $249999","$250000 and over"],
		number: [4204,4729,6982,7157,7131,674,6354,5832,5547,5254,5102,4256,4356,3949,3756,3414,3326,2643,2678,2223,2606,1838,1986,1464,1596,1327,1253,114,1119,920,1143,805,731,575,616,570,502,364,432,378,2549,2911]
	}

	const db = {low:[], high:[], freq:[]};

	const re = /^\s*(\S+)\b.*\s+(\S+)\s*/;

	var hist = new Hist();

	from_hinc06.income.forEach( (label, i) => {

		const arr = re.exec(label);
		if(arr === null) return;
		arr[1] = (arr[1] == 'Under') ? 1 * 1000       : parseInt( arr[1].substr(1) );
		arr[2] = (arr[2] == 'over' ) ? 1 * 1000000000 : parseInt( arr[2].substr(1) );

		db.low .push(arr[1]);
		db.high.push(arr[2]);
		db.freq.push(from_hinc06.number[i]);

		hist.Set(db.low[db.low.length-1], db.freq[db.freq.length-1]);

	});

	// console.log(JSON.stringify(db, null, 1));

	var plotData = [];

	// data

	var cdf = new Cdf(hist, null, 'data cdf');
	plotData.push(cdf.ChartData({type:"line"}));

	var mean   = cdf.Mean();
	var std    = cdf.Std(mean);
	var median = cdf.Median();
	var iqr    = cdf.IQR();
	var iqr_std= iqr / 1.349;

	console.log("income",
		"\r\n\tcdf.median =", median.fixFloat(2),
		"\r\n\tcdf.mean =",   mean.fixFloat(2),
		"\r\n\tcdf.iqr =",    iqr.fixFloat(2),
		"\r\n\tstd(iqr) =",   iqr_std.fixFloat(2),
		"\r\n\tcdf.std =",    std.fixFloat(2)
	);

	// var [µ, σ] = [median, iqr_std];
	// var cdf_norm = gauss.cdfFromRange(`normal [µ=${µ.toFixed(2)}, σ=${σ.toFixed(2)}]`, [µ, σ], {"xs":cdf.xs});
	// plotData.push(cdf_norm.ChartData({type:"line"}));


	// pareto

	var xmin = 55000;
	var α    = 2.4;

	var cdf_pareto = pareto.cdfFromRange(`pareto [xmin=${xmin.toFixed(2)}, α=${α.toFixed(2)}]`, [xmin, α], {"xs":cdf.xs});
	plotData.push(cdf_pareto.ChartData({type:"line"}));

	var axes = {
		x:{title:`($)`},
		y:{title:`CDF`}
	};
	var caption = "household income CDF";
	renderPlot(caption, plotData, `chart_5_6_cdf_`, axes);


	// data and lognormal

	var plotData = [];

	var cdf_log = new Cdf( cdf.xs.map((x)=>Math.log10(x)), cdf.ps, 'data (log10)' );
	plotData.push(cdf_log.ChartData({type:"line"}));

	var mean   = cdf_log.Mean();
	var std    = cdf_log.Std(mean);
	var median = cdf_log.Median();
	var iqr    = cdf_log.IQR();
	var iqr_std= iqr / 1.349;

	console.log("log10(income)",
		"\r\n\tlog_cdf.median =", median.fixFloat(2),
		"\r\n\tlog_cdf.mean =",   mean.fixFloat(2),
		"\r\n\tlog_cdf.iqr =",    iqr.fixFloat(2),
		"\r\n\tstd(iqr) =",   iqr_std.fixFloat(2),
		"\r\n\tlog_cdf.std =",    std.fixFloat(2)
	);

	var [µ, σ] = [median, iqr_std];

	var cdf_lognorm = gauss.cdfFromRange(`lognormal [µ=${µ.toFixed(2)}, σ=${σ.toFixed(2)}]`, [µ, σ], {"xs":cdf_log.xs});
	plotData.push(cdf_lognorm.ChartData({type:"line"}));
	var axes = {
		x:{title:`log10($)`},
		y:{title:`CDF`}
	};
	var caption = "household income log-x CDF";
	renderPlot(caption, plotData, `chart_5_6_log_cdf_`, axes);


	/// strightening pareto

	var plotData = [];

	var hist_pareto = new Hist(null, 'pareto');
	cdf.Items().forEach( ([x,p], i) => {
		var [xl, yl] = pareto.straightenCdf(x, p);
		var fSkip = isNaN(xl) || isNaN(yl) || yl === Infinity || yl === -Infinity;
		if( fSkip ) return;
		hist_pareto.Set(xl, yl);
	});
	plotData.push(hist_pareto.ChartData({type:"scatter"}));

	// pareto: yl = -α * xl + α * ln(xmin)

	var m = -α ;
	var b = α * Math.log(xmin) ;

	var hist = graph.histLine(`pareto [xmin=${xmin.toFixed(2)}, α=${α.toFixed(2)}]`, m, b, {nDots:100, low:10, high:13});
	plotData.push(hist.ChartData({type:"line"}));

	var axes = {
		x:{title:`pareto`},
		y:{title:`data`}
	};
	var caption = "Pareto straightened CDF";
	renderPlot(caption, plotData, `chart_5_6_pareto_`, axes);


	/// strightening lognormal

	var plotData = [];

	var hist_lognor = new Hist(null, 'lognormal');
	cdf_log.Items().forEach( ([x,p], i) => {
		var [xl, yl] = gauss.straightenCdf(x, p);
		var fSkip = isNaN(xl) || isNaN(yl) || yl === Infinity || yl === -Infinity;
		if( fSkip ) return;
		hist_lognor.Set(xl, yl);
	});
	plotData.push(hist_lognor.ChartData({type:"scatter"}));

	// lognormal: yl = xl / (σ*sqrt(2)) - µ / (σ*sqrt(2))

	var m =  1 / ( σ * Math.sqrt(2) ) ;
	var b = -µ / ( σ * Math.sqrt(2) ) ;

	var hist = graph.histLine(`lognormal [µ=${µ.toFixed(2)}, σ=${σ.toFixed(2)}]`, m, b, {nDots:100, low:3, high:5.5});
	plotData.push(hist.ChartData({type:"line"}));

	var axes = {
		x:{title:`lognormal`},
		y:{title:`data`}
	};
	var caption = "Lognormal straightened CDF";
	renderPlot(caption, plotData, `chart_5_6_lognormal_`, axes);

})();

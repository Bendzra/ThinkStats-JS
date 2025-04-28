"use strict";

// Exercise 6.1

(function() {

	const title = "Exercise 6.1: famously skewed";

	printTitle(title);

	const from_hinc06 = {
		income: ["Under $5000","$5000 to  $9999","$10000 to $14999","$15000 to $19999","$20000 to $24999","$25000 to $29999","$30000 to $34999","$35000 to $39999","$40000 to $44999","$45000 to $49999","$50000 to $54999","$55000 to $59999","$60000 to $64999","$65000 to $69999","$70000 to $74999","$75000 to $79999","$80000 to $84999","$85000 to $89999","$90000 to $94999","$95000 to $99999","$100000 to $104999","$105000 to $109999","$110000 to $114999","$115000 to $119999","$120000 to $124999","$125000 to $129999","$130000 to $134999","$135000 to $139999","$140000 to $144999","$145000 to $149999","$150000 to $154999","$155000 to $159999","$160000 to $164999","$165000 to $169999","$170000 to $174999","$175000 to $179999","$180000 to $184999","$185000 to $189999","$190000 to $194999","$195000 to $199999","$200000 to $249999","$250000 and over"],
		number: [4204,4729,6982,7157,7131,674,6354,5832,5547,5254,5102,4256,4356,3949,3756,3414,3326,2643,2678,2223,2606,1838,1986,1464,1596,1327,1253,114,1119,920,1143,805,731,575,616,570,502,364,432,378,2549,2911]
	}

	const df = {low:[], high:[], freq:[]};

	const re = /^\s*(\S+)\b.*\s+(\S+)\s*/;

	from_hinc06.income.forEach( (label, i) => {

		const arr = re.exec(label);
		if(arr === null) return;

		if(arr[1] == 'Under')
		{
			arr[1] = 1.0e+3;
			arr[2] = parseInt( arr[2].substr(1) ) - 1;

		}
		else if (arr[2] == 'over' )
		{
			arr[1] = parseInt( arr[1].substr(1) );
			arr[2] = 1.0e+6;
		}
		else
		{
			arr[1] = parseInt( arr[1].substr(1) );
			arr[2] = parseInt( arr[2].substr(1) );
		}

		df.low .push(arr[1]);
		df.high.push(arr[2]);
		df.freq.push(from_hinc06.number[i]);

	});


	function InterpolateSample(df, log_lower=3.0, log_upper=6.0)
	{
	    // Makes a sample of log10 household income

	    // Assumes that log10 income is uniform in each range.

	    // df: DataFrame with columns income and freq
	    // log_upper: log10 of the assumed upper bound for the highest range

	    // returns: array of log10 household income

	    // compute the log10 of the upper bound for each range

	    df['log_upper'] = df.high.map( (income) => Math.log10(income) );
	    df.log_upper[df.log_upper.length-1] = log_upper;

	    // get the lower bounds by shifting the upper bound and filling in the first element

	    df['log_lower'] = df.low.map( (income) => Math.log10(income) );
	    df.log_lower[0] = log_lower;


	    // use the freq column to generate the right number of values in each range

	    var log_sample = df.freq.reduce( (arr, n, i) => {
	    	const high = df.log_upper[i];
	    	const low  = (i === 0) ? df.log_lower[i] : df.log_lower[i] + (high - df.log_lower[i]) / n;
	    	const vals = spreadDots(null, n, low, high);
	    	return arr.concat(vals);
	    }, []);

	    return log_sample;
	}


	var log_lower = 3;
	var log_upper = 6;

	var log_sample = InterpolateSample(df, log_lower, log_upper);

	var cdf = new Cdf(log_sample, null, `log_lower=${log_lower}, log_upper=${log_upper}`);

	var plotData = [];
	plotData.push(cdf.ChartData({type:"line"}));
	var axes = {
		x:{title:'household income (log10(x))'},
		y:{title:"CDF"}
	};
	var caption = `log10 Interpolated Sample of hinc06`;
	renderPlot(caption, plotData, "chart_hinc_logcdf_", axes);

	var median   = cdf.Median();
	var mean     = statistic.RawMoment(log_sample, 1);
	var skewness = statistic.Skewness(log_sample);
	var pms      = statistic.PearsonMedianSkewness(log_sample);

	console.log("log10 HINC06:",
		"\r\n\tlog_lower =", log_lower.fixFloat(),
		"\r\n\tlog_upper =", log_upper.fixFloat(),
		"\r\n\tmean =", mean.fixFloat(),
		"\r\n\tmedian =", median.fixFloat(),
		"\r\n\tsample skewness =", skewness.fixFloat(),
		"\r\n\tPearson’s median skewness =", pms.fixFloat());


	///

	var sample = log_sample.map((x) => Math.pow(10, x));

	var cdf = new Cdf(sample, null, `log_lower=${log_lower}, log_upper=${log_upper}`);

	var plotData = [];
	plotData.push(cdf.ChartData({type:"line"}));
	var axes = {
		x:{title:'household income'},
		y:{title:"CDF"}
	};
	var caption = `Interpolated Sample of hinc06`;
	renderPlot(caption, plotData, "chart_hinc_cdf_", axes);


	///

	var pdf = new EstimatedPdf(sample, `log_lower=${log_lower}, log_upper=${log_upper}`);

	var plotData = [];
	plotData.push(pdf.ChartData({type:"line"}));

	var mean     = statistic.RawMoment(sample, 1);
	var rank     = cdf.PercentileRank(mean);
	var median   = cdf.Median();
	var skewness = statistic.Skewness(sample);
	var pms      = statistic.PearsonMedianSkewness(sample);

	console.log("HINC06:",
		"\r\n\tmean =", mean.fixFloat(),
		"\r\n\tPercentileRank(mean) =", rank.fixFloat(), "%",
		"\r\n\tmedian =", median.fixFloat(),
		"\r\n\tsample skewness =", skewness.fixFloat(),
		"\r\n\tPearson’s median skewness =", pms.fixFloat());

	plotData = addVericals(plotData, [{"mean":mean}, {"median":median}]);

	var axes = {
		x:{title:`household income`},
		y:{title:"PDF"}
	};
	var caption = `Interpolated Sample of hinc06`;
	renderPlot(caption, plotData, "chart_hinc_pdf_", axes);

})();



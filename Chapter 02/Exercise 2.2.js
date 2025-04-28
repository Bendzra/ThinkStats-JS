"use strict";

// Exercise 2.2

(function() {

	const title = "2.11 Exercise 2.2";

	printTitle(title);

	const df = nsfg_2002FemPreg;

	//////////////
	// Using the variable totalwgt_lb,
	// investigate whether first babies are lighter or heavier than others.
	// Compute Cohen’s effect size to quantify the difference between the groups.
	// How does it compare to the difference in pregnancy length?

	var live   = {index:[], birthord:[], totalwgt_lb:[]};
	var firsts = {index:[], birthord:[], totalwgt_lb:[]};
	var others = {index:[], birthord:[], totalwgt_lb:[]};

	df.totalwgt_lb.data.forEach( (lb, i) => {
		if(df.outcome.data[i] === 1)
		{
			live.index.push(i);
			live.birthord.push(df.birthord.data[i])
			live.totalwgt_lb.push(lb);

			if (df.birthord.data[i] === 1)
			{
				firsts.index.push(i);
				firsts.birthord.push(df.birthord.data[i])
				firsts.totalwgt_lb.push(lb);
			}
			else
			{
				others.index.push(i);
				others.birthord.push(df.birthord.data[i])
				others.totalwgt_lb.push(lb);
			}
		}
	});

	var m = mean(live.totalwgt_lb);
	var v   = variance(m, live.totalwgt_lb);
	var std = Math.sqrt(v);
	console.log(`live.totalwgt_lb:\n\tmean=${m.toFixed(4)}\r\n\tvariance=${v.toFixed(4)}\r\n\tstd=${std.toFixed(4)}`);

	var m1   = mean(firsts.totalwgt_lb);
	var v1   = variance(m1, firsts.totalwgt_lb);
	var std1 = Math.sqrt(v1);
	console.log(`firsts.totalwgt_lb:\n\tmean=${m1.toFixed(4)}\r\n\tvariance=${v1.toFixed(4)}\r\n\tstd=${std1.toFixed(4)}`);

	var m2   = mean(others.totalwgt_lb);
	var v2   = variance(m2, others.totalwgt_lb);
	var std2 = Math.sqrt(v2);
	console.log(`others.totalwgt_lb:\n\tmean=${m2.toFixed(4)}\r\n\tvariance=${v2.toFixed(4)}\r\n\tstd=${std2.toFixed(4)}`);

	console.log(`(m1-m2)/m = ${(100*(m1-m2)/m).toFixed(4)} %`);

	var d = CohenEffectSize(firsts.totalwgt_lb, others.totalwgt_lb);
	console.log(`CohenEffectSize = ${d.toFixed(4)}`);


	/////////////////////////////////////////////////////////

	const resp = nsfg_2002FemResp;

	//////////////
	// Make a histogram of "totincr" the total income for the respondent's family.

	// TOTINCR (Total income of R's family)
	var tests = [
		["UNDER $5000",      299,  1],
		["$5000-$7499",      301,  2],
		["$7500-$9999",      266,  3],
		["$10,000-$12,499",  421,  4],
		["$12,500-$14,999",  445,  5],
		["$15,000-$19,999",  559,  6],
		["$20,000-$24,999",  583,  7],
		["$25,000-$29,999",  606,  8],
		["$30,000-$34,999",  607,  9],
		["$35,000-$39,999",  468, 10],
		["$40,000-$49,999",  647, 11],
		["$50,000-$59,000",  658, 12],
		["$60,000-$74,999",  623, 13],
		["$75,000 OR MORE", 1160, 14]
		// Total 7643
	];
	validateData(resp, "totincr", tests, 7643);
	var hist = new Hist(resp.totincr.data, 'totincr');
	var plotData = [hist.ChartData({type:"column"})];
	var axes = { x:{title:"code"}, y:{title:"frequency"} };
	renderPlot("Histogram of the total income for the respondent's family", plotData, "chart_totincr_", axes);


	//////////////
	// Make a histogram of "age_r", the respondent's age at the time of interview.

	// AGE_R (R's age at interview.(computed))
	var tests = [
		["15 YEARS", 217, 15],
		["16 YEARS", 223, 16],
		["17 YEARS", 234, 17],
		["18 YEARS", 235, 18],
		["19 YEARS", 241, 19],
		["20 YEARS", 258, 20],
		["21 YEARS", 267, 21],
		["22 YEARS", 287, 22],
		["23 YEARS", 282, 23],
		["24 YEARS", 269, 24],
		["25 YEARS", 267, 25],
		["26 YEARS", 260, 26],
		["27 YEARS", 255, 27],
		["28 YEARS", 252, 28],
		["29 YEARS", 262, 29],
		["30 YEARS", 292, 30],
		["31 YEARS", 278, 31],
		["32 YEARS", 273, 32],
		["33 YEARS", 257, 33],
		["34 YEARS", 255, 34],
		["35 YEARS", 262, 35],
		["36 YEARS", 266, 36],
		["37 YEARS", 271, 37],
		["38 YEARS", 256, 38],
		["39 YEARS", 215, 39],
		["40 YEARS", 256, 40],
		["41 YEARS", 250, 41],
		["42 YEARS", 215, 42],
		["43 YEARS", 253, 43],
		["44 YEARS", 235, 44]
		// Total 7643
	];
	validateData(resp, "age_r", tests, 7643);
	var hist = new Hist(resp.age_r.data, 'age_r');
	var plotData = [hist.ChartData({type:"column"})];
	var axes = { x:{title:"years"}, y:{title:"frequency"} };
	renderPlot("Histogram of the respondent's age at the time of interview", plotData, "chart_age_r_", axes);


	//////////////
	// Make a histogram of "numfmhh", the number of people in the respondent's household.

	// NUMFMHH (Number of family members in household)
	var tests = [
		["NO FAMILY MEMBERS",       942, 0],
		["1 FAMILY MEMBER",        1716, 1],
		["2 FAMILY MEMBERS",       1826, 2],
		["3 FAMILY MEMBERS",       1740, 3],
		["4 FAMILY MEMBERS",        906, 4],
		["5 FAMILY MEMBERS",        313, 5],
		["6 FAMILY MEMBERS",        118, 6],
		["7 FAMILY MEMBERS OR MORE", 78, 7],
		["Refused",                   4, 8]
		// Total 7643
	];
	validateData(resp, "numfmhh", tests, 7643);
	var hist = new Hist(resp.numfmhh.data, 'numfmhh');
	var plotData = [hist.ChartData({type:"column"})];
	var axes = { x:{title:"number"}, y:{title:"frequency"} };
	renderPlot("Histogram of the number of people in the respondent's household", plotData, "chart_numfmhh_", axes);


	//////////////
	// Make a histogram of "parity", the number of children borne by the respondent.

	// PARITY (CAPI-based total # of live births (accounting for mult birth))
	var tests = [
		["0 BABIES",         3230,     0],
		["1 BABY",           1519,     1],
		["2 BABIES",         1603,     2],
		["3 BABIES",         828,      3],
		["4 BABIES",         309,      4],
		["5 OR MORE BABIES", 154, [5,95]]
		// Total 7643
	];

	validateData(resp, "parity", tests, 7643);
	var hist = new Hist(resp.parity.data, 'parity');
	var plotData = [hist.ChartData({type:"column"})];
	var axes = { x:{title:"number"}, y:{title:"frequency"} };
	renderPlot("Histogram of the total number of children borne by the respondent", plotData, "chart_parity_", axes);

	// How would you describe this distribution?
	// Use Hist.Largest to find the largest values of parity.

	console.log( `parity.Largest =\r\n\t${hist.Largest().join("\r\n\t")}` );


	//////////////

	// Use "totincr" to select the respondents with the highest income (level 14).

	var rich = {index:[], parity:[]};
	resp.totincr.data.forEach( (income, i) => {
		if(income === 14) {
			rich.index.push(i);
			rich.parity.push(resp.parity.data[i]);
		}
	});

	// Plot the histogram of parity for just the high income respondents.

	var hist = new Hist(rich.parity, 'parity');
	var plotData = [hist.ChartData({type:"column"})];
	var axes = { x:{title:"number"}, y:{title:"frequency"} };
	renderPlot("Histogram of parity for just the high income respondents", plotData, "chart_parity_rich_", axes);

	// Find the largest parities for high income respondents.

	console.log( `high income respondents parity.Largest =\r\n\t${hist.Largest().join("\r\n\t")}` );

	// Compare the mean parity for high income respondents and others.

	var rich = {index:[], parity:[]};
	var others = {index:[], parity:[]};
	resp.totincr.data.forEach( (income, i) => {
		if(income === 14) {
			rich.index.push(i);
			rich.parity.push(resp.parity.data[i]);
		} else {
			others.index.push(i);
			others.parity.push(resp.parity.data[i]);
		}
	});

	var m1   = mean(rich.parity);
	var v1   = variance(m1, rich.parity);
	var std1 = Math.sqrt(v1);
	console.log(`rich.parity:\n\tmean=${m1.toFixed(4)}\r\n\tvariance=${v1.toFixed(4)}\r\n\tstd=${std1.toFixed(4)}`);

	var m2   = mean(others.parity);
	var v2   = variance(m2, others.parity);
	var std2 = Math.sqrt(v2);
	console.log(`others.parity:\n\tmean=${m2.toFixed(4)}\r\n\tvariance=${v2.toFixed(4)}\r\n\tstd=${std2.toFixed(4)}`);

	console.log(`(m1-m2)/m = ${(100*(m1-m2)/m).toFixed(4)} %`);

	// Compute the Cohen effect size for this difference.
	// How does it compare with the difference in pregnancy length for first babies and others?

	var d = CohenEffectSize(rich.parity, others.parity);
	console.log(`CohenEffectSize = ${d.toFixed(4)}`);

})();

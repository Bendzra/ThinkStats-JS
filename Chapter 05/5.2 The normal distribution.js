"use strict";

// 5.2 The normal distribution


(function() {

	const title = "5.2 The normal distribution";

	printTitle(title);

	///

	var µσs = [[0, 1], [1, 0.5], [2, 0.4], [3, 0.3]];
	var xs = spreadDots(null, 500, -5, 5);

	var plotData = [];

	µσs.forEach( ([µ,σ]) => {

		var pmf = gauss.pmfFromRange("", [µ, σ], {"xs":xs});
		var cdf = new Cdf(pmf, null, `µ = ${µ}, σ = ${σ}`);
		plotData.push(cdf.ChartData({type:"line"}));

		var cdf = gauss.cdfFromRange(`µ=${µ}/σ=${σ}`, [µ, σ], {"xs":xs});
		plotData.push(cdf.ChartData({type:"line"}));
	});

	var axes = {
		x:{title:"x"},
		y:{title:"CDF"}
	};
	var caption = "Figure 5.3: CDF of normal distributions with a range of parameters";
	renderPlot(caption, plotData, "chart_norm_", axes);

	///

	const preg = nsfg_2002FemPreg ;

	var live   = {totalwgt_lb:[]};
	var firsts = {totalwgt_lb:[]};
	var others = {totalwgt_lb:[]};

	preg.totalwgt_lb.data.forEach( (pounds, i) => {
		if(preg.outcome.data[i] === 1)
		{
			live.totalwgt_lb.push(pounds);
			if (preg.birthord.data[i] === 1) firsts.totalwgt_lb.push(pounds);
			else others.totalwgt_lb.push(pounds);
		}
	});

	var cdf   = new Cdf(live.totalwgt_lb, null, "data");

	var plotData = [];

	plotData.push(cdf.ChartData({type:"line"}));

	var µ = 7.28, σ = 1.24;
	var cdf = gauss.cdfFromRange(`model (µ=${µ}/σ=${σ})`, [µ, σ], {nDots:500, low:0, high:16});
	plotData.push(cdf.ChartData({type:"line"}));

	var axes = {
		x:{title:"birth weight (lbs)"},
		y:{title:"CDF"}
	};
	var caption = "Figure 5.4: CDF of birth weights with a normal model";
	renderPlot(caption, plotData, "chart_birth_", axes);


	/// test inverf

	var xs = spreadDots(null, 1000, -1, 1);
	var hist = new Hist(null, `inverse erf`);

	xs.forEach( (x) => {
		var p = gauss.inverf(x);
		hist.Set(x, p);
	});

	var plotData = [hist.ChartData({type:"line"})];

	var axes = {
		x:{title:"x"},
		y:{title:"inverse erf"}
	};
	var caption = "inverse erf";
	renderPlot(caption, plotData, "chart_inverse_erf_", axes);

})();

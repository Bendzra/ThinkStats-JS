"use strict";

// 8.6 Exercises

(function() {

	const title = "8.6 Exercises";

	printTitle(title);

})();

(function() {

	const subtitle = "Exercise 8.2: estimate L";

	printTitle(subtitle);


	/////////////////////////////////////////////


	function SimulateSample(lam=2, n=10, m=1000)
	{

		// Sampling distribution of L as an estimator of exponential parameter

		// lam: parameter of an exponential distribution
		// n: sample size
		// m: number of iterations


		const estimates = [];

		while(m-- > 0)
		{
			const xs = Array.from({length: n}, (_) => exponential.Variate(lam) );
			const L = 1 / statistic.Mean(xs);
			estimates.push(L);
		}

		const stderr = RMSE(estimates, lam);

		const cdf = new Cdf(estimates, null, `lam=${lam}, n=${n}`);
		const ci = [cdf.Percentile(5), cdf.Percentile(95)]
		console.log('standard error =', stderr, '\nconfidence interval =', ci);

		// plot the CDF

		const plotData = [];
		plotData.push(cdf.ChartData({type:"line"}));
		addVericals(plotData, [{"5%":cdf.Percentile(5)}, {"95%":cdf.Percentile(95)}]);
		const axes = {
			x:{title:'estimate'},
			y:{title:"CDF"}
		};
		const caption = `Sampling distribution (lam=${lam}, n=${n})`;
		renderPlot(caption, plotData, `chart_${n}_`, axes);

		return stderr;
	}

	[10, 100, 1000].forEach( (n) => {
		const stderr = SimulateSample(2, n, 5000);
		console.log("\tn =", n, "\n\tstderr =", stderr);
	});


})();


(function() {

	const subtitle = "Exercise 8.3: goals";

	printTitle(subtitle);


	/////////////////////////////////////////////


	function SimulateGame(lam)
	{
		// """Simulates a game and returns the estimated goal-scoring rate.

		// lam: actual goal scoring rate in goals per game

		let goals = 0;
		let t = 0;
		while (true)
		{
			const time_between_goals = exponential.Variate(lam);
			t += time_between_goals
			if (t > 1) break;
			goals += 1;
		}

		// # estimated goal-scoring rate is the actual number of goals scored
		const L = goals;
		return L;
	}


	let lam=2, m=1000000;

    const estimates = [];

    while(m-- > 0)
    {
        const L = SimulateGame(lam);
        estimates.push(L);
    }

    console.log('rmse L =', RMSE(estimates, lam),
    	'\nmean error L =', MeanError(estimates, lam));

    const pmf = new Pmf(estimates);

	const plotData = [];
	plotData.push(pmf.ChartData({type:"line"}));
	const axes = {
		x:{title:'estimate'},
		y:{title:"PMF"}
	};
	const caption = `Goals distribution (lam=${lam})`;
	renderPlot(caption, plotData, `chart_${m}_`, axes);

})();

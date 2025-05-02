"use strict";

// 10.5 Goodness of fit

(function() {

	const title = "10.5 Goodness of fit";

	printTitle(title);

	/////////////////////////////////////////////

	function CoefDetermination(ys, res)
	{
		return 1 - statistic.Variance(res) / statistic.Variance(ys);
	}


	const [inter, slope] = LeastSquares(ages, weights);
	const residuals = Residuals(ages, weights, inter, slope);

	const res_STD  = statistic.Std(residuals);
	const res_MSE  = statistic.CentralMoment(residuals, 2, 0);
	const res_RMSE = Math.sqrt(res_MSE);

	console.log("res_STD =", res_STD.fixFloat(),
		"\nres_MSE =", res_MSE.fixFloat(),
		"\nres_RMSE =", res_RMSE.fixFloat(),
	);

	const lbs_mean = statistic.Mean(weights);
	const lbs_std  = statistic.Std(weights, lbs_mean);

	console.log("lbs_mean =", lbs_mean.fixFloat(),
		"\nlbs_std =", lbs_std.fixFloat()
	);

	const rho = statistic.Corr(weights, residuals);
	const R2 = CoefDetermination(weights, residuals);
	console.log("R2 =", R2.fixFloat(),
		"\nrho =", rho.fixFloat(),
		"\n1-rho2 =", (1-rho**2).fixFloat()
	);

})();

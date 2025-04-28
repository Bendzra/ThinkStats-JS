"use strict";

// 7.7 Spearman’s rank correlation

(function() {

	const title = "7.7 Spearman’s rank correlation";

	printTitle(title);


	///

	const db = cdc_brfss2008;

	const subset = ['htm3', 'wtkg2'];
	const df = dropna(db, subset);


	var pearson_corr = statistic.Corr(df.htm3, df.wtkg2);
	var spearman_rank_corr = statistic.SpearmanCorr(df.htm3, df.wtkg2);

	console.log("correlation (htm3, wtkg2):",
		"\n\tPearson’s  =", pearson_corr,
		"\n\tSpearman’s rank =", spearman_rank_corr);

	const log_wtkg2 = df.wtkg2.map( (w) => Math.log(w) );

	var pearson_corr = statistic.Corr(df.htm3, log_wtkg2);
	var spearman_rank_corr = statistic.SpearmanCorr(df.htm3, log_wtkg2);

	console.log("correlation (htm3, log_wtkg2):",
		"\n\tPearson’s  =", pearson_corr,
		"\n\tSpearman’s rank =", spearman_rank_corr);

})();

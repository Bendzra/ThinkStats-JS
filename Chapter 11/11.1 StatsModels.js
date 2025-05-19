"use strict";

// 11.1 StatsModels


const time_start = (new Date()).getTime();

(function() {

	const title = "11.1 StatsModels";

	printTitle(title);


	/////////////////////////////////////////////

	const [live, firsts, others] = liveFirstsOthers(nsfg_2002FemPreg, ['totalwgt_lb', 'agepreg'], true);

	const xs = live.agepreg;
	const ys = live.totalwgt_lb;

	const X  = xs.map( (x) => [1, x] );
	const Y  = matrix.transpose([ys]);

	const n = X.length,		// rows
	      p = X[0].length;	// columns

	// β = w = (X^{T}X)^{-1}X^{T} Y

	const XT = matrix.transpose(X);

	let W = matrix.dot(XT, X);	// (N) a Gram matrix
	W = matrix.invert(W);		// (Q) the cofactor matrix of β = W, closely related to its covariance matrix
	W = matrix.dot(W, XT);	    // he Moore–Penrose pseudoinverse matrix of X
	W = matrix.dot(W, Y);	    // the coefficient vector of the least-squares hyperplane

	const [inter, slope] = [W[0][0], W[1][0]];
	console.log("inter =", inter.fixFloat(),
		"\nslope =", slope.fixFloat());

	///

	const Ŷ = matrix.dot(X, W);		 // the fitted values (or predicted values)
	const Ȇ = matrix.subtract(Y, Ŷ); // the residuals from the regression

	const RSS = matrix.dot(matrix.transpose(Ȇ), Ȇ)[0][0];	// The sum of squared residuals
	const s2  =  RSS / (n - p); 							// the OLS estimate for σ2
	console.log( "res:",
		"\n\t(OLS) Std =", Math.sqrt(s2).fixFloat(),
		"\n\t(MLE) Std =", Math.sqrt( (n - p) * s2 / n).fixFloat() );

	///

	const meany = statistic.Mean(ys);
	const stdy  = statistic.Std(ys, meany, NaN, p);
	const TSS = ys.reduce( (tss, y) => tss + (y - meany)**2, 0 );
	console.log("ys:",
		"\n\tmean =", meany.fixFloat(),
		"\n\tstd  =", stdy.fixFloat(),
		"\n\tTSS  =", TSS.fixFloat(),
		"\n\tStd  =", Math.sqrt(TSS / (n - p)).fixFloat());

	///

	const R2  = 1 - RSS / TSS;
	console.log("R^2 =", R2.fixFloat());

	///

	console.log("\tdt =", (new Date()).getTime() - time_start);

})();

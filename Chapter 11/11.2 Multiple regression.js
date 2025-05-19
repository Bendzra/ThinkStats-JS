"use strict";

// 11.2 Multiple regression


/////////////////////////////////////////////

class ols
{
	static fit1(xs, ys)
	{
		// xs: explanatory variables  = [{var_1: [x_11,...,x_1n]}, ..., {var_p: [x_p1,...,x_pn]}]
		// ys: dependent variable = [y_1, ..., y_n]

		const results = {};

		const vars = [], arrs = [];
		xs.forEach( (va) => {
			const [v, a] = Object.entries(va)[0];
			vars.push(v); arrs.push(a);

		});

		// transposing xs, and addin first column of 1s
		const X  = [];
		for(let i = 0; i < arrs[0].length; i++)
		{
			const row = [1];
			for(let j = 0; j < arrs.length; j++) row.push(arrs[j][i]);
			X.push(row);
		}

		const Y  = matrix.transpose([ys]);

		const n = X.length,		// rows
		      p = X[0].length;	// columns

		results["n×p"] = [n , p];

		const XT = matrix.transpose(X);

		let Q = matrix.dot(XT, X);	// (N = XT.X  ) a Gram matrix
		Q = matrix.invert(Q);		// (Q = N^{-1}) the cofactor matrix of β (= W), closely related to its covariance matrix

		let W = matrix.dot(Q, XT);	// the Moore–Penrose pseudoinverse matrix of X
		W = matrix.dot(W, Y);	    // the coefficient vector of the least-squares hyperplane

		///

		const Ŷ = matrix.dot(X, W);		 // the fitted values (or predicted values)
		const Ȇ = matrix.subtract(Y, Ŷ); // the residuals from the regression
		const RSS = matrix.dot(matrix.transpose(Ȇ), Ȇ)[0][0];	// The sum of squared residuals

		const stdr = results['Std(res)'] = Math.sqrt(RSS / (n - p));

		/// storing the intercept:

		const ri = results['inter'] = {};

		ri['b']       = W[0][0];
		ri['std']     = stdr*Math.sqrt(Q[0][0]);
		ri['t']       = ri['b'] / ri['std'];
		ri['p_value'] = 2 * (1 - studentT.cdf(ri['t'], n - p));

		/// storing the slopes stats (in 'slopes'):

		const slopes = results["slopes"] = new Map();
		for(let i = 1; i < W.length; i++)
		{
			const ri = {};
			slopes.set(vars[i-1], ri);

			ri['slope']   = W[i][0];
			ri['std']     = stdr * Math.sqrt(Q[i][i]);
			ri['t']       = ri['slope'] / ri['std'];
			ri['p_value'] = 2 * (1 - studentT.cdf(ri['t'], n - p));
		}

		///

		const meany = statistic.Mean(ys);
		const TSS = ys.reduce( (tss, y) => tss + (y - meany)**2, 0 );

		const stdy = results['Std(ys)'] = Math.sqrt(TSS / (n - p));

		///

		const R2 = results['R2'] = 1 - RSS / TSS;

		const F = results['F'] = (R2 / (p-1)) / ((1-R2)/(n-p));
		results['pdf(F)'] = fisherF.pdf(F, n, p);
		results['p_value(F)'] = 1 - fisherF.cdf(F, n, p);

		return results;
	};


	static output (results)
	{
		const summary = [...Object.keys(results)].reduce( (arr, k) => {
			if(k === "slopes")
			{
				for(const [key, obj] of results[k])
				{
					arr[arr.length] = "\n\n\t" + key + ":";
					arr[arr.length] = obj;
				}
			}
			else
			{
				if(['Std(ys)','F'].indexOf(k) !== -1) arr[arr.length] = "\n";
				if(results[k] instanceof Object) arr[arr.length] = "\n";

				arr[arr.length] = "\n\t" + k + ":";
				arr[arr.length] = results[k];
			}
			return arr;
		}, [] );

		return summary;
	};
}


/////////////////////////////////////////////

class studentT
{
	static pdf(t, nu)
	{
		// Density of the "t" distribution
		// nu > 1: the number of degrees of freedom

		let density = Math.pow(1 + t**2 / nu, -(nu+1) / 2) / Math.sqrt(nu);

		const r = nu % 2;
		if(r === 0) density /= 2 ;
		else if (r === 1) density /= Math.PI ;
		else return;

		let i = nu;
		while(i > 2)
		{
			density *= (--i);
			density /= (--i);
		}

		return density;
	};

	static cdf(t, nu)
	{
		// Density of the "t" distribution
		// nu > 1: the number of degrees of freedom

		const x = nu / (nu + t**2);
		const f = 1 - 0.5 * betaB.incompleteRegularized(x, fixFloat(nu / 2), 0.5);
		return f;
	};
}

/////////////////////////////////////////////

class betaB
{

	static B11 = Math.PI; // beta(0.5, 0.5)
	static B10 = 2;       // beta(0.5,   1)
	static B01 = 2;       // beta(  1, 0.5)
	static B00 = 1;       // beta(  1,   1)


	static incompleteRegularized(x, a, b)
	{
		// The regularized incomplete beta: I(x; a,b) = B(x; a,b) / B (a,b)

		// !!! a, b = 0.5 multiple

		// I(x; a+1, b) = I(x; a, b) - x^a*(1-x)^b / ( a * B(a,b) )
		// B(   a+1, b) = B(   a, b) * a / (a + b)

		// I(x; a, b+1) = I(x; a,b) - x^a*(1-x)^b / ( b * B(a,b) )
		// B(   a, b+1) = B(   a,b) * b / (a + b)

		if (x === 0) return 0;
		if (x === 1) return 1;

		if (b === 1) return Math.pow(x, a);
		if (a === 1) return 1 - Math.pow(1-x, b);

		let I, q, r;

		const ra = (a * 2) % 2,
		      rb = (b * 2) % 2;

		if (ra === 1 && rb === 1)      { q = 0.5; r = 0.5; I = 2 * Math.asin(Math.sqrt(x)) / this.B11; }
		else if (ra === 1 && rb === 0) { q = 0.5; r =   1; I = Math.sqrt(x);                           }
		else if (ra === 0 && rb === 1) { q =   1; r = 0.5; I = 1 - Math.sqrt(1 - x);                   }
		else if (ra === 0 && rb === 0) { q =   1; r =   1; I = x;                                      }
		else
		{
			return;
		}

		let da = Math.pow(x, q) * Math.pow(1-x, r) / (q * this.betaBinom(q, r));
		let db = Math.pow(x, q) * Math.pow(1-x, r) / (r * this.betaBinom(q, r));

		while( q < a )
		{
			I -= da;
			da *= x * (q + r) / (q + 1);
			db *= x * (q + r) / q ;
			q++;
		}

		while( r < b )
		{
			I += db;
			db *= (1 - x) * (q + r) / (r + 1);
			r++;
		}

		return I;
	};


	static betaBinom(a, b)
	{
		// Beta function (half-integers)
		//   !!! a, b = 0.5 multiple
		//   B(a+1, b) = B(a,b)*a/(a+b), B(a,b+1) = B(a,b)*b/(a+b)

		let B, q, r;

		const ra = (a * 2) % 2,
		      rb = (b * 2) % 2;

		if      (ra === 1 && rb === 1) {B = this.B11; q = 0.5; r = 0.5;}
		else if (ra === 1 && rb === 0) {B = this.B10; q = 0.5; r =   1;}
		else if (ra === 0 && rb === 1) {B = this.B01; q =   1; r = 0.5;}
		else if (ra === 0 && rb === 0) {B = this.B00; q =   1; r =   1;}
		else return;

		while( q < a ) { B *= q / (q + r); q++; }
		while( r < b ) { B *= r / (q + r); r++; }

		return B;
	};
}

class fisherF
{
	static pdf(x, d1, d2)
	{

		// f(x; d1, d2) = sqrt( ((d1*x)^d1 * d2^d2) / (d1*x + d2)^(d1+d2) ) / (x * B( d1/2, d2/2))

		const D1 = x * d1 / (x * d1 + d2);
		const D2 =     d2 / (x * d1 + d2);

		let a = 1;

		for(let i = 0; i < d1; i++)
		{
			a *= D1;
		}
		for(let i = 0; i < d2; i++)
		{
			a *= D2;
		}

		a = Math.sqrt(a) / x ;

		let B, q, r;

		const r1 = d1 % 2,
		      r2 = d2 % 2;

		if      (r1 === 1 && r2 === 1) {B = betaB.B11; q = 0.5; r = 0.5;}
		else if (r1 === 1 && r2 === 0) {B = betaB.B10; q = 0.5; r =   1;}
		else if (r1 === 0 && r2 === 1) {B = betaB.B01; q =   1; r = 0.5;}
		else if (r1 === 0 && r2 === 0) {B = betaB.B00; q =   1; r =   1;}
		else return;

		a /= B;

		while( q < d1 / 2 ) { a *= (q + r) / q; q++; }
		while( r < d2 / 2 ) { a *= (q + r) / r; r++; }

		return a;
	};

	static cdf(x, d1, d2)
	{
		const t = d1 * x / (d1 * x + d2);
		const F = betaB.incompleteRegularized(t, fixFloat(d1 / 2), fixFloat(d2 / 2))
		return F;
	};
}


/////////////////////////////////////////////


(function() {

	const title = "11.2 Multiple regression";

	printTitle(title);


	/////////////////////////////////////////////

	const [live, firsts, others] = liveFirstsOthers(nsfg_2002FemPreg, ["birthord", 'totalwgt_lb', 'agepreg'], true);


	var xs = [{'agepreg':live.agepreg}];
	var ys = live.totalwgt_lb;

	var diff_weight = statistic.Mean(firsts.totalwgt_lb) - statistic.Mean(others.totalwgt_lb);
	var diff_age    = statistic.Mean(firsts.agepreg) - statistic.Mean(others.agepreg);
	var results = ols.fit1(xs, ys);

	console.log("live (totalwgt_lb ~ agepreg):",
		"\n\tdiff_age =", diff_age.fixFloat(),
		"\n\tdiff_weight    =", diff_weight.fixFloat(),
		"\n\tslope*diff_age =", (results.slope * diff_age).fixFloat(),
		"\n", ...ols.output(results) );


	///

	live['isfirst'] = live.birthord.map( (ord) => +(ord === 1));

	var xs = [{'isfirst':live.isfirst}];
	var ys = live.totalwgt_lb;

	var results = ols.fit1(xs, ys);

	console.log("totalwgt_lb ~ isfirst:", ...ols.output(results) );

	///

	var xs = [{'isfirst':live.isfirst}, {'agepreg':live.agepreg}];
	var ys = live.totalwgt_lb;

	var results = ols.fit1(xs, ys);

	console.log( "totalwgt_lb ~ isfirst + agepreg:", ...ols.output(results) );


	///

	console.log("dt =", (new Date()).getTime() - time_start);



	/////////////////////////////////////////////

	const title2 = "11.3 Nonlinear relationships";

	printTitle(title2);


	/////////////////////////////////////////////

	live['agepreg2'] = live.agepreg.map( (age) => age**2 );

	var xs = [{'isfirst':live.isfirst}, {'agepreg':live.agepreg}, {'agepreg2':live.agepreg2}];
	var ys = live.totalwgt_lb;

	var results = ols.fit1(xs, ys);

	console.log( "totalwgt_lb ~ isfirst + agepreg + agepreg2:", ...ols.output(results) );

	///

	console.log("dt =", (new Date()).getTime() - time_start);
})();

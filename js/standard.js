"use strict";

///////////////////////////////////////////////////////////////////////////////
///
///  Some analytic distributions and functions
///
///////////////////////////////////////////////////////////////////////////////

class make
{
	static LOG2 = Math.log(2);

	static cdfFromRange(label="", params, range={xs:null, nDots:100, low:false, high:false, decimal:8})
	{
		if (!("xs"      in range)) range.xs      = null;
		if (!("nDots"   in range)) range.nDots   = 100;
		if (!("low"     in range)) range.low     = false;
		if (!("high"    in range)) range.high    = false;
		if (!("decimal" in range)) range.decimal = 8;

		const xs = (range.xs===null) ? spreadDots(null, range.nDots, range.low, range.high, range.decimal) : range.xs;
		const ps = xs.map((x) => this.evalCdf(x, params));
		const cdf = new Cdf(xs, ps, label);
		return cdf;
	};

	static pmfFromRange(label="", params, range={xs:null, nDots:100, low:false, high:false, decimal:8}, normalize=false)
	{
		if (!("xs"      in range)) range.xs      = null;
		if (!("nDots"   in range)) range.nDots   = 100;
		if (!("low"     in range)) range.low     = false;
		if (!("high"    in range)) range.high    = false;
		if (!("decimal" in range)) range.decimal = 8;

		const xs = (range.xs===null) ? spreadDots(null, range.nDots, range.low, range.high, range.decimal) : range.xs;
		const pmf = new Pmf(null, label);
		xs.forEach((x) => {
			const p = this.evalPdf(x, params);
			pmf.Set(x, p);
		});
		if (normalize) pmf.Normalize();
		return pmf;
	};

	static distProbPlot(sortedDataset, params=null, label="", range={xs:null, nDots:100, low:false, high:false, decimal:8}, way=1)
	{
		// There are two ways to generate a (normal, etc.) probability plot: the hard way and the easy way

		var hist = null;

		// 1. Sort the values in the sample

		// sortedDataset must be cleand from NaNs and sorted

		if (way === 1)
		{

			// 2. From a standard distribution (if normal, params = [µ = 0, σ = 1]),
			// generate a random sample with the same size as the sample, and sort it.

			const pmf = this.pmfFromRange("", params, range);
			const cdf = new Cdf(pmf);
			const sample = cdf.Sample(sortedDataset.length, true);

			// if(params[1] === 0.5)  pmf.Print();

			// 3. Plot the sorted values from the sample versus the random values.

			hist = new Hist(null, label);
			sample.forEach( (x, i) => {

				var y = sortedDataset[i];

				// if(params[1] === 0.5) console.log("***", i, x, y);

				hist.Set(x, sortedDataset[i]);
			});
		}
		else if (way === 2)
		{
			// or calculate quantiles for a range of 'ps'

			const ps = spreadDots(null, sortedDataset.length, 0, 1);
			hist = new Hist(null, label);
			ps.forEach( (p, i) => {

				var x = this.Quantile(p, params);
				if(x === Infinity) return;
				var y = sortedDataset[i];
				hist.Set(x, y);

			});
		}
		else
		{
			// or directly (one to one) calculate quantiles

			var cdf = new Cdf(sortedDataset);
			hist = new Hist(null, label);
			cdf.ps.forEach( (p, i) => {

				var x = this.Quantile(p, params);
				if(x === Infinity) return;
				var y = cdf.xs[i];
				hist.Set(x, y);

			});
		}

		return hist;
	};

	static Variate(params)
	{
		// generate a random value with the distribution by
		// choosing p from a uniform distribution between 0 and 1

		var p = Math.random();
		return this.Quantile(p, params);
	};
}


///////////////////////////////////////////////////////////////////////////////

class exponential extends make
{
	static evalPdf(x, params)
	{
		// The PDF of the exponential distribution

		const λ = params;
		if(x < 0) return 0;
		return λ * Math.exp(-λ*x);
	};

	static evalCdf(x, params)
	{
		// The CDF of the exponential distribution

		const λ = params;
		if(x < 0) return 0;
		return 1 - Math.exp(-λ*x);
	};

	static Quantile(p, params)
	{
		const λ = params;
		return -Math.log(1 - p) / λ;
	};

	static Mean(params)
	{
		const λ = params;
		return 1 / λ;
	};

	static Median(params)
	{
		const λ = params;
		return this.LOG2 / λ;
	};

	static Variance(params)
	{
		const λ = params;
		return 1 / Math.pow(λ, 2);
	};

	static straightenCdf(x, p)
	{
		// f = m * t + h

		// CDF(x) = 1 - exp(-λ*x)
		// ln( 1 - CDF(x) ) = -λ*x;

		const f = Math.log(1 - p);
		const t = x;

		// m = -λ
		// h = 0

		return [t, f];
	};
}


///////////////////////////////////////////////////////////////////////////////

class gauss extends make
{
	static ROOT2PI = Math.sqrt(2 * Math.PI);
	static ROOTPI  = Math.sqrt(Math.PI);
	static ROOT2   = Math.sqrt(2);

	static __memo_cs = [];

	static #stdPdf(z)
	{
		return Math.exp(-Math.pow(z, 2) / 2) / this.ROOT2PI;
	};

	static evalPdf(x, params=[0, 1])
	{
		const [µ, σ] = params;
		return this.#stdPdf( (x - µ) / σ ) / σ;
	};

	static Quantile(p, params=[0, 1, 2008])
	{
		var [µ, σ, ver] = params;
		if(!ver) ver = 2008;
		return µ + σ * this.ROOT2 * this.inverf(2*p - 1, ver);
	};

	static invErfCoeff(k)
	{
		var cs = this.__memo_cs;
		cs[0] = 1;
		for(var t = 1; t <= k; t++)
		{
			if (cs[t] > 0) continue;
			var sum = 0;
			for(var m = 0; m < t; m++)
			{
				var a = cs[m] * cs[t-1-m] / ( (m+1) * (2*m+1) );
				sum += a;
			}
			cs[t] = sum;
		}
		return cs[k];
	};

	static inverf(z, ver=0)
	{
		// inverse error function
		var y = 0;

		if(ver==2008)
		{
			// approximation by Sergei Winitzki (2008)
			const a     = 0.147;
			const x     = z;
			if(x === 1) y = 2.76756533;
			else if(x === -1) y = -2.76756533;
			else
			{
				const lx2   = Math.log(1-Math.pow(x, 2));
				const pa2   = 2 / (Math.PI * a);
				const palx2 = pa2 + 0.5 * lx2;
				y = Math.sqrt(Math.sqrt(Math.pow(palx2, 2) - lx2/a) - palx2);
				if(x < 0) y = -y;
			}
		}
		else
		{
			// Maclaurin series

			var c = 1;
			var Π = 0.5 * this.ROOTPI * z;
			var a = c * Π;
			var sum = a;
			var k = 0;
			var b, d = 1;
			while( k < 2942 && (Math.abs(d) > 2.060e-8 || k < 10) )
			{
				k++;
				Π = Π * z * z * Math.PI / 4;
				c = this.invErfCoeff(k);

				if (c === Infinity)
				{
					console.warn(`break (c=${c}):\r\nk=${k}, Π=${Π};\r\nlast good (a=${a}):\r\nz=${z}, sum=${sum}, d=${d}`);
					break;
				}

				b = c * Π / (2*k + 1);
				d = b - a;
				a = b;
				sum += a;
			}
			y = sum;
		}
		return y;
	};

	static erf(z, ver=2023)
	{
		// The error function

		return 2 * this.#stdCdf(this.ROOT2 * z, ver) - 1;

	};

	static evalCdf(x, params=[0, 1, 2023])
	{
		var [µ, σ, ver] = params;
		if(!ver) ver = 2023;
		var z = (x - µ) / σ;
		return this.#stdCdf(z, ver);
	};

	static #stdCdf(z, ver=2023)
	{
		// The cumulative distribution function (CDF) of the standard normal distribution

		var y = 0;

		if(ver == 1964)
		{
			// Zelen & Severo (1964) approximation for Φ(x) for x > 0 with the absolute error |ε(x)| < 7.5·10−8

			const x = (z < 0) ? -z : z;

			const b0 = 0.2316419, b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
			const t = 1 / (1 + b0*x);

			y = 1 - this.#stdPdf(x) * ( b1*Math.pow(t, 1) + b2*Math.pow(t, 2) +
					b3*Math.pow(t, 3) + b4*Math.pow(t, 4) + b5*Math.pow(t, 5) );

			if(z < 0) y = 1 - y;
		}
		else if(ver == 2023)
		{
			// Dia (2023) approximation of 1 - Φ(x)
			// with a maximum relative error less than 2^-53 (≈1.1×10−16)
			// in absolute value: for x ≥ 0

			const x = (z < 0) ? -z : z;
			const x2 = Math.pow(x,2);
			y = 1 - 0.39894228040143268/(x+2.92678600515804815)
				* (x2+8.42742300458043240*x+18.38871225773938487)/(x2+5.81582518933527391*x+8.97280659046817350)
				* (x2+7.30756258553673541*x+18.25323235347346525)/(x2+5.70347935898051437*x+10.27157061171363079)
				* (x2+5.66479518878470765*x+18.61193318971775795)/(x2+5.51862483025707963*x+12.72323261907760928)
				* (x2+4.91396098895240075*x+24.14804072812762821)/(x2+5.26184239579604207*x+16.88639562007936908)
				* (x2+3.83362947800146179*x+11.61511226260603247)/(x2+4.92081346632882033*x+24.12333774572479110)
				* Math.exp(-x2/2);

			if(z < 0) y = 1 - y;
		}
		else if(ver == 2008)
		{
			// approximation by Sergei Winitzki (2008)
			// relative error is less than 0.00035 for all real x

			const x = z/this.ROOT2;
			const a = 0.147;
			const x2 = Math.pow(x,2);
			const uerf = Math.sqrt(1 - Math.exp(-x2*(4/Math.PI + a*x2)/(1 + a*x2)));
			y = (z < 0) ? 0.5 - 0.5 * uerf : 0.5 + 0.5 * uerf ;
		}
		else
		{
			// Marsaglia (2004) algorithm based on the Taylor series expansion

			var a = z;
			var sum = a;
			var k = 0;
			while( Math.abs(a) > 1.0e-10 )
			{
				k++;
				a = a * Math.pow(z, 2) / (2*k + 1);
				sum += a;
			}
			y = 0.5 + Math.exp(-Math.pow(z, 2) / 2) * sum / this.ROOT2PI;
		}

		return y;
	};

	static straightenCdf(x, p, ver=0)
	{
		// f = m * t + h

		// CDF(x) = 0.5[ 1 + erf( (x-µ)/(σ*sqrt(2)) ) ]
		// inverf( 2*CDF(x) - 1 ) = x / (σ*sqrt(2)) - µ / (σ*sqrt(2))

		const f = this.inverf(2*p - 1, ver);
		const t = x;

		// m =   1 / (σ*sqrt(2))
		// h = - µ / (σ*sqrt(2))

		return [t, f];
	};
}


///////////////////////////////////////////////////////////////////////////////

class pareto extends make
{
	static evalCdf(x, params)
	{
		// params = [xmin, α]

		const [xmin, α] = params;

		if(x < xmin) return 0;
		return 1 - Math.pow(x/xmin, -α);
	};

	static evalPdf(x, params)
	{
		const [xmin, α] = params;

		if (x < xmin) return 0;
		return α * Math.pow(xmin, α) / Math.pow(x, α+1);
	};

	static Quantile(p, params)
	{
		const [xmin, α] = params;
		return xmin * Math.pow(1 - p, -1/α);
	};

	static Mean(params)
	{
		const [xmin, α] = params;
		if(α <= 1) return Infinity;
		return α * xmin / (α - 1);
	};

	static Median(params)
	{
		const [xmin, α] = params;
		return xmin * Math.pow(2, 1/α);
	};

	static Variance(params)
	{
		const [xmin, α] = params;
		if(α<=2) return Infinity;
		return xmin*xmin*α / ((α-1)*(α-1)*(α-2));
	};

	static straightenCdf(x, p)
	{
		// f = m * t + h

		// CDF(x) = 1 - pow(xmin/x, α)
		// ln( 1 - CDF(x) ) = -α * ( ln(x) - ln(xmin) )

		const f = Math.log(1 - p);
		const t = Math.log(x);

		// m = -α
		// h =  α * ln(xmin)

		return [t, f];
	};
}


///////////////////////////////////////////////////////////////////////////////

class weibull extends make
{
	static evalPdf(x, params)
	{
		const [λ, k] = params;
		if(x < 0) return 0;
		return (k / λ) * Math.pow(x / λ, k - 1) * Math.exp(-Math.pow(x / λ, k));
	};

	static evalCdf(x, params)
	{
		const [λ, k] = params;
		if(x < 0) return 0;
		return 1 - Math.exp(-Math.pow(x / λ, k));
	};

	static Quantile(p, params)
	{
		const [λ, k] = params;
		return λ * Math.pow(-Math.log(1 - p), 1 / k);
	};

	static Mean(params)
	{
		const [λ, k] = params;
		// TODO: return λ * Γ(1 + 1/k);
		throw new RangeError("Not implemented: mean = λ * Γ(1 + 1/k)");
	};

	static Median(params)
	{
		const [λ, k] = params;
		return λ * Math.pow(this.LOG2, 1/k);
	};

	static Variance(params)
	{
		const [λ, k] = params;
		// TODO: return λ**2 * ( Γ(1 + 2/k) - (Γ(1 + 1/k))**2 );
		throw new RangeError("Not implemented: variance = λ**2 * ( Γ(1 + 2/k) - (Γ(1 + 1/k))**2 );");
	};

	static straightenCdf(x, p)
	{
		// f = m * t + h

		// CDF(x) = 1 - exp( -pow(x/λ, k) );
		// ln(-ln(1-CDF(x))) = k * ln(x) - k * ln(λ)

		const f = Math.log(-Math.log(1 - p));
		const t = Math.log(x);

		// m =  k
		// h = -k * ln(λ)

		return [t, f];
	};
}


///////////////////////////////////////////////////////////////////////////////

class uniform extends make
{
	static evalPdf(x, params)
	{
		const [a, b] = params;
		if(x < a || x > b) return 0;
		return 1 / (b - a);
	};

	static evalCdf(x, params)
	{
		const [a, b] = params;
		if(x < a) return 0;
		if(x > b) return 1;
		return (x-a) / (b-a);
	};

	static Quantile(p, params)
	{
		const [a, b] = params;
		return a + p * (b - a);
	};

	static Mean(params)
	{
		const [a, b] = params;
		return 0.5 * (a + b);
	};

	static Median(params)
	{
		const [a, b] = params;
		return (a + b) / 2;
	};

	static Variance(params)
	{
		const [a, b] = params;
		return Math.pow(b - a, 2) / 12;
	};

	static straightenCdf(x, p)
	{
		// f = m * t + h

		// CDF(x) = (x-a) / (b-a)
		// CDF(x) = x / (b-a) - a / (b-a)

		const f = p;
		const t = x;

		// m =  1 / (b-a)
		// h = -a / (b-a)

		return [t, f];
	};

}


///////////////////////////////////////////////////////////////////////////////

class triangular extends make
{
	static evalPdf(x, params)
	{
		const [a, b, c] = params;

		if(x < a) return 0;
		if(a <= x && x < c) return 2 * (x-a) / ((b-a) * (c-a));
		if(x === c) return 2 / (b-a);
		if(c < x && x <= b) return 2 * (b-x) / ((b-a) * (b-c));
		if(b < x) return 0;

		throw new RangeError(`evalPdf(${x}, ${params}): We're not supposed to be here`);
	};

	static evalCdf(x, params)
	{
		const [a, b, c] = params;

		if(x <= a) return 0;
		if(a < x && x <= c) return Math.pow(x-a, 2) / ((b-a) * (c-a));
		if(c < x && x < b)  return 1 - Math.pow(b-x, 2) / ((b-a) * (b-c));
		if(b <= x) return 1;

		throw new RangeError(`evalCdf(${x}, ${params}): We're not supposed to be here`);
	};

	static Quantile(p, params)
	{
		const [a, b, c] = params;

		const F = (c-a) / (b-a);

		if ( 0 < p && p < F  ) return a + Math.sqrt(     p*(b-a)*(c-a) );
		if ( F <= p && p < 1 ) return b - Math.sqrt( (1-p)*(b-a)*(b-c) );

		throw new RangeError(`Quantile(${x}, ${params}): We're not supposed to be here`);
	};

	static Mean(params)
	{
		const [a, b, c] = params;

		return (a + b + c) / 3;
	};

	static Median(params)
	{
		const [a, b, c] = params;

		if( c >= (a+b) /2 ) return a + Math.sqrt( (b-a)*(c-a)/2 );
		return b - Math.sqrt( (b-a)*(b-c)/2 );
	};

	static Variance(params)
	{
		const [a, b, c] = params;

		return (a*a + b*b + c*c - a*b - a*c - b*c) / 18;
	};

	static straightenCdf(x, p, params=[0, 100, 50])
	{
		// f = m * t + h

		const [a, b, c] = params; // a < c < b

		// TODO: x ∼ sqrt(p) : -sqrt(1-p) . Depends on params

		var f, t;

		if (x <= c)
		{
			// m =  1 / sqrt( (b-a) * (c-a) )
			// h = -a / sqrt( (b-a) * (c-a) )

			f = Math.sqrt(p);
			t = x;
		}
		else
		{
			// m = -1 / sqrt( (b-a) * (b-c) )
			// h =  b / sqrt( (b-a) * (b-c) )

			f = Math.sqrt(1 - p);
			t = x;
		}

		return [t, f];
	};
}


///////////////////////////////////////////////////////////////////////////////

class gumbel extends make
{
	static LOGLOG2 = Math.log( Math.log(2) );
	static PIPI6   = Math.pow( Math.PI, 2 ) / 6;

	static evalPdf(x, params=[0,1])
	{
		const [μ, β] = params;

		const z = (x - μ) / β;

		return Math.exp(-(z + Math.exp(-z))) / β;
	};

	static evalCdf(x, params=[0,1])
	{
		const [μ, β] = params;

		const z = (x - μ) / β;

		return Math.exp(-Math.exp(-z)) ;
	};

	static Quantile(p, params=[0,1])
	{
		const [μ, β] = params;

		return μ - β * Math.log(-Math.log(p));
	};

	static Mean(params=[0,1])
	{
		const [μ, β] = params;

		const γ = 0.57721566490153286060651209008240243104215933593992;

		return μ + β * γ;
	};

	static Median(params=[0,1])
	{
		const [μ, β] = params;

		return μ - β * this.LOGLOG2;
	};

	static Variance(params=[0,1])
	{
		const [μ, β] = params;

		return PIPI6 * Math.pow(β, 2);
	};

	static straightenCdf(x, p)
	{
		// f = m * t + h

		// log(-log(CDF)) = - (x - μ) / β;

		const f = Math.log(-Math.log(p));
		const t = x;

		// m = -1 / β
		// h =  μ / β

		return [t, f];
	};
}


///////////////////////////////////////////////////////////////////////////////

class graph
{
	static histLine(label="", m=1, b=0, range={xs:null, nDots:100, low:false, high:false, decimal:8})
	{
		// y = mx + b (m - slope, b - intercept)

		if (!("xs"      in range)) range.xs      = null;
		if (!("nDots"   in range)) range.nDots   = 100;
		if (!("low"     in range)) range.low     = false;
		if (!("high"    in range)) range.high    = false;
		if (!("decimal" in range)) range.decimal = 8;

		const xs = (range.xs===null) ?
			spreadDots(null, range.nDots, range.low, range.high, range.decimal) :
			range.xs.slice().sort( (a,b) => a-b );

		const hist = new Hist(null, label);
		xs.forEach( (x) => hist.Set(x, m * x + b) );

		return hist;
	};
}


///////////////////////////////////////////////////////////////////////////////

class statistic
{
	static RawMoment(xs, k, ddof=0)
	{
		// Computes the kth raw moment of xs

		return xs.reduce( (sum, x) => sum + Math.pow(x, k), 0) / (xs.length - ddof);
	};

	static CentralMoment(xs, k, mean=NaN, ddof=0)
	{
		// Computes the kth central moment of xs

		if ( isNaN(mean) ) mean = this.Mean(xs);
		return xs.reduce( (sum, x) => sum + Math.pow(x - mean, k), 0) / (xs.length - ddof);
	};

	static StandardizedMoment(xs, k, mean=NaN, std=NaN, variance=NaN, ddof=0)
	{
		// Computes the kth standardized moment of xs

		if ( isNaN(std) ) std = this.Std(xs, mean, variance, ddof);

		return this.CentralMoment(xs, k, mean, ddof) / Math.pow(std, k);
	};

	static Mean(xs)
	{
		return this.RawMoment(xs, 1);
	};

	static Variance(xs, mean=NaN, ddof=0)
	{
		return this.CentralMoment(xs, 2, mean, ddof);
	};

	static Std(xs, mean=NaN, variance=NaN, ddof=0)
	{
		if ( isNaN(variance) ) variance = this.Variance(xs, mean, ddof);

		return Math.sqrt(variance);
	};

	static Skewness(xs, mean=NaN, std=NaN, variance=NaN, ddof=0)
	{
		// Computes skewness

		return this.StandardizedMoment(xs, 3, mean, std, variance, ddof);
	};

	static Median(xs)
	{
		// Computes the median (50th percentile) of a sequence.

		// xs: sequence or anything else that can initialize a Cdf

		// returns: float

		const cdf = new Cdf(xs);
		return cdf.Value(0.5);
	};

	static IQR(xs)
	{
		// Computes the interquartile of a sequence

		// xs: sequence or anything else that can initialize a Cdf

		// returns: pair of floats

		const cdf = new Cdf(xs);
		return [cdf.Value(0.25), cdf.Value(0.75)];
	};

	static PearsonMedianSkewness(xs, median=NaN, mean=NaN, std=NaN, variance=NaN, ddof=0)
	{
		// Computes the Pearson median skewness

		if (isNaN(median)) median = this.Median(xs);
		if (isNaN(mean))   mean   = this.Mean(xs);
		if (isNaN(std))    std    = this.Std(xs, mean, variance, ddof);
		const gp = 3 * (mean - median) / std;

		return gp;
	};

	static Cov(xs, ys, meanx=NaN, meany=NaN, ddof=0)
	{
		// Computes Cov(X, Y)

		//     xs: sequence of values
		//     ys: sequence of values
		//     meanx: optional float mean of xs
		//     meany: optional float mean of ys

		if ( isNaN(meanx) ) meanx = this.Mean(xs);
		if ( isNaN(meany) ) meany = this.Mean(ys);

		const cov = xs.reduce( (sum, x, i) => sum + (x - meanx) * (ys[i] - meany), 0) / (xs.length - ddof);

		return cov;
	};

	static Corr(xs, ys, meanx=NaN, varx=NaN, meany=NaN, vary=NaN, ddof=0)
	{
		// Computes Corr(X, Y) = Pearson’s correlation

		//     xs: sequence of values
		//     ys: sequence of values

		if( isNaN(meanx) ) meanx = this.Mean(xs);
		if( isNaN(meany) ) meany = this.Mean(ys);
		if( isNaN( varx) )  varx = this.Variance(xs, meanx, ddof);
		if( isNaN( vary) )  vary = this.Variance(ys, meany, ddof);

		const corr = this.Cov(xs, ys, meanx, meany, ddof) / Math.sqrt(varx * vary);

		return corr;
	};

	static rank(xs)
	{
		const ranks  = xs
			.map ( (x, i) => [x, i] )
			.sort( (a, b) => b[0] - a[0] )
			.map ( ([x, i], r) => [i, r] )
			.sort( (a, b) => b[0] - a[0] )
			.map ( ([i, r]) => r + 1);

		return ranks;
	};

	static SpearmanCorr(xs, ys, ddof=0)
	{
		// Computes Spearman's rank correlation

		//     xs: sequence of values
		//     ys: sequence of values

		const xranks = this.rank(xs);
		const yranks = this.rank(ys);

		return this.Corr(xranks, yranks, ddof);
	};
}


///////////////////////////////////////////////////////////////////////////////

class matrix
{
	static invert(M)
	{
		// Returns the inverse of matrix `M`.

		// I use Guassian Elimination to calculate the inverse:
		// (1) 'augment' the matrix (left) by the identity (on the right)
		// (2) Turn the matrix on the left into the identity by elemetry row ops
		// (3) The matrix on the right is the inverse (was the identity matrix)

		// There are 3 elemtary row ops: (I combine b and c in my code)
		// (a) Swap 2 rows
		// (b) Multiply a row by a scalar
		// (c) Add 2 rows

		//if the matrix isn't square: exit (error)
		if(M.length !== M[0].length) throw new RangeError(`the matrix isn't square: ${M.length} != ${M[0].length}`);

		//create the identity matrix (I), and a copy (C) of the original
		const dim = M.length;
		const I = [], C = [];

		let i = 0, ii = 0, j = 0, e = 0, t = 0;

		for(i = 0; i < dim; i++)
		{
			// Create the row
			I[I.length] = [];
			C[C.length] = [];
			for(j = 0; j < dim; j++)
			{
				//if we're on the diagonal, put a 1 (for identity)
				I[i][j] = (i === j) ? 1 : 0;

				// Also, make the copy of the original
				C[i][j] = M[i][j];
			}
		}

		// Perform elementary row operations
		for(i = 0; i < dim; i++)
		{
			// get the element e on the diagonal
			e = C[i][i];

			// if we have a 0 on the diagonal (we'll need to swap with a lower row)
			if(e === 0)
			{
				// look through every row below the i'th row
				for(ii = i+1; ii < dim; ii++)
				{
					// if the ii'th row has a non-0 in the i'th col
					if(C[ii][i] !== 0)
					{
						//it would make the diagonal have a non-0 so swap it
						for(j = 0; j < dim; j++)
						{
							e = C[i][j];       // temp store i'th row
							C[i][j] = C[ii][j];// replace i'th row by ii'th
							C[ii][j] = e;      // repace ii'th by temp
							e = I[i][j];       // temp store i'th row
							I[i][j] = I[ii][j];// replace i'th row by ii'th
							I[ii][j] = e;      // repace ii'th by temp
						}
						// don't bother checking other rows since we've swapped
						break;
					}
				}
				// get the new diagonal
				e = C[i][i];

				// if it's still 0, not invertable (error)
				if(e === 0)
				{
					console.warn("error: not invertable");
					return;
				}
			}

			// Scale this row down by e (so we have a 1 on the diagonal)
			for(j = 0; j < dim; j++)
			{
				C[i][j] = C[i][j] / e; //apply to original matrix
				I[i][j] = I[i][j] / e; //apply to identity
			}

			// Subtract this row (scaled appropriately for each row) from ALL of
			// the other rows so that there will be 0's in this column in the
			// rows above and below this one
			for(ii = 0; ii < dim; ii++)
			{
				// Only apply to other rows (we want a 1 on the diagonal)
				if(ii === i) continue;

				// We want to change this element to 0
				e = C[ii][i];

				// Subtract (the row above(or below) scaled by e) from (the current row)
				// but start at the i'th column and assume all the stuff left of
				// diagonal is 0 (which it should be if we made this algorithm correctly)
				for(j = 0; j < dim; j++)
				{
					C[ii][j] -= e*C[i][j]; // apply to original matrix
					I[ii][j] -= e*I[i][j]; // apply to identity
				}
			}
		}

		// we've done all operations, 'C' should be the identity matrix, 'I' should be the inverse:
		return I;
	};


	static add(A, B)
	{
		// M = A + B

		const aRows = A.length,
			  aCols = A[0].length,
			  bRows = B.length,
			  bCols = B[0].length;

		if (aCols !== bCols || aRows !== bRows) throw new RangeError(`size mismatch: ${aRows}x${aCols} != ${bRows}x${bCols}`);

		const M = new Array(aRows);
		for (let r = 0; r < aRows; ++r)
		{
			M[r] = new Array(bCols);
			for (let c = 0; c < bCols; ++c)
			{
				M[r][c] = A[r][c] + B[r][c];
			}
		}
		return M;
	};

	static subtract(A, B)
	{
		// M = A - B

		const aRows = A.length,
			  aCols = A[0].length,
			  bRows = B.length,
			  bCols = B[0].length;

		if (aCols !== bCols || aRows !== bRows) throw new RangeError(`size mismatch: ${aRows}x${aCols} != ${bRows}x${bCols}`);

		const M = new Array(aRows);
		for (let r = 0; r < aRows; ++r)
		{
			M[r] = new Array(bCols);
			for (let c = 0; c < bCols; ++c)
			{
				M[r][c] = A[r][c] - B[r][c];
			}
		}
		return M;
	};

	static transpose(M)
	{
		const rows = M.length, cols = M[0].length;
		const T = [];
		for (let j = 0; j < cols; j++) T[j] = Array(rows);
		for (let i = 0; i < rows; i++)
		{
			for (let j = 0; j < cols; j++)
			{
				T[j][i] = M[i][j];
			}
		}
		return T;
	};


	static dot(A, B)
	{
		const aRows = A.length,
			  aCols = A[0].length,
			  bRows = B.length,
			  bCols = B[0].length;

		if (aCols !== bRows) throw new RangeError(`size mismatch: ${aCols} != ${bRows}`);

		const M = new Array(aRows);  // initialize array of rows

		for (let r = 0; r < aRows; ++r)
		{
			M[r] = new Array(bCols); // initialize the current row
			for (let c = 0; c < bCols; ++c)
			{
				M[r][c] = 0;            // initialize the current cell
				for (let i = 0; i < aCols; ++i)
				{
					M[r][c] += A[r][i] * B[i][c];
				}
			}
		}
		return M;
	};


	static determinant(M)
	{
		// Function to get the determinant of a matrix

		const n   = M.length;
		const mat = M.map( (row) => row.slice() );

		let det = 1;
		let total = 1;

		// Temporary array for storing row
		const temp = new Array(n + 1).fill(0);

		// Loop for traversing the diagonal elements
		for (let i = 0; i < n; i++)
		{
			let index = i;

			// Finding the index which has a non-zero value
			while (index < n && mat[index][i] === 0)
			{
				index++;
			}
			if (index === n)
			{
				continue; // The determinant of the matrix is zero
			}
			if (index !== i)
			{

				// Swapping the diagonal element row and index row
				for (let j = 0; j < n; j++)
				{
					[mat[index][j], mat[i][j]] = [mat[i][j], mat[index][j]];
				}

				// Determinant sign changes when we shift rows
				det *= Math.pow(-1, index - i);
			}

			// Storing the values of diagonal row elements
			for (let j = 0; j < n; j++)
			{
				temp[j] = mat[i][j];
			}

			// Traversing every row below the diagonal element
			for (let j = i + 1; j < n; j++)
			{
				const num1 = temp[i]; // Value of diagonal element
				const num2 = mat[j][i]; // Value of next row element

				// Traversing every column of row and multiplying
				// to every row
				for (let k = 0; k < n; k++)
				{
					// Making the diagonal element and next row
					// element equal
					mat[j][k] = (num1 * mat[j][k]) - (num2 * temp[k]);
				}
				total *= num1;
			}
		}

		// Multiplying the diagonal elements to get determinant
		for (let i = 0; i < n; i++)
		{
			det *= mat[i][i];
		}

		return (det / total); // Det(kA)/k = Det(A);
	};

}


"use strict";

///////////////////////////////////////////////////////////////////////////////
// This file contains class definitions for:
//
// _DictWrapper: "private" parent class for Hist and Pmf.
// Hist: represents a histogram (map from values to integer frequencies).
// Pmf: represents a probability mass function (map from values to probs).
//
// Cdf: represents a discrete cumulative distribution function
// Pdf: represents a continuous probability density function


///////////////////////////////////////////////////////////////////////////////

class UnimplementedMethodError extends Error
{
	// Exception if someone calls a method that should be overridden

	constructor(message)
	{
		super(message);
		this.name = "NotImplementedError";
	};
}

///////////////////////////////////////////////////////////////////////////////


class _DictWrapper
{
	// An object that contains a dictionary

	d     = null;
	label = "";

	constructor(obj=null, label="")
	{
		// Initializes the distribution

		//     obj: Hist, Pmf, Cdf, Pdf, Map, Array, ...
		//   label: string label

		this.label = label;
		this.d = new Map();

		if(obj === null) return;


		// treat obj like a list

		if ( obj.constructor === Array )
		{
			obj.forEach( (x) => this.Incr(x) );
		}
		else if (obj instanceof _DictWrapper)
		{
			for (const [val, prob] of obj.Items()) this.Set(val, prob);
		}
		else if (obj instanceof Map)
		{
			for (const [val, prob] of obj.entries()) this.Set(val, prob);
		}
		else if (obj instanceof Object)
		{
			for (const [val, prob] of Object.entries(obj)) this.Set(val, prob);
		}
		else
		{
			console.warn(`"${this.constructor.name}" constructor: Not implemented '${obj.constructor.name}' case!`);
			return;
		}
	};

	Set(x, y=0)
	{
		// Sets the freq/prob associated with the value x
		//     x: number value
		//     y: number freq or prob

		this.d.set(x, y);
	};

	Get(x, deflt=undefined)
	{
		// Gets the freq/prob associated with the value x
		// or deflt (if undefined)

		return this.d.has(x) ? this.d.get(x) : deflt;
	};

	Incr(x, term=1)
	{
		// Increments the freq/prob associated with the value x

		//     x: number value
		//     term: how much to increment by

		this.d.set(x, this.Get(x, 0) + term);
	};

	GetDict() { return this.d; };

	SetDict(d) { this.d = d; };

	Values()
	{
		// Gets an unsorted sequence of values.

		// Note: Hist/Pmf.Values     = this.d.keys
		//       Hist/Pmf.freq/probs = this.d.values

		return this.d.keys();
	};

	Items()
	{
		// Gets an unsorted sequence of (value, freq/prob) pairs

		return this.d.entries();
	}

	Copy(label="")
	{
		// Make a shallow copy of d.
		// label: string label for the new Hist/Pmf/...

		const aCopy = new this.constructor(null, label);
		aCopy.label = (label) ? label : this.label;
		if( Object.hasOwn(this, 'title') ) aCopy.title = this.title;
		this.d.forEach( (p, x) => aCopy.Set(x, p) );
		return aCopy;
	};

	Mult(x, factor)
	{
		// Scales the freq/prob associated with the value x.
		//   x: number value
		//   factor: how much to multiply by

		this.Set(x, this.Get(x, 0) * factor);
	};

	Total()
	{
		// Returns the total of the frequencies/probabilities in the map

		var total = 0;
		for (const [x, y] of this.Items()) { total += y; }
		return total;
	}

	Largest(n=10)
	{
		// Returns the largest n values, with frequency/probability
		//   n: number of items to return (from the end)

		return this.SortedItems().slice(-n);
	};

	Smallest(n=10)
	{
		// Returns the smallest n values, with frequency/probability.
		//    n: number of items to return (from the beginning)

		return this.SortedItems().slice(0, n);
	};

	Mean()
	{
		// Computes the mean of a PMF.
		// Returns: float mean

		var m = 0;
		for( const [x, p] of this.Items() ) m += p * x;
		return m;
	};

	Variance(mu=null)
	{
		// Computes the variance of a PMF.
		//     mu: the point around which the variance is computed;
		//         if omitted, computes the mean
		// returns: float variance

		if (mu === null) mu = this.Mean();
		var v = 0;
		for( const [x, p] of this.Items() ) v += p * Math.pow(x - mu, 2);

		return v;
	};

	Std(mu=null)
	{
		// Computes the standard deviation of a PMF
		//      mu: the point around which the variance is computed;
		//          if omitted, computes the mean
		// returns: float standard deviation

		const v = this.Variance(mu);
		return Math.sqrt(v);
	};

}

Object.assign(_DictWrapper.prototype, PlotMixin);

///////////////////////////////////////////////////////////////////////////////

class Hist extends _DictWrapper
{
	// Represents a histogram, which is a map from values to frequencies.
	// Values can be any hashable type; frequencies are integer counters.

	constructor(values=null, label="")
	{
		super(values, label);
	};

	Freq(x, deflt=0)
	{
		// Gets the frequency associated with the value x.
		//   x: number value
		//   returns int frequency

		return this.Get(x, deflt);
	};

	Freqs(xs)
	{
		// Gets frequencies for a sequence of values.

		var fs = new Array();
		Array.from(xs).forEach( (x) => fs.push( this.Freq(x) ), this );
		return fs;
	};
}


///////////////////////////////////////////////////////////////////////////////

class Pmf extends _DictWrapper
{
	// Represents a probability mass function.
	// Values can be any hashable type; probabilities are floating-point.
	// Pmfs are not necessarily normalized.

	constructor(values=null, label="")
	{
		// "values" can be an Array, Pmf, Hist, Map or Object

		super(values, label);

		if (!values) return;

		if(this.d.size === 0) return;
		this.Normalize();
	};

	Normalize(fraction=1)
	{
		// Normalizes this PMF so the sum of all probs is fraction.
		//   fraction: what the total should be after normalization
		//    Returns: the total probability before normalizing

		var total = this.Total();
		if (total == 0)
		{
			throw new RangeError( 'Normalize: total probability is zero.' );
			return total;
		}

		var factor = fraction / total;
		if (factor === 1) return total;

		this.d.forEach( (prob, x) => this.d.set(x, prob * factor), this );

		return total;
	};

	Prob(x, deflt=0)
	{
		// Gets the probability associated with the value x.
		//     x: number value
		//     deflt: value to return if the key is not there
		// Returns: float probability

		return this.Get(x, deflt);
	};

	Probs(xs)
	{
		// Gets probabilities for a sequence of values
		const ps = xs.map( (x) => this.Prob(x), this );
		return ps;
	};

	Modes(n=10)
	{
		// Returns array of n modes (most probable values)

		var a = [...this.GetDict()].sort( (a, b) => {return b[1]-a[1];} );
		return a.slice(0, n);
	}

	Mode()
	{
		// Returns the value with the highest probability

		var [val, maxp] = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
		for( const [v, p] of this.Items() )
		{
			if(p > maxp) [val, maxp] = [v, p];
		}
		return [val, maxp];
	};
}



///////////////////////////////////////////////////////////////////////////////

class Cdf
{
	// Represents a cumulative distribution function.

	// Attributes:
	//     xs: sequence of values
	//     ps: sequence of probabilities
	//     label: string used as a graph label.

	xs    = [];
	ps    = [];
	label = "";

	constructor(obj=null, ps=null, label="")
	{
		this.label = label;

		if (obj === null) return;

		if (obj && obj.constructor === Array)
		{
			if (ps && ps.constructor === Array)
			{
				if(obj.length === ps.length)
				{
					this.xs = obj.slice();
					this.ps = ps.slice();
				}
				else
				{
					throw new RangeError( "Cdf constructor: xs.length != ps.length" );
				}
			}
			else
			{
				var hist = new Hist(obj);
				this.ConstructFromItems( hist.Items() );
			}
		}
		else if (obj instanceof _DictWrapper || obj instanceof Pdf)
		{
			this.ConstructFromItems( obj.Items() );
		}
		else
		{
			throw new UnimplementedMethodError("Cdf constructor: not implemented");
		}
	};

	ConstructFromItems(xpItems)
	{
		this.xs = [];
		this.ps = [];

		var runsum = 0;
		var sorted = [];

		// Skipping NaNs
		[...xpItems].forEach( (item) => { if(!isNaN(item[0])) sorted.push(item); } );

		sorted.sort( (a, b) => a[0] - b[0] );

		sorted.forEach( ([x, p]) => {
			this.xs.push(x);
			runsum += p;
			this.ps.push(runsum);
		}, this);

		for(var i = 0; i < this.ps.length; i++) this.ps[i] = this.ps[i] / runsum;
	};

	Values() { return this.xs; };

	Probs()  { return this.ps; };

	Items()
	{
		// Returns a sorted array of [value, probability] pairs.
		var items = this.xs.map( (x, i) => {return [x, this.ps[i]];}, this );
		items.sort( (a, b) => {return a[0] - b[0];} );
		return items;
	};

	Prob(x)
	{
		// Returns CDF(x), the probability that corresponds to value x.
		//   x: number
		//   Returns: float probability

		if (x < this.xs[0]) return 0;

		var index = bisectRight(this.xs, x);
		var p = this.ps[index - 1];

		return p;
	};

	Value(p)
	{
		// Returns InverseCDF(p), the value that corresponds to probability p.
		//    p: number in the range [0, 1]
		//    Returns: number value

		if (p < 0 || p > 1)
		{
			throw new RangeError('Probability p must be in range [0, 1]');
		}

		var index = bisectLeft(this.ps, p);

		return this.xs[index];
	};

	Percentile(p)
	{
		// Returns the value that corresponds to percentile p.
		//   p: number in the range [0, 100]
		//   Returns: number value

		return this.Value(p / 100);
	};

	PercentileRank(x)
	{
		// Returns the percentile rank of the value x
		//   x: potential value in the CDF
		//   returns: percentile rank in the range 0 to 100

		return this.Prob(x) * 100;
	};

	CredibleInterval(percentage=90)
	{
		// Computes the central credible interval.
		// If percentage=90, computes the 90% CI.
		//   Args: percentage: float between 0 and 100
		//   Returns: sequence of two floats, low and high

		var prob = (1 - percentage / 100) / 2 ;
		var interval = [this.Value(prob), this.Value(1 - prob)] ;
		return interval;
	};

	Median()
	{
		// Computes the median

		return this.Percentile(50);
	};

	IQR()
	{
		// The interquartile range (IQR) is the difference
		// between the 75th and 25th percentiles

		return this.Percentile(75) - this.Percentile(25);
	};

	Copy(label="")
	{
		// Returns a copy of this Cdf.
		//   label: string label for the new Cdf

		if (!label) label = this.label;
		return new this.constructor(this.xs, this.ps, label);
	};

	Random()
	{
		// Chooses a random value (=quantile) from this distribution

		return this.Value(Math.random());
	};

	Sample(n, sort=true)
	{
		// Generates a random sample (of quantiles) from this distribution
		//     n: int length of the sample

		const sample = Array.from({length: n}, (_) => this.Random(), this);
		if (sort) sample.sort( (a,b) => a - b );
		return sample;
	};

	Mean()
	{
		// """Computes the mean of a CDF.

		var old_p = 0;
		var mu = 0;

		this.xs.forEach( (x, i) => {
			var p = this.ps[i] - old_p;
			mu += p * x;
			old_p = this.ps[i];
		}, this);

		return mu;
	};

	Variance(mu=null)
	{
		// Computes the variance of a CDF

		if (mu === null) mu = this.Mean();
		var v = 0;

		var old_p = 0;
		var v = 0;

		this.xs.forEach( (x, i) => {
			var p = this.ps[i] - old_p;
			v += p * Math.pow(x - mu, 2);
			old_p = this.ps[i];
		}, this);

		return v;
	};

	Std(mu=null)
	{
		// Computes the standard deviation of a CDF

		const v = this.Variance(mu);
		return Math.sqrt(v);
	};

}

Object.assign(Cdf.prototype, PlotMixin);


///////////////////////////////////////////////////////////////////////////////

class Pdf
{
	// Represents a probability density function (PDF)

	Density(x)
	{
		// Evaluates this Pdf at x.

		throw new UnimplementedMethodError();
	};

	GetLinspace()
	{
		// Get a linspace for plotting.

		// Not all subclasses of Pdf implement this.

		throw new UnimplementedMethodError();
	};

	MakePmf(label="", n=101, low=false, high=false)
	{
		// Makes a discrete version of this Pdf.

		// label: string
		// low: low end of range
		// high: high end of range
		// n: number of places to evaluate

		const [xs, ds] = this.Render(null, n, low, high);
		const zip = xs.map( (x, i) => [x, ds[i]] );
		return new Pmf(new Map(zip), label);
	};

	Render(xs=null, n=101, low=false, high=false)
	{
		// Generates a sequence of points suitable for plotting.

		// If options includes low and high, it must also include n;
		// in that case the density is evaluated an n locations between
		// low and high, including both.

		// If options includes xs, the density is evaluate at those location.

		// Otherwise, this.GetLinspace is invoked to provide the locations.

		// Returns: tuple of (xs, densities)

		if (low && high) xs = spreadDots(null, n, low, high);
		else if (!xs) xs = this.GetLinspace();

		const ds = this.Density(xs);

		return [xs, ds];
	};

	Items()
	{
		// Generates a sequence of [value, probability] pairs

		const [xs, ds] = this.Render();
		return xs.map( (x, i) => [x, ds[i]] );
	};
}

Object.assign(Pdf.prototype, PlotMixin);


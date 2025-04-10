///////////////////////////////////////////////////////////////////////////////
// This file contains class definitions for:
// _DictWrapper: "private" parent class for Hist and Pmf.
// Hist: represents a histogram (map from values to integer frequencies).
// Pmf: represents a probability mass function (map from values to probs).
//
// Cdf: represents a discrete cumulative distribution function
// Pdf: represents a continuous probability density function



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

		if (!values) return;

		values.forEach( (x) => this.Incr(x) );
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
		Array.from(xs).forEach( (x) => fs.push( Freq(x) ) );
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
"use strict";

//////////////////////////////////////////////////////////////////////
// 2.1 Histograms
//////////////////////////////////////////////////////////////////////

class _DictWrapper
{
    // An object that contains a dictionary

	d     = null;
	label = "";

    constructor(obj=null, label="")
    {
        // Initializes the distribution

        //     obj: Hist, Pmf, Cdf, Pdf, dict, array, ...
        //   label: string label

        this.label = label;
        this.d = new Map();

        // treat obj like a list
        // this.d.update(Counter(obj))
    };

    GetDict()
    {
        // Gets the dictionary

        return this.d;
    };

    SetDict(d)
    {
        // Sets the dictionary

        this.d = d;
    };

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

    SortedItems(reverse=false)
    {
        // Gets a sorted Array of [value, freq/prob] pairs.
        // If items are unsortable, the result is unsorted.

        var fNaN  = false;
        var items = [...this.d.entries()];

        items.sort( (a, b) => {
        	if( !fNaN ) { if ( isNaN(a[0]) || isNaN(b[0]) ) fNaN = true; }
        	return ((reverse) ? b[0] - a[0] : a[0] - b[0]);
        });

        if( fNaN )
        {
    		var msg = "Keys contain NaN, may not sort correctly.";
            console.warn(`"${this.label}"`, msg);
        }

        return items;
    };

    ChartData(options={type:"line"}, skipNaN=true)
    {
        // Generates a chartData object tht contains
        // a sequence of points suitable for plotting,
        // the legend, etc.

    	var type = ("type" in options) ? options["type"] : "line";
		var legendText = this.label;

		const d = { type: type, showInLegend: false };

		if (legendText)
		{
			d.showInLegend = true;
			d.legendText = legendText;
		}

		const xy = [];
		for( const [i, [x, y]] of this.SortedItems().entries() )
        {
            if( skipNaN && isNaN(x) ) continue;
            xy.push({ "x": x, "y": y });
        }
		d.dataPoints = xy;

		for (let key in options) if (options.hasOwnProperty(key)) d[key] = options[key];

        return d;
    };

    Print()
    {
        // Prints the values and freqs/probs in ascending order

        for( const [i, [v, p]] of this.SortedItems().entries() ) console.log(v, p);
    };

    Set(x, y=0)
    {
        // Sets the freq/prob associated with the value x
        //     x: number value
        //     y: number freq or prob

        this.d.set(x, y);
    };

    Incr(x, term=1)
    {
        // Increments the freq/prob associated with the value x

        //     x: number value
        //     term: how much to increment by

        this.d.set( x, (this.d.has(x) ? this.d.get(x) : 0) + term );
    };

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


class Hist extends _DictWrapper
{
	// Represents a histogram, which is a map from values to frequencies.
	// Values can be any hashable type; frequencies are integer counters.

    constructor(values=[], label="")
	{
		super(values, label);

		values.forEach( (x) => this.Incr(x) );
	};

	Freq(x)
	{
	    // Gets the frequency associated with the value x.
	    //   x: number value
	    //   returns int frequency

	    return (this.d.has(x) ? this.d.get(x) : 0);
	};

	Freqs(xs)
	{
	    // Gets frequencies for a sequence of values.

		var fs = new Array();
		Array.from(xs).forEach( (x) => fs.push( Freq(x) ) );
	    return fs;
	};
}
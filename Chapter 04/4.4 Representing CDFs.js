///////////////////////////////////////////////////////////////////////////////
// 4.4 Representing CDFs
//

CleanFemPreg();

///////////////////////////////////////////////////////////////////////////////

class Cdf
{
    // Represents a cumulative distribution function.

    // Attributes:
    //     xs: sequence of values
    //     ps: sequence of probabilities
    //     label: string used as a graph label.

	xs    = null;
	ps    = null;
	label = "";

	constructor(xs=null, ps=null, label="")
	{
		this.label = label;

		if (xs === null) return;

		if (xs && xs.constructor === Array)
		{
			if (ps && ps.constructor === Array)
			{
				if(this.xs.length === this.ps.length)
				{
					this.xs = xs.slice();
					this.ps = ps.slice();
				}
				else
				{
					throw new RangeError( "Cdf: xs.length != ps.length" );
				}
			}
			else
			{
				var hist = new Hist(xs);

				var runsum = 0;
				this.xs = [];
				this.ps = [];

				var sorted = [];

				// Skipping NaNs
				[...hist.Items()].forEach( (item) => { if(!isNaN(item[0])) sorted.push(item); } );

				sorted.sort( (a, b) => a[0] - b[0] );

				sorted.forEach( ([x, p]) => {
					this.xs.push(x);
					runsum += p;
					this.ps.push(runsum);
				}, this);

				for(var i = 0; i < this.ps.length; i++) this.ps[i] = this.ps[i] / runsum;
			}
		}
	};

	Values() { return this.xs; };

	Items()
	{
		// Returns a sorted array of [value, probability] pairs.
		var items = this.xs.map( (x, i) => [x, this.ps[i]], this );
		items.sort( (a, b) => {return a[0] - b[0];} );
		return items;
	};

	Prob(x)
	{
		// Returns CDF(x), the probability that corresponds to value x.
		//   Args:    x: number
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
		//   Args: p: number in the range [0, 100]
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
        // Chooses a random value from this distribution

        return this.Value(Math.random());
    };

    Mean()
    {
        // """Computes the mean of a CDF.

        var old_p = 0;
        var total = 0;

        this.xs.forEach( (x, i) => {
        	var p = this.ps[i] - old_p;
            total += p * x;
            old_p = this.ps[i];
        }, this);

        return total;
    };

}

Object.assign(Cdf.prototype, PlotMixin);


///////////////////////////////////////////////////////////////////////////////

(function() {

	const title = "4.7 Random numbers";

	console.log(`\r\n< \x1B[1m${title}\x1B[m >`);

	///

	const preg = nsfg_2002FemPreg;

	var live   = {prglngth:[]};
	var firsts = {prglngth:[]};
	var others = {prglngth:[]};

	preg.prglngth.data.forEach( (weeks, i) => {
		if(preg.outcome.data[i] === 1)
		{
			live.prglngth.push(weeks);
			if (preg.birthord.data[i] === 1) firsts.prglngth.push(weeks);
			else others.prglngth.push(weeks);
		}
	});

	var cdf = new Cdf(live.prglngth, null, "prglngth");
	var plotData = [cdf.ChartData({type:"stepLine"})];
	var axes = {
		x:{title:"Pregnancy length (weeks)"},
		y:{title:"CDF"}
	};
	var caption = "Figure 4.3: CDF of pregnancy length";
	renderPlot(caption, plotData, "chart_", axes);


})();

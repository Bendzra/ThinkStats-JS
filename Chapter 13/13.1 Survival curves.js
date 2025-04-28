"use strict";

// 13.1 Survival curves


/////////////////////////////////////////////

class SurvivalFunction
{
	constructor(cdf, label='')
	{
		this.cdf = cdf;
		this.label = label || cdf.label;

		this.ts = this.cdf.Values();
		this.ss = this.cdf.Probs().map( (p) => 1 - p );
	};

	Prob(t) { return 1 - this.cdf.Prob(t); };

	Items()
	{
		// Returns a sorted array of [value, probability] pairs

		const items = this.ts.map( (t, i) => {return [t, this.ss[i]];}, this );
		items.sort( (a, b) => {return a[0] - b[0];} );

		return items;
	};

	MakeHazard(label='')
	{
		// Computes the hazard function:
		// λ(t) = [S(t) - S(t+1)] / S(t) = PMF(t) / S(t)

		// This simple version does not take into account the
		// spacing between the ts.  If the ts are not equally
		// spaced, it is not valid to compare the magnitude of
		// the hazard function across different time steps.

		// label: string

		// returns: HazardFunction object

		const λs = [];
		const ts = [];

		for(let i = 0; i < this.ts.length - 1; i++)
		{
			const t = this.ts[i];
			const s = this.ss[i];

			ts.push( t );
			λs.push( (s - this.ss[i+1]) / s );
		}

		return new HazardFunction(ts, λs, label);
	};

}

Object.assign(SurvivalFunction.prototype, PlotMixin);



/////////////////////////////////////////////

class HazardFunction extends Cdf
{
	constructor(ts, λs, label)
	{
		super(ts, λs, label);
	};

	MakeSurvival(label='')
	{
		// Makes the survival function
		// [1 − λ(0)][1 − λ(1)] ... [1 − λ(t)]

		const ts = this.Values();
		const λs = this.Probs();

		let ss = [ 1 - λs[0] ];
		for(let i = 1; i < λs.length; i++)
		{
			ss.push( ss[i-1] * (1 - λs[i]) );
		}
		ss = ss.map( (s) => 1 - s );
		const sf = new SurvivalFunction(new Cdf(ts, ss, label));

		return sf;
	};
}

/////////////////////////////////////////////

(function() {

	const title = "13.1 Survival curves";

	printTitle(title);


	/////////////////////////////////////////////


	const preg = nsfg_2002FemPreg;

	const COMPLETE_PREGNANCIES = (i) => (preg.outcome.data[i] === 1 || preg.outcome.data[i] === 3 || preg.outcome.data[i] === 4);
	const complete = dropna( preg, ["prglngth"], COMPLETE_PREGNANCIES ).prglngth;

	// console.log(complete);

	const cdf = new Cdf(complete, null, 'cdf');
	const sf = new SurvivalFunction(cdf, 'survival');

	console.log(" sf[13] =", sf.Prob(13).fixFloat(5));
	console.log("cdf[13] =", cdf.Prob(13).fixFloat(5));

	var plotData = [];
	plotData.push(cdf.ChartData({type:"line"}));
	plotData.push(sf.ChartData({type:"line"}));
	var axes = {
		x:{title:'t (weeks)'},
		y:{title:" "}
	};
	var caption = `Figure 13.1: Cdf and survival curve for pregnancy length`;
	renderPlot(caption, plotData, `chart_1_`, axes);


	/////////////////////////////////////////////

	var subtitle = "13.2 Hazard function";

	printTitle(subtitle);

	/////////////////////////////////////////////


	const hf = sf.MakeHazard('hazard');

	console.log(" hf[39] =", hf.Prob(39).fixFloat(5));

	var plotData = [];
	plotData.push(hf.ChartData({type:"line"}));
	var axes = {
		x:{title:'t (weeks)'},
		y:{title:" "}
	};
	var caption = `Hazard curve for pregnancy length`;
	renderPlot(caption, plotData, `chart_2_`, axes);


})();

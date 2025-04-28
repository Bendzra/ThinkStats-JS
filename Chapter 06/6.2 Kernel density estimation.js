"use strict";

// 6.2 Kernel density estimation

class GaussianKde
{
	#mu       = 0;     // expectation (= mean = median)
	#sigma    = 1;     // standard deviation
	#variance = 1;     //
	#iqr      = 27/20; // interquartile range
	#h        = 1.06;  // bandwidth
	#xs       = null;
	#diHH     = 2;
	#diNH     = 0;

	constructor(sample)
	{
		if ( !sample || sample.length < 3 )
		{
			throw new RangeError("Error! Please ensure that there are a minimum of 3 values in your data set.");
		}
		this.#xs = sample.slice(0);
		this.#xs = this.#xs.sort( (a, b) => a - b );

		this.setMU( this.estimateMU(this.#xs) );
		this.setSigma( this.estimateSigma(this.#xs, this.#mu) );
		this.setIQR( this.estimateIQR(this.#xs) );
		this.setBandwidth( this.estimateBandwidth(this.#xs, this.#sigma, this.#iqr) );
	};

	setBandwidth(h)
	{
		this.#h = h;
		this.#diHH  = 2 * this.#h * this.#h;
		this.#diNH  = this.#xs.length * this.#h * Math.sqrt(2 * Math.PI);

		// console.log ("h = ", this.#h);
	};

	estimateMU(dataset)
	{
		let sum = dataset.reduce((partialSum, a) => partialSum + a, 0);
		return sum / dataset.length;
	};

	setMU(mu)
	{
		this.#mu = mu;
		// console.log ("mu = ", this.#mu);
	};

	estimateSigma(dataset, mu)
	{
		let sum = dataset.reduce((partialSum, a) => partialSum + Math.pow(a - mu, 2), 0);
		this.#variance = sum / dataset.length;
		return Math.sqrt(this.#variance);
	};

	setSigma(sigma)
	{
		this.#sigma = sigma;
		this.#variance = sigma * sigma;

		// console.log ("sigma = ", this.#sigma);
		// console.log ("variance = ", this.#variance);
	};

	estimateBandwidth(dataset, sigma, iqr)
	{
		return 0.9 * Math.min(sigma, iqr/1.34) * Math.pow(dataset.length, -1/5);
	};

	estimateIQR(dataset)
	{
		var l  = dataset.length;
		var r  = l % 2 ;

		var k2 = Math.floor(l / 2);
		var q2 = ( r ) ? q2 = dataset[k2] : (dataset[k2] + dataset[k2-1]) / 2;

		var k1 = Math.floor(k2 / 2);
		var q1 = 0;

		var k3 = k2 + r + k1;
		var q3 = 0;

		if (k2 % 2)
		{
			q1 = dataset[k1];
			q3 = dataset[k3];
		}
		else
		{
			q1 = (dataset[k1] + dataset[k1-1]) / 2;
			q3 = (dataset[k3] + dataset[k3-1]) / 2;
		}
		return q3 - q1;
	};

	setIQR(iqr)
	{
		this.#iqr = iqr;
		// console.log ("iqr = ", this.#iqr);
	};

	evaluate(xs)
	{
		const diHH = this.#diHH;
		const diNH = this.#diNH;

		var y = ((ts, x) => ts.reduce( (sum, t) => sum + Math.exp( (t - x) * (x - t) / diHH ), 0) / diNH );

		if ( xs.constructor === Array ) return xs.map( (x) => y(this.#xs, x), this);
		else return y(this.#xs, xs);
	};
}

class EstimatedPdf extends Pdf
{
	// Represents a PDF estimated by KDE

	constructor(sample, label="")
	{
		super();

		// """Estimates the density function based on a sample.

		// sample: sequence of data
		// label: string

		this.label = label;
		this.kde = new GaussianKde(sample);

		const [low, high] = sample.minmax();

		this.linspace = spreadDots(null, 101, low, high);
	};

	GetLinspace()
	{
		// Get a linspace for plotting.

		// Returns: numpy array

		return this.linspace;
	};

	Density(xs)
	{
		// Evaluates this Pdf at xs

		// returns: float or NumPy array of probability density

		return this.kde.evaluate(xs);
	};

	Sample(n)
	{
		// Generates a random sample from the estimated Pdf.

		// n: size of sample

		throw new UnimplementedMethodError("For now: use CDF");
	};
}

(function() {

	const title = "6.2 Kernel density estimation";

	printTitle(title);

	var [mean, variance] = [163, 52.8];
	var std = Math.sqrt(variance);

	var n = 500;

	var pdf = new NormalPdf(mean, std, "normal");

	var sample = Array.from({length: n}, (_) => gauss.Variate([mean, std]) );
	var sample_pdf = new EstimatedPdf(sample, 'sample KDE');

	var plotData = [];

	plotData.push(pdf.ChartData({type:"line"}));
	plotData.push(sample_pdf.ChartData({type:"line"}));
	var axes = {
		x:{title:`x`},
		y:{title:"PDF & KDE"}
	};
	var caption = `Figure 6.1: A normal PDF that models adult female height in the U.S., and the kernel density estimate of a sample with n = ${n}`;
	renderPlot(caption, plotData, "chart_", axes);



})();



// 6.1 PDFs

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

///////////////////////////////////////////////////////////////////////////////

class NormalPdf extends Pdf
{
	constructor(mu=0, sigma=1, label='')
	{
		super();

		this.mu    = mu;
		this.sigma = sigma;
		this.label = label;
	};

	Density(xs)
	{
		if ( xs.constructor === Array ) return xs.map( (x) => gauss.evalPdf(x, [this.mu, this.sigma]), this);
		else return gauss.evalPdf(xs, [this.mu, this.sigma]);
	}

	GetLinspace(nDots=101, nSpans=3)
	{
		const low  = this.mu - nSpans * this.sigma;
		const high = this.mu + nSpans * this.sigma;
		return spreadDots(null, nDots, low, high);
	}
}

(function() {

	const title = "6.1 PDFs";

	printTitle(title);

	var [mean, variance] = [163, 52.8];
	var std = Math.sqrt(variance);
	var pdf = new NormalPdf(mean, std, "PDF");

	console.log( pdf.Density(mean + std).fixFloat() );

	var pmf = pdf.MakePmf("PMF");

	var plotData = [];

	plotData.push(pdf.ChartData({type:"line"}));
	plotData.push(pmf.ChartData({type:"column"}));
	var axes = {
		x:{title:`x`},
		y:{title:"PDF & PMF"}
	};
	renderPlot("Normal PDF & PMF", plotData, "chart_", axes);


})();



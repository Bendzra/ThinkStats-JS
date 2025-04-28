"use strict";

// 6.1 PDFs


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

///////////////////////////////////////////////////////////////////////////////


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



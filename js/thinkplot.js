"use strict";

//////////////////////////////////////////////////////////////////////

// Plotting histograms

//////////////////////////////////////////////////////////////////////

const PlotMixin = {

	SortedItems(skipNaNs=true, reverse=false)
	{
		// Gets a sorted Array of [value, freq/prob] pairs.
		// If items are unsortable, the result is unsorted.

		let fNaN  = false;
		let items = [...this.Items()];

		if(skipNaNs)
		{
			items = items.filter( ([x,y]) => !isNaN(x) && !isNaN(y) );
		}

		items.sort( (a, b) => {
			if( !fNaN ) { if ( isNaN(a[0]) || isNaN(b[0]) ) fNaN = true; }
			return ((reverse) ? b[0] - a[0] : a[0] - b[0]);
		});

		if( fNaN )
		{
			const msg = "Keys contain NaN, may not sort correctly.";
			console.warn(`"${this.label}"`, msg);
		}

		return items;
	},

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

		this.SortedItems(skipNaN).forEach( ([x, y]) => {
			if( skipNaN && (isNaN(x) || isNaN(y)) ) return;
			xy.push({ "x": x, "y": y });
		});
		d.dataPoints = xy;

		for (let key in options) if (options.hasOwnProperty(key)) d[key] = options[key];

		return d;
	},

	Print(skipNaNs=true, reverse=false)
	{
		// Prints the values and freqs/probs in ascending order

		for( const [i, [v, p]] of this.SortedItems(skipNaNs, reverse).entries() ) console.log(v, p);
	}

};

//////////////////////////////////////////////////////////////////////

function createDiv(prefix, titleSlug, className="info")
{
	var id = prefix + titleSlug;
	var oDiv = document.getElementById(id);
	if ( oDiv ) return oDiv;

	oDiv = document.createElement("div");
	oDiv.setAttribute("class", className);
	oDiv.setAttribute("id", id);
	document.body.appendChild(oDiv);
	return oDiv;
}

function slugify(text)
{
	return text
		.toString()                     // Cast to string
		.toLowerCase()                  // Convert the string to lowercase letters
		.normalize('NFD')       		// The normalize() method returns the Unicode Normalization Form of a given string.
		.trim()                         // Remove whitespace from both sides of a string
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

function jsFileName()
{
	var currentScriptFileName = null;
	var scripts = document.getElementsByTagName("script");
	var currentScriptUrl = (document.currentScript || scripts[scripts.length - 1]).src;
	var re = /\/([^\/]+)\.js$/i;
	var arr = re.exec(currentScriptUrl);
	if(arr) currentScriptFileName = arr[1];
	return currentScriptFileName;
}

function guid()
{
	var currentScriptFileName = jsFileName();
	if(currentScriptFileName) return currentScriptFileName;

	function _p8(s)
	{
		var p = ( Math.random().toString(16) + "000000000").substr(2,8);
		return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
	}
	return _p8() + _p8(true) + _p8(true) + _p8();
}

//////////////////////////////////////////////////////////////////////

function printTitle(title)
{
	const div = createDiv("title_", slugify(title));
	console.log('\r\n< \x1B[1m' + title + '\x1B[m >');
	div.outerHTML = "<h2>" + title + "</h2>";
}

//////////////////////////////////////////////////////////////////////

function renderPlot(title, plotData, divPrefix="chart_", axes={}, dim={height:370, width:920})
{
	// --- chart --- //

	// plotData: array of chartData objects containing points, legemd, etc.

	var chartDiv = createDiv( divPrefix, slugify( guid()), "chart" );
	chartDiv.style.cssText = `height:${dim.height}px; max-width:${dim.width}px;`;

	var o = {
		x: { title: "Hypotheses",  suffix:"" },
		y: { title: "Probability", suffix:"" }
	};

	if(typeof axes === 'object' && !Array.isArray(axes) && axes !== null)
	{
		if( !(axes.x) ) o.x = { title: "Hypotheses",  suffix:"" };
		else
		{
			for(var k in axes.x) o.x[k] = axes.x[k];
			o.x.title  = ( !(axes.x.title) )  ? "Hypotheses" : axes.x.title;
			o.x.suffix = ( !(axes.x.suffix) ) ? ""           : axes.x.suffix;
		}
		if( !(axes.y) ) o.y = { title: "Probability", suffix:"" };
		else
		{
			for(var k in axes.y) o.y[k] = axes.y[k];
			o.y.title  = ( !(axes.y.title) )  ? "Probability" : axes.y.title;
			o.y.suffix = ( !(axes.y.suffix) ) ? ""            : axes.y.suffix;
		}
	}

	var chart = new CanvasJS.Chart(chartDiv.id, {
		animationEnabled: false,
		zoomEnabled: true,
		title: {
			text: title
		},
		legend: {
			horizontalAlign: "right",
			verticalAlign: "top",
			dockInsidePlotArea: true
		},
		axisX: o.x,
		axisY: o.y,
		data: plotData
	});

	chart.render();
}


//////////////////////////////////////////////////////////////////////

function addVericals(plotData, verticals)
{
	let [ymin, ymax] = [Infinity, -Infinity];

	plotData.forEach( (pd) => {
		pd.dataPoints.forEach( (point) => {
			if(ymin > point.y) ymin = point.y;
			if(ymax < point.y) ymax = point.y;
		});
	});

	verticals.forEach( (v) => {
		let label = Object.keys(v)[0];
		let x = v[label];
		let d = {
			type: "line",
			markerSize: 0,
			showInLegend: true,
			legendText: label,
			dataPoints: [{"x": x, "y": ymin}, {"x": x, "y": ymax}]
		}
		plotData.push(d);
	});

	return plotData;
}

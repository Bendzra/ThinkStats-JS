//////////////////////////////////////////////////////////////////////

// 2.3 Plotting histograms

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

"use strict";

//////////////////////////////////////////////////////////////////////

// 2.3 Plotting histograms

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

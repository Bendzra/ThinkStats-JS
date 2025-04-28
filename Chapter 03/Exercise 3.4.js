"use strict";

// Exercise 3.4

function ObservedPmf(pmf, speed, label="")
{
	const new_pmf = pmf.Copy(label);
	for( const [x, p] of pmf.Items() )
	{

		new_pmf.Mult(x, Math.abs(x - speed));
	}
	new_pmf.Normalize();
	return new_pmf;

}

function ConvertPaceToSpeed(pace)
{
    // Converts pace in MM:SS per mile to MPH

    var ms = pace.split(":");
    var secs = parseInt(ms[0], 10) * 60 + parseInt(ms[1], 10);
    var mph  = 1 / secs * 60 * 60;
    return mph;
}

function BinData(data, low, high, n)
{
    // """Rounds data off into bins.

    // data: sequence of numbers
    // low: low value
    // high: high value
    // n: number of bins

    // returns: sequence of numbers

	for(var i = 0; i < data.length; i++)
	{
		var d = data[i];
		d = (d - low) * n / (high - low);
		d = Math.round(d);
		d = d * (high - low) / n + low;
		data[i] = fixFloat(d, 2);
	}
    return data;
}

(function() {

	const title = "Exercise 3.4";

	printTitle(title);

	const speeds = relay_Apr25_27thAn_set1.Pace.data.map( (pace) => { return ConvertPaceToSpeed(pace); });
	BinData(speeds, 3, 12, 100);

	const actual_pmf = new Pmf(speeds, 'actual');

	const speed = 6.7;
	const biased_pmf = ObservedPmf(actual_pmf, speed, "observed");

	var plotData = [];
	plotData.push(actual_pmf.ChartData({type:"stepArea"}));
	plotData.push(biased_pmf.ChartData({type:"stepArea"}));
	var axes = {
		x:{title:"speed"},
		y:{title:"probability"}
	};
	var caption = "Distribution of speeds";
	renderPlot(caption, plotData, "chart_speeds_", axes);


})();


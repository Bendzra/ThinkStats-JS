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

(function() {

	const title = "Exercise 3.4";

	console.log('\r\n< \x1B[1m' + title + '\x1B[m >');

	const speeds = Apr25_27thAn_set1;
	const actual_pmf = new Pmf(speeds, 'actual');

	const speed = 6.7;
	const biased_pmf = ObservedPmf(actual_pmf, speed, label="observed");

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


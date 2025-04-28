"use strict";

// 13.5 The marriage curve

///////////////////////////////////////////////////////////////////////////////

function _married()
{
	const resp = nsfg_2002FemResp;

	const woman = dropna( resp, ['cmbirth', 'cmintvw', 'cmmarrhx', 'evrmarry'], null, false);

	woman['agemarry'] = [];
	woman['age']      = [];

	woman.cmmarrhx.forEach( (_, i) => {
		woman['agemarry'].push( fixFloat((woman.cmmarrhx[i] - woman.cmbirth[i]) / 12) );
		woman['age'].push(fixFloat((woman.cmintvw[i] - woman.cmbirth[i]) / 12));
	});

	return woman;
}

const woman = _married();

///////////////////////////////////////////////////////////////////////////////


(function() {

	const title = "13.5 The marriage curve";

	printTitle(title);


	/////////////////////////////////////////////


	const complete = woman.agemarry.filter( (x, i) => !isNaN(x) && woman.evrmarry[i] === 1 );
	const ongoing  = woman.age.filter( (x, i) => !isNaN(x) && woman.evrmarry[i] === 0 );

	const hf = EstimateHazardFunction(complete, ongoing);

	var plotData = [];
	plotData.push(hf.ChartData({type:"line"}));
	var axes = {
		x:{title:'age (years)'},
		y:{title:"hazard"}
	};
	var caption = `Figure 13.2: Hazard function for age at first marriage`;
	renderPlot(caption, plotData, `chart_1_`, axes);


	/////////////////////////////////////////////

	const subtitle = "13.6 Estimating the survival curve";

	printTitle(subtitle);

	/////////////////////////////////////////////


	const sf = hf.MakeSurvival();

	var plotData = [];
	plotData.push(sf.ChartData({type:"line"}));
	var axes = {
		x:{title:'age (years)'},
		y:{title:"prob unmarried"}
	};
	var caption = `"survival curve" for age at first marriage`;
	renderPlot(caption, plotData, `chart_2_`, axes);


})();

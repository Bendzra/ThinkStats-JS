"use strict";

// 7.1 Scatter plots

(function() {

	const title = "7.1 Scatter plots";

	printTitle(title);


	/////////////////////////////////////////////

	function SampleRows(df, nrows, replace=false)
	{
		const L = df[ Object.keys(df)[0] ].data.length;
		var indices = null;

		if(!replace)
		{
			indices = shuffle( Array.from({length: L}, (_, i) => i), nrows );
		}
		else
		{
			indices = Array.from({length: nrows}, (_) => Math.floor(Math.random() * L) );
		}

		var sample = {};
		for(const key in df)
		{
			sample[key] = {data:[]};
			indices.forEach( (i) => sample[key].data.push(df[key].data[i]) );
		}

		return sample;
	}


	/// BRFSS sample

	var df = cdc_brfss2008;

	var sample = SampleRows(df, 5000);
	// var sample = df;
	var [heights, weights] = [sample.htm3.data, sample.wtkg2.data];


	var scatter = new Cdf(heights, weights);

	var plotData = [];
	plotData.push(scatter.ChartData({type:"scatter", markerColor: 'rgba(0,0,255,0.2)'/*, markerSize: 8*/}));
	var axes = {
		x:{title:'height (cm)'},
		y:{title:"weight (kg)"}
	};
	var caption = `Figure 7.1: Scatter plots of weight versus height for the respondents in the BRFSS, unjittered`;
	renderPlot(caption, plotData, "chart1_", axes, {height:600, width:700});


	//////////////////////////////////////////////////////
	/// Jitter


	var subtitle = "Jitter";

	printTitle(subtitle);


	function Jitter(values, jitter=0.5)
	{
		const jittered = values.map( (v) => v + (2 * Math.random() - 1) * jitter );
		return jittered;
	}

	const jitHeights = Jitter(heights, 1.3);
	const jitWeights = Jitter(weights, 0.5);

	var scatter = new Cdf(jitHeights, jitWeights);

	var plotData = [];
	plotData.push(scatter.ChartData({type:"scatter", markerColor: 'rgba(0,0,255,0.20)', markerSize: 4}));
	var axes = {
		x:{title:'height (cm)'},
		y:{title:"weight (kg)"}
	};
	var caption = `Figure 7.1: Scatter plots of weight versus height for the respondents in the BRFSS, jittered`;
	renderPlot(caption, plotData, "chart2_", axes, {height:600, width:700});


	//////////////////////////////////////////////////////
	/// Hexbin

	var subtitle = "Hexbin";

	printTitle(subtitle);


	function hexbins(dataXs, dataYs, nBins=200)
	{
		// hexagons:
		//   r : side = radius
		//   xi: x-center = r * 3/2 * i
		//   ix: x-index  = round( 2 * x / r / 3 )
		//   yi: y-center = r * sqrt(3) / 2 * i
		//   iy: y-index  = round( 2 * y / (r * sqrt(3) ) )

		const SQRT3 = Math.sqrt(3);

		// Options

		// (Ymax-Ymin + r) * (Xmax-Xmin + r) ≈ 7 * r * r * nBins

		let xmin =  Infinity,
		    xmax = -Infinity,
		    ymin =  Infinity,
		    ymax = -Infinity;

		dataXs.forEach( (x, i) => {
			const y = dataYs[i];
			if(x < xmin) xmin = x;
			if(x > xmax) xmax = x;
			if(y < ymin) ymin = y;
			if(y > ymax) ymax = y;
		});

		const X = xmax-xmin;
		const Y = ymax-ymin

		console.log(`X = xmax(=${xmax}) - xmin(=${xmin}) = ${X}`);
		console.log(`Y = ymax(=${ymax}) - ymin(=${ymin}) = ${Y}`);

		const a = 9 * nBins - 1;
		const b = -(X + Y);
		const c = -X * Y;
		const D = Math.pow(b, 2) - 4 * a * c;

		const r = ((-b + Math.sqrt(D)) / (2 * a)).fixFloat();

		console.log(`nBins = ${nBins},\nr = ${r}`);

		///

		function validate(x, y, ix, iy, r)
		{
			const xi = r * 1.5 * ix,
			      yi = r * 0.5 * SQRT3 * iy;

			let d = null;

			if      ( (xi - r <= x  ) && (x < xi - r/2) ) d = SQRT3 * (x - xi + r);
			else if ( (xi - r/2 <= x) && (x < xi + r/2) ) d = r * SQRT3 / 2;
			else if ( (xi + r/2 <= x) && (x <= xi + r ) ) d = SQRT3 * (xi - x + r);

			if(d === null) return false;

			if( (yi - d <= y) && (y <= yi + d) ) return [xi, yi];

			return false;
		}

		let failed  = 0;
		let success = 0;
		const centers = new Map(); // { xi -> {yi->freq} }

		dataXs.forEach( (x, i) => {
			const y = dataYs[i];
			if(isNaN(x) || isNaN(y)) return;

			let ix = Math.floor( 2 * x / r / 3     );
			let iy = Math.floor( 2 * y / r / SQRT3 );

			let found = false;
			for(var tx = ix; (tx < ix + 2) && !found; tx++)
			{
				for(var ty = iy; (ty < iy + 2) && !found; ty++)
				{
					if( tx % 2 !== ty % 2) ty++;
					found = validate(x, y, tx, ty, r);
				}
			}
			if(!found)
			{
				failed++;

				const xi = r * 1.5 * ix, yi = r * 0.5 * SQRT3 * iy;
				console.warn("\nx:", ix, xi, x,'\ny:', iy, yi, y);
			}
			else
			{
				const [xi, yi] = found;

				if( !centers.has(xi) ) centers.set(xi, new Map());
				const XY = centers.get(xi);

				if( !XY.has(yi) ) XY.set(yi, 0);
				XY.set(yi, XY.get(yi) + 1);

				success++;
			}
		});

		console.log('binned:', success, ', not binned:', failed);

		const bins = {"r": r, "centers": centers};

		return bins;
	}


	///

	var heights = df.htm3.data,
	    weights = df.wtkg2.data;

	const bins = hexbins(heights, weights, 300);

	const xyFreqs = [];

	let fmin =  Infinity,
	    fmax = -Infinity;

	for(const [x, yFreqs] of bins.centers)
	{
		for(const [y, freq] of yFreqs)
		{
			xyFreqs.push({"xy": {"x": x, "y":y}, "freq": freq});

			if(freq > fmax) fmax = freq;
			if(freq < fmin) fmin = freq;
		}
	}

	console.log(fmin, fmax, xyFreqs.length);

	var plotData = [];

	const maxlog = Math.log10(fmax);
	const minlog = Math.log10(fmin);

	xyFreqs.forEach( (o) => {

		const alpha = 0.2 + (Math.log10(o.freq) - minlog) * 0.7 / (maxlog - minlog) ;

		const d = {
			type: "scatter",
			showInLegend: false,
			markerColor: `rgba(0,122,122,${alpha})`,
			markerSize: 13,
			markerType: "circle",
			dataPoints: [o.xy]
		};

		plotData.push(d);
	});

	var axes = {
		x:{title:'height (cm)'/*, minimum:130, maximum:210*/},
		y:{title:"weight (kg)"}
	};
	var caption = `Figure 7.2: hexbin plot`;
	renderPlot(caption, plotData, "chart3_", axes, {height:700, width:560});

})();

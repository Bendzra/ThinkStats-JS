"use strict";

///////////////////////////////////////////////////////////


function dropna(db, names, condition=null, skipNaN=true)
{
	// names: list fo names from "db" to form new "df" stripped of NaNs

	const d = {}; names.forEach( (name) => d[name] = []);

	db[names[0]].data.forEach( (_, i) => {

		if(skipNaN)
		{
			for(const name in d)
			{
				if( isNaN(db[name].data[i]) ) return;
			}
		}

		if( condition !== null )
		{
			const c = condition(i);
			if ( !c ) return;

			// console.log(i, "db.outcome.data[i] =", db.outcome.data[i]);
		}

		for(const name in d) d[name].push(db[name].data[i]) ;
	});

	return d;
}


///////////////////////////////////////////////////////////

function digitizeIndices(arr, low, high, step)
{
	// arranges bins,
	// computes the index of the bin that contains each value in "arr".
	// The result is an array that maps from "arr" index to "bin" index

	const nBins = 1 + Math.floor( fixFloat((high - low) / step) ) + 1;

	const indices = new Array(arr.length);

	arr.forEach( (v, index) => {

		let ibin = NaN;

		if      (v  <  low) ibin = 0;
		else if (v >= high) ibin = nBins - 1;
		else ibin = 1 + Math.floor( fixFloat((v - low) / step) );

		indices[index] = ibin;
	});

	return indices;
}


function groupby(df, indices)
{
	const groups = {};
	for(const name in df) groups[name] = [];

	indices.forEach( (ibin, i) => {
		for(const name in df)
		{
			if(!groups[name][ibin]) groups[name][ibin] = [];
			groups[name][ibin].push(df[name][i]);
		}
	});

	return groups;
}


///////////////////////////////////////////////////////////

function mapValCount(vals)
{
	const d = new Object();
	for (var i = 0; i < vals.length; i++)
	{
		const v = ( isNaN(vals[i]) || vals[i] === "") ? "." : vals[i];
		const count = (v in d) ? d[v] : 0;
		d[v] = count + 1;
	}
	return d;
}

function deco(cond)
{
	if(!cond) return '\x1B[48;2;255;255;255;38;2;255;0;0;1m' + cond + '\x1B[m';
	return '\x1B[48;2;255;255;255;38;2;0;0;255;22m' + cond + '\x1B[m';
}

function sumKeyInterval(obj, keyStart, keyEnd)
{
	var total = 0;
	for(var k in obj)
	{
		var i = parseFloat(k);
		if( isNaN(i) ) continue;
		if(i <= keyEnd && i >= keyStart) total += obj[k];
	}
	return total;
}

function validateInterval(label, n, dictValCount, interval)
{
	var t = null;
	if(interval.constructor === Array)
	{
		if(interval.length === 2) t = sumKeyInterval(dictValCount, ...interval);
		else t = dictValCount[ interval[0] ];
	}
	else
	{
		t = dictValCount[ interval ];
	}
	if(t === undefined) t = 0;
	console.log(`${label} = ${n} : ${deco(t === n)} : (${t})`);
	return t;
}

function validateData(df, key, tests, L=7643)
{
	const data = df[key].data;
	console.log(`\x1B[1m\t${key.toUpperCase()}:\x1B[m`);

	const dictValCount = mapValCount(data);
	var total = (tests.length === 0) ? L : 0;
	for (var i = 0; i < tests.length; i++)
	{
		const [label, n, interval] = tests[i];
		total += validateInterval(label, n, dictValCount, interval);
	}
	console.log(`Total = ${L} : ${deco(data.length === L && L === total)} (${data.length})`);
}

///////////////////////////////////////////////////////////


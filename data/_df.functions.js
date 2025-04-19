///////////////////////////////////////////////////////////

function CleanFemResp(df=nsfg_2002FemResp)
{
	const EMPTY = "";
	const L = df[ Object.keys(df)[0] ].data.length;

	for(var i = 0; i < L; i++)
	{
		if(df.cmmarrhx.data[i] === EMPTY) df.cmmarrhx.data[i] = NaN;
	}
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


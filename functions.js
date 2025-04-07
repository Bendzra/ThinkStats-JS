///////////////////////////////////////////////////////////

var messageDiv = document.getElementById("messageDiv");
messageDiv.innerHTML = "Watch out console.log!";

///////////////////////////////////////////////////////////

function countValues(arr)
{
	const d = new Object();
	for (var i = 0; i < arr.length; i++)
	{
		const v = ( isNaN(arr[i]) || arr[i] === "") ? "." : arr[i];
		const count = (v in d) ? d[v] : 0;
		d[v] = count + 1;
	}
	return d;
}


function MakePregMap(df=nsfg_2002FemPreg)
{
	const d = new Object();
	for(var i = 0; i < df.caseid.data.length; i++)
	{
		var preg_index = i;
		var caseid     = df.caseid.data[preg_index];
		if( !(caseid in d) ) d[caseid] = new Array() ;
		d[caseid].push(preg_index);
	}
	return d;
}


function CleanFemResp(df=nsfg_2002FemResp)
{
	const EMPTY = "";
	const L = df[ Object.keys(df)[0] ].data.length;

	for(var i = 0; i < L; i++)
	{
		if(df.cmmarrhx.data[i] === EMPTY) df.cmmarrhx.data[i] = NaN;
	}
}


function CleanFemPreg(df=nsfg_2002FemPreg)
{
	const NOT_ASCERTAINED = 97, REFUSED = 98, DO_NOT_KNOW = 99, EMPTY = "";
	const na_vals = [NOT_ASCERTAINED, REFUSED, DO_NOT_KNOW, EMPTY];

	const L = df[ Object.keys(df)[0] ].data.length;

	df["totalwgt_lb"] = {type: "float", data:[]};

	for(var i = 0; i < L; i++)
	{
		if(df.birthord.data[i] === EMPTY) df.birthord.data[i] = NaN;

		if(df.agepreg.data[i] === EMPTY) df.agepreg.data[i] = NaN;
		df.agepreg.data[i] /= 100;

		if( df.birthwgt_lb.data[i] > 20 || df.birthwgt_lb.data[i] === EMPTY) df.birthwgt_lb.data[i] = NaN;

		if( na_vals.indexOf( df.birthwgt_oz.data[i] ) !== -1  ) df.birthwgt_oz.data[i] = NaN;

		df.totalwgt_lb.data[i] = df.birthwgt_lb.data[i] + df.birthwgt_oz.data[i] / 16;
	}
}

///////////////////////////////////////////////////////////

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

function validateInterval(label, n, valueCounts, interval)
{
	var t = null;
	if(interval.constructor === Array)
	{
		if(interval.length === 2) t = sumKeyInterval(valueCounts, ...interval);
		else t = valueCounts[ interval[0] ];
	}
	else
	{
		t = valueCounts[ interval ];
	}
	if(t === undefined) t = 0;
	console.log(`${label} = ${n} : ${deco(t === n)} : (${t})`);
	return t;
}

function validateData(df, key, tests, L=7643)
{
	const data = df[key].data;
	console.log(`\x1B[1m\t${key.toUpperCase()}:\x1B[m`);

	const valueCounts = countValues(data);
	var total = (tests.length === 0) ? L : 0;
	for (var i = 0; i < tests.length; i++)
	{
		const [label, n, interval] = tests[i];
		total += validateInterval(label, n, valueCounts, interval);
	}
	console.log(`Total = ${L} : ${deco(data.length === L && L === total)} (${data.length})`);
}

///////////////////////////////////////////////////////////

function fixFloat(x, decimals=8)
{
	if(decimals === null) return x;
	return parseFloat( x.toFixed(decimals) );
}

"use strict";

// 2.8 Variance

function mean(arr)
{
	var total = 0;
	var n = 0;
	for(var i = 0; i < arr.length; i++)
	{
		if(isNaN(arr[i])) continue;
		total += arr[i];
		n++;
	}
	if(n === 0) return NaN;
	return total / n;
}

function variance(m, arr)
{
	var total = 0;
	var n = 0;
	for(var i = 0; i < arr.length; i++)
	{
		if(isNaN(arr[i])) continue;
		total += Math.pow(arr[i] - m, 2);
		n++;
	}
	if(n === 0) return NaN;
	return total / n;
}

(function() {

	const title = "2.8 Variance";

	printTitle(title);

	const df = nsfg_2002FemPreg;

	var live   = {index:[], birthord:[], prglngth:[]};
	var firsts = {index:[], birthord:[], prglngth:[]};
	var others = {index:[], birthord:[], prglngth:[]};

	df.prglngth.data.forEach( (weeks, i) => {
		if(df.outcome.data[i] === 1)
		{
			live.index.push(i);
			live.birthord.push(df.birthord.data[i])
			live.prglngth.push(weeks);

			if (df.birthord.data[i] === 1)
			{
				firsts.index.push(i);
				firsts.birthord.push(df.birthord.data[i])
				firsts.prglngth.push(weeks);
			}
			else
			{
				others.index.push(i);
				others.birthord.push(df.birthord.data[i])
				others.prglngth.push(weeks);
			}
		}
	});

	var m   = mean(live.prglngth);
	var v   = variance(m, live.prglngth);
	var std = Math.sqrt(v);
	console.log(`live.prglngth:\n\tmean=${m.toFixed(4)}\r\n\tvariance=${v.toFixed(4)}\r\n\tstd=${std.toFixed(4)}`);

	var m   = mean(df.prglngth.data);
	var v   = variance(m, df.prglngth.data);
	var std = Math.sqrt(v);
	console.log(`df.prglngth.data:\n\tmean=${m.toFixed(4)}\r\n\tvariance=${v.toFixed(4)}\r\n\tstd=${std.toFixed(4)}`);


})();

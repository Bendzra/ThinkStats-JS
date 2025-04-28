"use strict";

// 2.9 Effect size


function CohenEffectSize(group1, group2)
{
	var m1 = mean(group1);
	var m2 = mean(group2);
	var diff = m1 - m2;
	var v1 = variance(m1, group1);
	var v2 = variance(m2, group2);
	var n1 = group1.length;
	var n2 = group2.length;

	var pooled_var = (n1 * v1 + n2 * v2) / (n1 + n2);
	var d = diff / Math.sqrt(pooled_var);

	return d;
}


(function() {

	const title = "2.9 Effect size";

	printTitle(title);

	const df = nsfg_2002FemPreg;

	function DataShot(name)
	{
		this.name     = name;
		this.index    = [];
		this.birthord = [];
		this.prglngth = [];

		this.update = function(index, birthord, prglngth) {
			this.index.push(index);
			this.birthord.push(birthord);
			this.prglngth.push(prglngth);
		};

	 	this.stats = function(prop) {
			var m   = mean(this[prop]);
			var v   = variance(m, this[prop]);
			var std = Math.sqrt(v);
			console.log(`${this.name}.${prop}:\n\tmean=${m.toFixed(4)}\r\n\tvariance=${v.toFixed(4)}\r\n\tstd=${std.toFixed(4)}`);
			return [m, v, std];
		};
	}

	var live   = new DataShot("live");
	var firsts = new DataShot("firsts");
	var others = new DataShot("others");

	df.prglngth.data.forEach( (weeks, i) => {
		if(df.outcome.data[i] === 1)
		{
			live.update(i, df.birthord.data[i], weeks);
			if (df.birthord.data[i] === 1) firsts.update(i, df.birthord.data[i], weeks);
			else others.update(i, df.birthord.data[i], weeks);
		}
	});

	var [m0, v0, std0] = live.stats("prglngth");
	var [m1, v1, std1] = firsts.stats("prglngth");
	var [m2, v2, std2] = others.stats("prglngth");

	console.log(`(m1-m2)/m = ${(100*(m1-m2)/m0).toFixed(4)} %`);

	var d = CohenEffectSize(firsts.prglngth, others.prglngth);
	console.log(`CohenEffectSize = ${d.toFixed(4)}`);

})();

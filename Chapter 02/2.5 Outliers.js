"use strict";

// 2.5 Outliers

(function() {

	const title = "2.5 Outliers";

	printTitle(title);

	const df = nsfg_2002FemPreg;

	var prglngth_live = [];
	df.prglngth.data.forEach( (x, i) => {
		if(df.outcome.data[i] === 1) prglngth_live.push(x);
	});

	var hist = new Hist(prglngth_live, "prglngth_live");
	console.log( `prglngth_live.Smallest =\r\n\t${hist.Smallest().join("\r\n\t")}` );
	console.log( `prglngth_live.Largest =\r\n\t${hist.Largest(7).join("\r\n\t")}` );

})();

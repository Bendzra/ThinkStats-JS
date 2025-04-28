"use strict";

// Exercise 2.3

function allModes(hist)
{
	var a = [...hist.GetDict()].sort( (a, b) => {return b[1]-a[1];} );
	return a;
}

(function() {

	const title = "2.11 Exercise 2.3";

	printTitle(title);

	const preg = nsfg_2002FemPreg;
	const resp = nsfg_2002FemResp;

	var hist = new Hist(resp.age_r.data, "age_r");
	console.log( `resp.age_r Modes =\r\n\t${allModes(hist).slice(0, 10).join("\r\n\t")}\r\n\t...` );

})();

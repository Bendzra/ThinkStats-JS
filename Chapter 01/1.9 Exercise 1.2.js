"use strict";

// 1.9 Exercise 1.2 (Resp Validation)

(function() {

	const title = "1.9 Exercise 1.2";

	printTitle(title);

	const df = nsfg_2002FemResp;
	const TOTAL = 7643;

	/// CASEID
	var tests = [];
	validateData(df, "caseid", tests, TOTAL);

	/// CMBIRTH
	var tests = [
		["BEFORE 1997",          7643, [ 301, 1164]],
		["JANUARY 1997 OR LATER",   0, [1165, 1239]]
	];
	validateData(df, "cmbirth", tests, TOTAL);

	/// EVRMARRY
	var tests = [
		["NEVER MARRIED", 3517, 0],
		["EVER MARRIED",  4126, 1]
	];
	validateData(df, "evrmarry", tests, TOTAL);

	/// CMMARRHX
	var tests = [
		["INAPPLICABLE",          3525,          '.'],
		["BEFORE 1997",           2928, [ 301, 1164]],
		["JANUARY 1997 OR LATER", 1161, [1165, 1239]],
		["NOT ASCERTAINED",          1,         9997],
		["REFUSED",                  9,         9998],
		["DON'T KNOW",              19,         9999],
	];
	validateData(df, "cmmarrhx", tests, TOTAL);

	/// PREGNUM
	var tests = [
		["NONE",                 2610,      0 ],
		["1 PREGNANCY",          1267,      1 ],
		["2 PREGNANCIES",        1432,      2 ],
		["3 PREGNANCIES",        1110,      3 ],
		["4 PREGNANCIES",         611,      4 ],
		["5 PREGNANCIES",         305,      5 ],
		["6 PREGNANCIES",         150,      6 ],
		["7 OR MORE PREGNANCIES", 158, [7, 95]]
	];
	validateData(df, "pregnum", tests, TOTAL);

	/// CMINTVW
	var tests = [
		["JAN 2002 - MAR 2003", 7643, [1225, 1239]]
	];
	validateData(df, "cmintvw", tests, TOTAL);


	// cross-validation the respondent and pregnancy files

	console.log(`\r\n\x1B[1m\tCROSS-VALIDATION:\x1B[m`);

	const preg_map = MakePregMap(nsfg_2002FemPreg);
	var total = 0;
	var o = true;
	for(var i=0; i < df.caseid.data.length; i++) {

		var respID = df.caseid.data[i];
		if(respID in preg_map)
		{
			o &&= (preg_map[respID].length === df.pregnum.data[i]);

			if (preg_map[respID].length === df.pregnum.data[i])
			{
				total += preg_map[respID].length;
			}
		}
		else o &&= (df.pregnum.data[i] === 0);

	}
	console.log(`${total}, ${deco(total === 13593)}, ${deco(o)}`);

})();

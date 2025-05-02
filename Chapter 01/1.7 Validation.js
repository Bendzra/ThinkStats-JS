"use strict";

// 1.7 Validation


(function() {

	const title = "1.7 Validation";

	printTitle(title);

	/////////////////////////////////////////////

	const df = nsfg_2002FemPreg;

	const TOTAL = 13593;

	/// CASEID
	var tests = [];
	validateData(df, "caseid", tests, TOTAL);

	/// PREGORDR
	var tests = [
		[" 1ST PREGNANCY", 5033, 1],
		[" 2ND PREGNANCY", 3766, 2],
		[" 3RD PREGNANCY", 2334, 3],
		[" 4TH PREGNANCY", 1224, 4],
		[" 5TH PREGNANCY", 613 , 5],
		[" 6TH PREGNANCY", 308 , 6],
		[" 7TH PREGNANCY", 158 , 7],
		[" 8TH PREGNANCY", 78  , 8],
		[" 9TH PREGNANCY", 38  , 9],
		["10TH PREGNANCY", 17  ,10],
		["11TH PREGNANCY", 8   ,11],
		["12TH PREGNANCY", 5   ,12],
		["13TH PREGNANCY", 3   ,13],
		["14TH PREGNANCY", 3   ,14],
		["15TH PREGNANCY", 1   ,15],
		["16TH PREGNANCY", 1   ,16],
		["17TH PREGNANCY", 1   ,17],
		["18TH PREGNANCY", 1   ,18],
		["19TH PREGNANCY", 1   ,19]
	];
	validateData(df, "pregordr", tests, TOTAL);

	/// BIRTHWGT_LB
	var tests = [
		["INAPPLICABLE  ",  4449,    "." ],
		["UNDER 6 POUNDS",  1125, [0, 5] ],
		["6 POUNDS      ",  2223,      6 ],
		["7 POUNDS      ",  3049,      7 ],
		["8 POUNDS      ",  1889,      8 ],
		["9 POUNDS OR MORE", 799, [9, 95]],
		["NOT ASCERTAINED",    1,     97 ],
		["REFUSED",            1,     98 ],
		["DON'T KNOW",        57,     99 ]
	];
	validateData(df, "birthwgt_lb", tests, TOTAL);

	/// BIRTHWGT_OZ
	var tests = [
		["INAPPLICABLE", 4506,     "."],
		["0-15 OUNCES",  9039, [0, 15]],
		["NOT ASCERTAINED", 1,      97],
		["REFUSED",         1,      98],
		["DON'T KNOW",     46,      99]
	];
	validateData(df, "birthwgt_oz", tests, TOTAL);

	/// PRGLNGTH
	var tests = [
		["13 WEEKS OR LESS",   3522, [ 0, 13]],
		["14-26 WEEKS",         793, [14, 26]],
		["27 WEEKS OR LONGER", 9278, [27, 50]]
	];
	validateData(df, "prglngth", tests, TOTAL);

	/// OUTCOME
	var tests = [
		["LIVE BIRTH       ", 9148, 1],
		["INDUCED ABORTION ", 1862, 2],
		["STILLBIRTH       ", 120 , 3],
		["MISCARRIAGE      ", 1921, 4],
		["ECTOPIC PREGNANCY", 190 , 5],
		["CURRENT PREGNANCY", 352 , 6]
	];
	validateData(df, "outcome", tests, TOTAL);

	/// BIRTHORD
	var tests = [
		["INAPPLICABLE", 4445, "."],
		[" 1ST BIRTH  ", 4413,   1],
		[" 2ND BIRTH  ", 2874,   2],
		[" 3RD BIRTH  ", 1234,   3],
		[" 4TH BIRTH  ",  421,   4],
		[" 5TH BIRTH  ",  126,   5],
		[" 6TH BIRTH  ",   50,   6],
		[" 7TH BIRTH  ",   20,   7],
		[" 8TH BIRTH  ",    7,   8],
		[" 9TH BIRTH  ",    2,   9],
		["10TH BIRTH  ",    1,  10]
	];
	validateData(df, "birthord", tests, TOTAL);

	/// AGEPREG
	var tests = [
		["INAPPLICABLE",    352,         "."],
		["UNDER 20 YEARS", 3182, [ 0, 19.99]],
		["20-24 YEARS",    4246, [20, 24.99]],
		["25-29 YEARS",    3178, [25, 29.99]],
		["30-44 YEARS",    2635, [30, 44.99]]
	];
	validateData(df, "agepreg", tests, TOTAL);

	/// FINALWGT
	console.log('\x1B[1m\tFINALWGT :\x1B[m');
	var t = Math.min(...df.finalwgt.data).toFixed(7);
	console.log(`MIN = 118.6567897 : ${deco(t == 118.6567897)} : (${t})`);
	var t = Math.max(...df.finalwgt.data).toFixed(2);
	console.log(`MAX = 261879.95 : ${deco(t == 261879.95)} : (${t})`);
	console.log(`Total = ${TOTAL} : ${deco(df.finalwgt.data.length === TOTAL)} (${df.finalwgt.data.length})`);

})();

"use strict";

// 9.11 Replication


(function() {

	const title = "9.11 Replication";

	printTitle(title);


	/////////////////////////////////////////////

})();


(function() {

	const subtitle = "nsfg_2006_2010_FemPreg";

	printTitle(subtitle);


	/////////////////////////////////////////////

	const df = nsfg_2006_2010_FemPreg;

	const TOTAL = 20492;

	// CASEID: Case identification number
	var tests = [
		["Respondent ID number", 20492, [26141,42680]]
	];
	validateData(df, "caseid", tests, TOTAL);


	// PREGORDR: Pregnancy order (number)
	var tests = [
		["1ST PREGNANCY",	7538,  1],
		["2ND PREGNANCY",	5610,  2],
		["3RD PREGNANCY",	3515,  3],
		["4TH PREGNANCY",	1899,  4],
		["5TH PREGNANCY",	942,   5],
		["6TH PREGNANCY",	477,   6],
		["7TH PREGNANCY",	235,   7],
		["8TH PREGNANCY",	122,   8],
		["9TH PREGNANCY",	57,    9],
		["10TH PREGNANCY",	35,   10],
		["11TH PREGNANCY",	22,   11],
		["12TH PREGNANCY",	15,   12],
		["13TH PREGNANCY",	9,    13],
		["14TH PREGNANCY",	4,    14],
		["15TH PREGNANCY",	4,    15],
		["16TH PREGNANCY",	3,    16],
		["17TH PREGNANCY",	2,    17],
		["18TH PREGNANCY",	2,    18],
		["19TH PREGNANCY",	1,    19]
	];
	validateData(df, "pregordr", tests, TOTAL);


	// BIRTHWGT_LB1: (BD-3) How much did (BABY'S NAME/this 1st baby) weigh at birth? (POUNDS)
	var tests = [
		["INAPPLICABLE",		6206,    "."],
		["UNDER 6 POUNDS",		1788,  [0,5]],
		["6 POUNDS",			3385, 	   6],
		["7 POUNDS",			4955, 	   7],
		["8 POUNDS",			2861, 	   8],
		["9 POUNDS OR MORE",	1140, [9,95]],
		["Don't know",			157,	  99]
	];
	validateData(df, "birthwgt_lb1", tests, TOTAL);


	// BIRTHWGT_OZ1: (BD-3) How much did (BABY'S NAME/this 1st baby) weigh at birth? (OUNCES)
	var tests = [
		["INAPPLICABLE",	6363,      "."],
		["0-15 OUNCES",		14000, 	[0,15]],
		["Don't know",		129, 	    99]
	];
	validateData(df, "birthwgt_oz1", tests, TOTAL);


	// PRGLNGTH: Duration of completed pregnancy in weeks (recode)
	var tests = [
		["13 WEEKS OR LESS",	5032, 	[ 0,13]],
		["14-26 WEEKS",			1013, 	[14,26]],
		["27 WEEKS OR LONGER",	14447, 	[27,95]]
	];
	validateData(df, "prglngth", tests, TOTAL);


	// OUTCOME: Pregnancy outcome (recode)
	var tests = [
		["LIVE BIRTH",			14292, 	1],
		["INDUCED ABORTION",	2295, 	2],
		["STILLBIRTH",			166, 	3],
		["MISCARRIAGE",			2945, 	4],
		["ECTOPIC PREGNANCY",	278, 	5],
		["CURRENT PREGNANCY",	516, 	6]
	];
	validateData(df, "outcome", tests, TOTAL);


	// BIRTHORD: Birth order (recode)
	var tests = [
	 	["INAPPLICABLE",	6200,  "."],
		["1ST BIRTH",		6683, 	 1],
		["2ND BIRTH",		4415, 	 2],
		["3RD BIRTH",		2030, 	 3],
		["4TH BIRTH",		734, 	 4],
		["5TH BIRTH",		269, 	 5],
		["6TH BIRTH",		102, 	 6],
		["7TH BIRTH",		36, 	 7],
		["8TH BIRTH",		13, 	 8],
		["9TH BIRTH",		7, 		 9],
		["10TH BIRTH",		2, 		10],
		["11TH BIRTH",		1, 		11]
	];
	validateData(df, "birthord", tests, TOTAL);


	// AGEPREG: Age at pregnancy outcome (recode)
	var tests = [
		["INAPPLICABLE"	,	516	,			"."],
		["UNDER 20 YEARS",	4703,	[   0,1999]],
		["20-24 YEARS"	,	6684,	[2000,2499]],
		["25-29 YEARS"	,	4697,	[2500,2999]],
		["30-44 YEARS"	,	3892,	[3000,4499]]
	];
	validateData(df, "agepreg", tests, TOTAL);

})();


(function() {

	const subtitle = "Hypothesis testing";

	printTitle(subtitle);


	/////////////////////////////////////////////

	const db = nsfg_2006_2010_FemPreg;

})();

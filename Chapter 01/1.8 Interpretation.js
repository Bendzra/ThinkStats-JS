"use strict";

// 1.8 Interpretation
//
// Table of Respondents :
//     caseId - unique respondent ID
//     index  - unique record ID
//
// Table of Pregnancies :
//     caseId - foreign key - reffering to a respondent (=unique respondent ID)
//     index  - unique record ID
//

function indicateValues(arr, indices)
{
	var r = [];
	for (var i = 0; i < indices.length; i++)
	{
		r.push( arr[ indices[i] ] );
	}
	return r;
}

(function() {

	const title = "1.8 Interpretation";

	printTitle(title);

	const df = nsfg_2002FemPreg;
	const preg_map = MakePregMap(df);
	const caseid   = 10229;
	const indices  = preg_map[caseid];
	const o = indicateValues(df.outcome.data, indices);

	console.log(JSON.stringify(o));

})();

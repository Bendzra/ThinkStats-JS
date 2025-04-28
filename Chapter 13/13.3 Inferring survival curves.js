"use strict";

// 13.3 Inferring survival curves



function EstimateHazardFunction(complete, ongoing, label='')
{
	// Estimates the hazard function by Kaplan-Meier.

	// https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator

	// complete: list of complete lifetimes
	// ongoing: list of ongoing lifetimes
	// label: string

	const hist_complete = new Hist(complete);
	const hist_ongoing  = new Hist(ongoing);

	const ts = Array.from(new Set([...hist_complete.Values(), ...hist_ongoing.Values()]));
	ts.sort( (a,b) => a-b );

	// console.log(ts);

	let at_risk = complete.length + ongoing.length;

	const λs = [];

	ts.forEach( (t) => {
		const ended = hist_complete.Freq(t);
		const censored = hist_ongoing.Freq(t);

		λs.push( ended / at_risk );

		// console.log(
		// 	"t = ", t,
		// 	"\n\tat_risk =", at_risk,
		// 	"\n\tended =", ended,
		// 	"\n\tcensored =", censored,
		// 	"\n\tλs[t] =", λs[λs.length-1]);

		at_risk -= (ended + censored);
	});

	return new HazardFunction(ts, λs, label);
}


(function() {

	const title = "13.3 Inferring survival curves";

	printTitle(title);


	/////////////////////////////////////////////


})();

(function() {

	const title = "13.4 Kaplan-Meier estimation";

	printTitle(title);


	/////////////////////////////////////////////


})();

"use strict";

// 3.1 Pmfs

(function() {

	const title = "3.1 Pmfs";

	printTitle(title);

	const pmf = new Pmf([1, 2, 2, 3, 5], "pmf");
	pmf.Print();
	console.log(pmf.label, pmf instanceof _DictWrapper);
	pmf.Incr(2, 0.2);
	console.log(`pmf.Incr(2, 0.2); pmf.Prob(2) = ${fixFloat(pmf.Prob(2))}`);
	pmf.Mult(2, 0.5)
	console.log(`pmf.Mult(2, 0.5); pmf.Prob(2) = ${fixFloat(pmf.Prob(2))}`);
	console.log(`pmf.Total() = ${fixFloat(pmf.Total())}`);
	pmf.Normalize();
	console.log(`pmf.Normalize(); pmf.Total() = ${fixFloat(pmf.Total())}`);
	pmf.Print();
})();

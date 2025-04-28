"use strict";

///////////////////////////////////////////////////////////////////////////////
// 4.2 Percentiles
//
// The percentile rank is the fraction of people who scored lower than you (or the same).

(function() {

	const title = "4.2 Percentiles";

	printTitle(title);

	///

	const scores     = [55, 66, 77, 88, 99];
	const your_score = 88;

	function PercentileRank(scores, your_score)
	{
		var count = 0;
		scores.forEach( (score) => {if (score <= your_score) count += 1;} );
		const percentile_rank = 100 * count / scores.length;
		return percentile_rank;
	}

	console.log( `PercentileRank(score=${your_score}) = ${PercentileRank(scores, your_score)} %` );

	///

	function Percentile(scores, percentile_rank)
	{
		var score = undefined;
		scores.sort( (a, b) => {return a-b;});
		for(var i = 0; i < scores.length; i++)
		{

			var rank = PercentileRank(scores, scores[i]);
			if ( rank >= percentile_rank )
			{
				score = scores[i];
				break;
			}
		}
		return score;
	}

	const percentile_rank = 49;

	console.log( `Percentile(percentile_rank=${percentile_rank}) = ${Percentile(scores, percentile_rank)}` );


	function Percentile2(scores, percentile_rank)
	{
		scores.sort( (a, b) => {return a-b;});
		var index = (percentile_rank * scores.length / 100)|0;
		if (index === scores.length) index--;
		return scores[index];
	}

	console.log( `Percentile2(percentile_rank=${percentile_rank}) = ${Percentile2(scores, percentile_rank)}` );

	console.log( "----" );

	// for(var rank = 0; rank <= 100; rank++)
	// {
	// 	console.log( ` Percentile(percentile_rank=${rank}) = ${Percentile(scores, rank)}` );
	// 	console.log( `Percentile2(percentile_rank=${rank}) = ${Percentile2(scores, rank)}` );
	// 	console.log( "----" );
	// }

})();

"use strict";

// 1.3 Importing the data

(function() {

	const title = "1.3 Importing the data";

	printTitle(title);

	function arraysLengthTest( dict )
	{

		var dbName = Object.keys(dict)[0];
		var db = dict[dbName];

		var L = -1;
		var K = "";
		var i = 0;
		for ( const [k, v] of Object.entries(db) )
		{
			i++;

			if(L === -1)
			{
				L = v.data.length;
				K = k;
				continue;
			}

			if(L !== v.data.length)
			{
				var s = `Error on: name=${k} : L(${K})=${L} !== L(${k})=${v.data.length}`;
				console.log( s );
				throw new Error(s);
			}
			K = k;
		}
		console.log( dbName + " : data arrays : length test passed successfully");
		console.log( `columns = ${i}, records = ${L}` );
	}

	arraysLengthTest( {nsfg_2002FemPreg} );
	arraysLengthTest( {nsfg_2002FemResp} );
})();

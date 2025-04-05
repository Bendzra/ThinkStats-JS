// 2.2 Representing histograms

(function() {

	const title = "2.2 Representing histograms";

	console.log('\r\n< \x1B[1m' + title + '\x1B[m >');

	const hist = new Hist([1, 2, 2, 3, 5]);


	console.log( `hist.Freq(2)=${hist.Freq(2)}` );
	console.log( `hist.Freq(4)=${hist.Freq(4)}` );
	console.log( `hist.Values()=${[...hist.Values()]}` );
	hist.Print();

	for( const [val, freq] of hist.Items())
	{
		console.log( `val=${val}, freq=${freq}` );
	}

})();

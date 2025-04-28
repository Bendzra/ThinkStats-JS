"use strict";

// 2.2 Representing histograms

//////////////////////////////////////////////////////////////////////

function createDiv(prefix, titleSlug, className="info")
{
	var id = prefix + titleSlug;
	var oDiv = document.getElementById(id);
	if ( oDiv ) return oDiv;

	oDiv = document.createElement("div");
	oDiv.setAttribute("class", className);
	oDiv.setAttribute("id", id);
	document.body.appendChild(oDiv);
	return oDiv;
}

function slugify(text)
{
	return text
		.toString()                     // Cast to string
		.toLowerCase()                  // Convert the string to lowercase letters
		.normalize('NFD')       		// The normalize() method returns the Unicode Normalization Form of a given string.
		.trim()                         // Remove whitespace from both sides of a string
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

function jsFileName()
{
	var currentScriptFileName = null;
	var scripts = document.getElementsByTagName("script");
	var currentScriptUrl = (document.currentScript || scripts[scripts.length - 1]).src;
	var re = /\/([^\/]+)\.js$/i;
	var arr = re.exec(currentScriptUrl);
	if(arr) currentScriptFileName = arr[1];
	return currentScriptFileName;
}

function guid()
{
	var currentScriptFileName = jsFileName();
	if(currentScriptFileName) return currentScriptFileName;

	function _p8(s)
	{
		var p = ( Math.random().toString(16) + "000000000").substr(2,8);
		return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
	}
	return _p8() + _p8(true) + _p8(true) + _p8();
}

function printTitle(title)
{
	const div = createDiv("title_", slugify(title));
	console.log('\r\n< \x1B[1m' + title + '\x1B[m >');
	div.outerHTML = "<h2>" + title + "</h2>";
}

//////////////////////////////////////////////////////////////////////

(function() {

	const title = "2.2 Representing histograms";

	printTitle(title);

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

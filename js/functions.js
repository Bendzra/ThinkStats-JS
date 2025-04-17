///////////////////////////////////////////////////////////

var messageDiv = document.getElementById("messageDiv");
messageDiv.innerHTML = "Watch out console.log!";

///////////////////////////////////////////////////////////

function isIterable(obj)
{
	if (!obj) return false;
	return typeof obj[Symbol.iterator] === 'function';
}

function fixFloat(x, decimals=8)
{
	if(decimals === null) return x;
	return parseFloat( x.toFixed(decimals) );
}

Number.prototype.fixFloat = function(decimals=8)
{
	return parseFloat( this.toFixed(decimals) );
}

function spreadDots(dataset, nDots, low=false, high=false, decimals=8)
{
	// создаем array(nDots) равномерно расположенных точек в отрезке [low, high],
	// или вдоль заданного dataset'а (с небольшим перехлестом)

	var mi = 0, ma = 0;

	if( nDots < 1 ) throw new RangeError(`invalid arguments (nDots = ${nDots})`);

	if(!isIterable(dataset))
	{
		if(  typeof low !== 'number' ) throw new RangeError(`invalid arguments (low = ${typeof low})`);
		if( typeof high !== 'number' ) throw new RangeError(`invalid arguments (high = ${typeof high})`);
	}
	else
	{
		mi = Math.min( ...dataset );
		ma = Math.max( ...dataset );
	}
	var overflow = (ma - mi) / 3;

	if(typeof low  !== 'number') low  = mi - overflow;
	if(typeof high !== 'number') high = ma + overflow;

	var xs = [];
	var step = (nDots == 1) ? 1 : (high - low) / (nDots - 1);

	for (var i = 0, prev = low; i < nDots; i++, prev += step)
	{
		xs.push( fixFloat(prev, decimals) );
	}
	return xs;
}

///////////////////////////////////////////////////////////

function bisectLeft(arr, value, lo=0, hi=arr.length)
{
	while (lo < hi)
	{
		var mid = (lo + hi) >> 1;
		if (arr[mid] < value) { lo = mid + 1; }
		else { hi = mid; }
	}
	return lo;
}

function bisectRight(arr, value, lo=0, hi=arr.length)
{
	while (lo < hi)
	{
		var mid = (lo + hi) >> 1;
		if (arr[mid] > value) { hi = mid; }
		else { lo = mid + 1; }
	}
	return hi ;
}

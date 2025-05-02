"use strict";

///////////////////////////////////////////////////////////

var messageDiv = document.getElementById("messageDiv");
messageDiv.innerHTML = "Watch out console.log!";

///////////////////////////////////////////////////////////

Array.prototype.minmax = function()
{
	let min = Infinity;
	let max = -Infinity;
	for (let i = 0; i < this.length; i++)
	{
		if (min > this[i]) min = this[i];
		else if (max < this[i]) max = this[i];
	}
	return [min, max];
};

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
};

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
		[mi, ma] = [ ...dataset ].minmax();
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

function shuffle(array, n=NaN)
{
	// Shuffles array (in place)
	// n: random elements (shifted to the beginning of the array)
	// returns: "randomized part" of the array (length = n)

	let cut = isNaN(n) ? array.length : n;

	let pos = 0;
	let rst = array.length;

	// While there are elements we need to shuffle...
	while (cut !== pos && rst !== 0)
	{
		// Pick a remaining element...
		let randomIndex = pos + Math.floor(Math.random() * rst);
		rst--;

		// And swap it with the current element.
		[array[pos], array[randomIndex]] = [array[randomIndex], array[pos]];

		pos++;
	}

	return isNaN(n) ? array : array.slice(0, pos);
}


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
	return hi;
}


///////////////////////////////////////////////////////////

function columnQuicksort(A, fst, lst, iCol)
{
	// Sorting a column of 2D array (all other elements stay where they are)

	if (fst >= lst) return;

	let [t, b] = [fst, lst];
	const barrier = A[fst + Math.floor( Math.random() * (lst - fst) )][iCol];

	while (t <= b)
	{
		while (A[t][iCol] < barrier) t += 1;
		while (A[b][iCol] > barrier) b -= 1;
		if (t <= b)
		{
			[A[t][iCol], A[b][iCol]] = [A[b][iCol], A[t][iCol]];
			[t, b] = [t + 1, b - 1];
		}
	}
	columnQuicksort(A, fst, b, iCol);
	columnQuicksort(A, t, lst, iCol);
}

function columnHoarSort(A)
{
	// Sorting columns of 2D array

	for(let iCol = 0; iCol < A[0].length; iCol++)
	{
		columnQuicksort(A, 0, A.length-1, iCol);
	}
	return A;
}

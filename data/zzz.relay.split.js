/*-- windows script host script --*/

var sErrorMsg = "successfully!";
var fError = false;

// ------------ Input Options ------------

var datFileName = "";
var logFileName = "";

var dbname = "Apr25_27thAn_set1";
var prefix = "relay_";

var currentDir = WScript.ScriptFullName;
currentDir = currentDir.substr(0, currentDir.lastIndexOf( "\\" ) + 1); // заканчивается на "\"

datFileName = "D:\\MyProjects\\Scripts\\Python\\Think Stats\\data\\" + dbname + ".shtml";
logFileName = currentDir + dbname + ".json";

// ------

var ForReading = 1, ForWriting = 2, ForAppending = 8;
var fso = new ActiveXObject("Scripting.FileSystemObject");

var fLog = fso.OpenTextFile(logFileName, ForWriting, true);
var fDat = fso.OpenTextFile(datFileName, ForReading, false);

// ------

function ConvertPaceToSpeed(pace)
{
    // Converts pace in MM:SS per mile to MPH

    var ms = pace.split(":");
    var secs = parseInt(ms[0], 10) * 60 + parseInt(ms[1], 10);
    var mph  = 1 / secs * 60 * 60;
    return mph;
}

function BinData(data, low, high, n)
{
    // """Rounds data off into bins.

    // data: sequence of numbers
    // low: low value
    // high: high value
    // n: number of bins

    // returns: sequence of numbers

	for(var i = 0; i < data.length; i++)
	{
		var d = data[i];
		d = (d - low) / (high - low) * n ;
		d = Math.round(d);
		data[i] = (d * (high - low) / n + low).toFixed(2) ;
	}
    return data;
}

var paces = [];
var re = /^.{20}\s+(\d+\:[\d\:]*\d+)\s+(\d+\:[\d\:]*\d+)\*?\s+(\d+\:\d+)\s+/;

var i = 0;

while (!fDat.AtEndOfStream)
{
	var s = fDat.ReadLine();
	var arr = re.exec(s);
	if(arr)
	{
		// fLog.Write(arr[3] + ", ");
		paces.push( ConvertPaceToSpeed(arr[3]) );
		i++;
		
	}
	else
	{
		// fLog.WriteLine(s);
	}
}

fLog.WriteLine("const " + dbname + " = [" );
paces = BinData(paces, 3, 12, 100);
fLog.WriteLine("\t" + paces);
fLog.WriteLine("];" );

fDat.Close();
fLog.Close();

if(fError) { }

WScript.Echo("Done! " + i + ": " + sErrorMsg);

/*--
	windows script host script
--*/

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

function trim(s)
{
	return s.replace(/^\s+/, '').replace(/\s+$/, '');
}

function isNumeric(str)
{
  if (typeof str != "string") return false; // we only process strings!
  return !isNaN(str) && !isNaN(parseFloat(str));
}

var relay = {
				"Place"      : {id: 1, type: "int", data:[], write: false},
				"Div/Tot"    : {id: 2, type: "str", data:[], write: false},
				"Div"	     : {id: 3, type: "str", data:[], write: false},
				"Guntime"    : {id: 4, type: "str", data:[], write: false},
				"Nettime"    : {id: 5, type: "str", data:[], write: false},
				"Pace"       : {id: 6, type: "str", data:[], write: true },
				"Name"       : {id: 7, type: "str", data:[], write: false},
				"Ag"         : {id: 8, type: "int", data:[], write: false},
				"S"          : {id: 9, type: "str", data:[], write: false},
				"Race#"      : {id:10, type: "int", data:[], write: false},
				"City/state" : {id:11, type: "str", data:[], write: false}
			};


// Place Div/Tot  Div   Guntime Nettime  Pace  Name                   Ag S Race# City/state
// ===== ======== ===== ======= =======  ===== ====================== == = ===== =======================
//     5        8     5       7       7      5                     22  2 1     5                      23

var re = /^([ \d]{5}) ([ \d\/]{8}) ([ MF\d]{5}) ([\d\: ]{7}) ([\d\: ]{7})[\* ]{2}([\d\: ]{5}) (.{22}) ([ \d]{2}) ([ FM]) ([ \d]{5}) (.{23}) $/;

var i = 0;

while (!fDat.AtEndOfStream)
{
	var s = fDat.ReadLine();
	var arr = re.exec(s);
	if(arr)
	{
		for(var key in relay)
		{
			if (relay[key].write)
			{
				var d = trim(arr[ relay[key].id ]);
				if( relay[key].type == "str" || !isNumeric(d) ) d = '"' + d + '"';
				relay[key].data.push(d);
			}
		}
		i++;
	}
}

fLog.WriteLine("const " + dbname + " = {" );

var column = 0;
for(var key in relay)
{
	if (relay[key].write)
	{
		if(column++ > 0) fLog.WriteLine(",");
		fLog.Write("\t'" + key + "': [" + relay[key].data + "]");
	}
}
if(column > 0) fLog.WriteLine("");

fLog.WriteLine("};" );

fDat.Close();
fLog.Close();

if(fError) { }

WScript.Echo("Done! " + i + ": " + sErrorMsg);

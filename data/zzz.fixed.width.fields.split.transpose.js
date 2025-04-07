/*--
	windows script host script
	Читаем словарь к файлу данных (с полями фиксированной длины)
	Затем читаем сам файл данных. Собираем arrays
--*/

var sErrorMsg = "successfully!";
var fError = false;

// ------------ Input Options ------------

var filter2002FemPreg = {
					"caseid"     : true,	// RESPONDENT ID NUMBER
					"prglngth"   : true,	// DURATION OF COMPLETED PREGNANCY IN WEEKS
					"outcome"    : true,	// PREGNANCY OUTCOME
					"pregordr"   : true,	// PREGNANCY ORDER (NUMBER)
					"birthord"   : true,	// BIRTH ORDER
					"birthwgt_lb": true,	// BD-3 BIRTHWEIGHT IN POUNDS - 1ST BABY FROM THIS PREGNANCY
					"birthwgt_oz": true,	// BD-3 BIRTHWEIGHT IN OUNCES - 1ST BABY FROM THIS PREGNANCY
					"agepreg"    : true,	// AGE AT PREGNANCY OUTCOME
					"finalwgt"   : true		// FINAL POST-STRATIFIED AND ADJUSTED WEIGHT
				};

var filter2002FemResp = {
					"caseid"     : true,	// RESPONDENT ID NUMBER
					"pregnum"    : true,	// CAPI-BASED TOTAL NUMBER OF PREGNANCIES
					"totincr"    : true,	// TOTAL INCOME OF R'S FAMILY
					"age_r"      : true,	// R'S AGE AT INTERVIEW
					"numfmhh"    : true,	// NUMBER OF FAMILY MEMBERS IN HOUSEHOLD
					"parity"     : true,	// CAPI-BASED TOTAL # OF LIVE BIRTHS (ACCOUNTING FOR MULT BIRTH)
					"numkdhh"    : true,	// NUMBER OF BIO/ADOPT/RELATED/LEGAL CHILDREN UNDER AGE 18 IN HOUSEHOLD
					"cmbirth"    : true,	// CENTURY MONTH OF R'S BIRTH
					"cmintvw"    : true,	// CENTURY MONTH OF INTERVIEW DATE
					"cmmarrhx"   : true,	// CM FOR DATE OF 1ST MARRIAGE
					"evrmarry"   : true		// WHETHER R WAS EVER MARRIED
				};

var useFilter = true;
var filterNames = null;

var dctFileName = "";
var datFileName = "";
var logFileName = "";

var dbname = "2002FemResp";
var prefix = "nsfg_";

var currentDir = WScript.ScriptFullName;
currentDir = currentDir.substr(0, currentDir.lastIndexOf( "\\" ) + 1); // заканчивается на "\"

(function(dbname) {
	dctFileName = "D:\\MyProjects\\Scripts\\Python\\Think Stats\\data\\NSFG\\" + dbname + ".dct";
	datFileName = "D:\\MyProjects\\Scripts\\Python\\Think Stats\\data\\NSFG\\" + dbname + ".dat";
	logFileName = currentDir + dbname + ".json";
	filterNames = eval("filter" + dbname);
})(dbname);

// ------------------------ //

var ForReading = 1, ForWriting = 2, ForAppending = 8;
var fso = new ActiveXObject("Scripting.FileSystemObject");

var fLog = fso.OpenTextFile(logFileName, ForWriting, true);


/// /// /// collecting names... from the dictionary /// /// ///

var fDct = fso.OpenTextFile(dctFileName, ForReading, false);

var starts = [], types = [], names = [], lens = [];
var reDctColumn = /^ *_column\((\d+)\) +(\w+) +(\w+) +%(\d+)\w .*$/;

var i = 0;
var prevCol = 0, prevLen = 1;

while (!fDct.AtEndOfStream)
{
	var s = fDct.ReadLine();
	var arr = reDctColumn.exec(s);
	if(arr)
	{
		// fLog.WriteLine( '\t' + arr.slice(1) );
		if( prevCol + prevLen != parseInt(arr[1], 10) ) 
		{
			sErrorMsg =  i + " Errorr: " + (prevCol + prevLen) + "!=" + arr[1] ;
			fLog.WriteLine(sErrorMsg + "\n\t" + s);
			fError = true;
			break;
		}
		prevCol = parseInt(arr[1], 10);
		prevLen = parseInt(arr[4], 10);
		
		starts.push(prevCol - 1);
		lens.push(prevLen);
		types.push(arr[2]);
		names.push(arr[3]);
		
		i++;
		
	}
	else
	{
		// fLog.WriteLine(s);
	}
}
fDct.Close();

if(fError)
{
	fLog.Close();
	WScript.Echo(sErrorMsg);
	WScript.Quit (1);
}


/// /// /// collecting columns from the data file /// /// ///

var fDat = fso.OpenTextFile(datFileName, ForReading, false);

var i = 0;

fLog.WriteLine("const " + prefix + dbname + " = {");

for(var icol = 0; icol < starts.length; icol++)
{
	if(useFilter && filterNames)
	{
		if( !filterNames[ names[icol] ] ) continue;
	}
	
	fLog.Close();
	fDat.Close();
	
	fLog = fso.OpenTextFile(logFileName, ForAppending, false);
	fDat = fso.OpenTextFile(datFileName, ForReading, false);

	var column = [];

	while (!fDat.AtEndOfStream)
	{
		var s = fDat.ReadLine();
		
		if(s.length < starts[starts.length-1])
		{
			fLog.WriteLine(names[icol] + " : ***** : " + s);
			continue;
		}
		
		var d = s.substr(starts[icol], lens[icol]);
		d = d.replace(/^\s+/, "");
		d = d.replace(/\s+$/, "");
		if (d.length == 0) {
			d = '""';
		}
		else {
			// TODO:
			// var x = parseFloat(d);
			// if( isNaN(x) ) {.....}
		}
		column.push(d);
	}

	fLog.WriteLine( "\t" + names[icol] + ": {type: \""+ types[icol] + "\", data: [" + column + "]},") ;
	i++;

}

fLog.WriteLine("};");
 
fLog.Close();
fDat.Close();

WScript.Echo("Done! " + i + ": " + sErrorMsg);


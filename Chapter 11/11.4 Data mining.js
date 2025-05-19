"use strict";

// 11.4 Data mining

const nsfg = {

	preg: {id: "nsfg_2002FemPreg_ALL-id", src: "../data/nsfg.2002FemPreg.ALL.js", db: null, func: ___nsfg_2002FemPreg.CleanFemPreg},
	resp: {id: "nsfg_2002FemResp_ALL-id", src: "../data/nsfg.2002FemResp.ALL.js", db: null, func: ___nsfg_2002FemResp.CleanFemResp},

	loadScripts(callback)
	{
		// this function will work cross-browser for loading scripts asynchronously

		let id, s;

		for(const k in this)
		{
			if ( !Object.hasOwn(this, k) ) continue;
			if ( this[k].constructor === Function ) continue;

			id = this[k].id;
			s = document.getElementById(id);
			if ( !s )
			{

				s = document.createElement('script');
				s.id = id;
				s.type = 'text/javascript';
				s.src = this[k].src;
				document.body.appendChild(s);
			}
		}

		let r = false;
		s.onload = s.onreadystatechange = function() {
			if ( !r && (!this.readyState || this.readyState == 'complete') )
			{
				r = true;
				callback();
			}
		};

		return s;
	},

	removeScripts()
	{
		for (const k in this)
		{
			if ( !Object.hasOwn(this, k) ) continue;
			if ( this[k].constructor === Function ) continue;

			for (const q in this[k].db)
			{
				if ( !Object.hasOwn(this[k].db, q) ) continue;
				delete this[k].db[q];
			}
			this[k].db = null;

			const s = document.getElementById(this[k].id);
			if ( s ) s.outerHTML = "";
		}
	},

	cleanDBs()
	{
		for(const k in this)
		{
			if ( !Object.hasOwn(this, k) ) continue;
			if ( this[k].constructor === Function ) continue;

			const db = this[k].db;
			this[k].func(db);

			for(const p in db)
			{
				const fStr = db[p].type.indexOf("str") !== -1;
				if( fStr ) continue;

				const data = db[p].data;
				for(let i = 0; i < data.length; i++)
				{
					if(data[i] === "") data[i] = NaN;
				}
			}
		}

	}

};

/////////////////////////////////////////////

(function() {

	const title = "11.4 Data mining";

	printTitle(title);


	/////////////////////////////////////////////


	nsfg.loadScripts( datamining );

	///

	function datamining()
	{
		nsfg.preg.db = nsfg_2002FemPreg_all;
		nsfg.resp.db = nsfg_2002FemResp_all;

		nsfg.cleanDBs();

		//////

		function mapResp(respIds=nsfg.resp.db.caseid.data)
		{
			const respId2Index = {};

			for(let i = 0; i < respIds.length; i++)
			{
				const caseId = respIds[i];
				if(caseId in respId2Index) throw new RangeError("Error: not unique case id!");
				respId2Index[caseId] = i;
			}
			return respId2Index;
		}

		const respIndexOfCaseId = mapResp();

		//////

		function joinLive(preg=nsfg.preg.db)
		{
			// live && prglngth > 30

			const caseid      = preg.caseid.data;
			const outcome     = preg.outcome.data;
			const prglngth    = preg.prglngth.data;
			const totalwgt_lb = preg.totalwgt_lb.data;
			const agepreg     = preg.agepreg.data;

			const live = {
				pregRows: [],
				respRows: [],
				totalwgt_lb:[],
				agepreg: []
			};

			for (let i = 0; i < outcome.length; i++)
			{
				if ( outcome[i] !== 1 ) continue;
				if ( isNaN(totalwgt_lb[i]) ) continue;
				if ( isNaN(agepreg[i]) ) continue;
				if ( isNaN(prglngth[i]) ) continue;
				if ( prglngth[i] <= 30 ) continue;

				live.pregRows.push( i );
				live.respRows.push( respIndexOfCaseId[caseid[i]] );

				live.totalwgt_lb.push( totalwgt_lb[i] );
				live.agepreg.push( agepreg[i] );

			}

			return live;
		}

		const liveInner = joinLive();


		//////

		function resetLive(liveInner)
		{
			for(const k in liveInner)
			{
				if("pregRows|respRows".indexOf(k) === -1 ) delete liveInner[k];
			}
		}


		function joinColumns(columns=[{dbId:"preg", name:"totalwgt_lb"},
				                      {dbId:"preg", name:"agepreg"    }], liveInner)
		{
			const getX = (dbId, col, i) => {
				if (dbId==="preg") return nsfg.preg.db[col].data[liveInner.pregRows[i]];
				if (dbId==="resp") return nsfg.resp.db[col].data[liveInner.respRows[i]];
			};

			const isPushable = (i) => {
				for(let iCol = 0; iCol < columns.length; iCol++)
				{
					const col = columns[iCol];
					const x = getX(col.dbId, col.name, i);
					if(isNaN(x)) return false;
				}
				return true;
			};

			for(let iCol = 0; iCol < columns.length; iCol++)
			{
				liveInner[columns[iCol].name] = [];
			}

			for(let i = 0; i < liveInner.pregRows.length; i++)
			{
				if( !isPushable(i) ) continue;
				for(let iCol = 0; iCol < columns.length; iCol++)
				{
					const col = columns[iCol];
					const x = getX(col.dbId, col.name, i);
					liveInner[col.name].push(x);
				}
			}
		}

		/////

		console.log("\ndt =", ("***", new Date()).getTime() - time_start);


		////////////////////////////////////

		const title2 = "11.5 Prediction";

		printTitle(title2);

		////////////////////////////////////

		const Results = [];

		{
			[[nsfg.preg.db, "preg"], [nsfg.resp.db, "resp"]].forEach( ([db, dbId]) => {
				let count = 0;
				for(const colName in db)
				{
					if ( !Object.hasOwn(db, colName) ) continue;
					if ( db[colName].type.indexOf("str") !== -1 ) continue;
					if ( "totalwgt_lb.agepreg".indexOf(colName) !== -1 ) continue;

					resetLive(liveInner);

					const columns = [
						{dbId:"preg", name:"totalwgt_lb"},
						{dbId:"preg", name:"agepreg"},
						{dbId:  dbId, name:colName}
					];
					joinColumns(columns, liveInner);

					if( liveInner[colName].length < db[colName].data.length / 2) continue;

					const variance = statistic.Variance(liveInner[colName]) ;
					if(variance < 1e-7) continue;

					const xs = [{[colName]:liveInner[colName]}, {'agepreg':liveInner.agepreg}];
					const ys = liveInner.totalwgt_lb;
					const results = ols.fit1(xs, ys);

					Results.push( [++count, dbId, colName, db[colName].stands_for, results] )
				}
			});

			Results.sort( (a, b) => b[4].R2 - a[4].R2 );
			Results.forEach( ([count, dbId, colName, stands_for, results]) => {
				console.log( count, dbId, colName, stands_for );
				console.log( "totalwgt_lb ~ " + colName + " + agepreg:", ...ols.output(results) );
			});
		}


		/////

		{
			nsfg.preg.db["race==1"] = {data:[]};
			nsfg.preg.db["race==2"] = {data:[]};
			nsfg.preg.db["race==3"] = {data:[]};
			nsfg.preg.db["babysex==1"] = {data:[]};
			nsfg.preg.db["nbrnaliv > 1"] = {data:[]};

			nsfg.preg.db.caseid.data.forEach( (_, i) => {
				nsfg.preg.db["race==1"].data[i] = +(nsfg.preg.db.race.data[i] === 1);
				nsfg.preg.db["race==2"].data[i] = +(nsfg.preg.db.race.data[i] === 2);
				nsfg.preg.db["race==3"].data[i] = +(nsfg.preg.db.race.data[i] === 3);
				nsfg.preg.db["babysex==1"].data[i] = +(nsfg.preg.db.babysex.data[i] === 1);
				nsfg.preg.db["nbrnaliv > 1"].data[i] = +(nsfg.preg.db.nbrnaliv.data[i] > 1);
			});

			nsfg.resp.db["paydu==1"] = {data:[]};

			nsfg.resp.db.caseid.data.forEach( (_, i) => {
				nsfg.resp.db["paydu==1"].data[i] = +(nsfg.resp.db.paydu.data[i] === 1);
			});


			resetLive(liveInner);

			const columns = [
				{dbId:"preg", name:"totalwgt_lb" },
				// {dbId:"preg", name:"race==1"   },
				{dbId:"preg", name:"race==2"   },
				{dbId:"preg", name:"race==3"   },
				{dbId:"preg", name:"babysex==1"},
				{dbId:"preg", name:"nbrnaliv > 1"},
				{dbId:"resp", name:"paydu==1"  },
				{dbId:"preg", name:"agepreg"   },
				{dbId:"resp", name:"totincr"   }
			];
			joinColumns(columns, liveInner);

			const xs = [];
			for(let i = 1; i < columns.length; i++) {
				const colName = columns[i].name;
				xs.push({[colName]: liveInner[colName]});
			}
			const ys = liveInner.totalwgt_lb;
			const results = ols.fit1(xs, ys);

			const formula = "totalwgt_lb ~ " + xs.map( (x) => Object.keys(x)[0] ).join(" + ");
			console.log( '\x1B[48;2;255;255;255;38;2;110;0;55;22m' + formula + ':\x1B[m', ...ols.output(results) );
		}

		///

		resetLive(liveInner);
		nsfg.removeScripts();

		///
		console.log("\ndt =", ("***", new Date()).getTime() - time_start);
	}


})();

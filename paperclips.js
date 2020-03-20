/**
 * FUNCTIONS AND INIT
 */
cfg_disablePrints = false
function println(line)
{
	if (cfg_disablePrints == false)
		console.log(line);
}

// priorities for late game
projects.forEach(function(proj) { proj.priority = 0; });

project132.priority = 1; // Monment to the Driftwar Fallen

/**
 * COLOURER
 */
if (typeof colourer !== 'undefined')
	clearInterval(colourer);
var colourer = setInterval(function() 
{ 
  if (parseFloat(document.getElementById("clipmakerRate").innerHTML.replace(/,/g,'')) > parseFloat(document.getElementById("avgSales").innerHTML.replace(/,/g,'')) )
  {
      document.getElementById("clipmakerRate").style = "color:green";
  }
  else
  {
      document.getElementById("clipmakerRate").style = "color:red;font-weight:bold";
  }
}, 2000);

/**
 * CLICKER
 */
var cfg_disableClicker = true;
if (typeof clicker !== 'undefined')
	clearInterval(clicker);
var clicker = setInterval(function() 
{ 
	if (cfg_disableClicker == true)
		return;
	clipClick(10)
}, 1000);

/**
 * PRICER
 */
var cfg_disablePricer = true;
if (typeof pricer !== 'undefined')
	clearInterval(pricer);
var pricer = setInterval(function() {
	if (cfg_disablePricer == true)
		return;

	/*if (demand < 7)
	{
		println("[PRICER] No demand!");
		if (margin > 0.01)
		{
			lowerPrice();
			println("[PRICER] No demand, lowering price to " + margin);
		}
		return;
	}
	*/

	/*
	// this shit just makes a mess
	if (unsoldClips < clipRate * 3) // 4x buffer of unsold clips?
	{
		raisePrice();
		raisePrice();
		raisePrice();
		println("[PRICER] Buffering clips: raising price to " + margin);
		return;
	}
	else if (unsoldClips > clipRate * 6 && unsoldClips > 3000) // 3k limit otherwise it gets close to zero and price gets too low early game
	{
		if (margin < 0.04)
		{
			if (Math.random > 0.5) // 50% chance we'll skip lowering price to smooth it out a bit
			{
				println("[PRICER] De-buffering clips: lowering price to " + margin);
				lowerPrice();
			}
		}
		else
		{

		}
		return;
	}
	else
	{
		println("[PRICER] No rules for this scenario!")
	}*/

	if (avgSales < clipRate)
	{
		if (margin > 0.01)
		{
			println("[PRICER] Lowering price to " + margin);
			lowerPrice();
		}
	}
	else
	{
		println("[PRICER] Raising price to " + margin);
		raisePrice();
	}

	return;

	/*clipTarget = clips/100;
	if (clips > 10000)
		clipTarget = clipTarget + 100;
	if (unsoldClips > clipTarget )
	{
		if (margin > 0.01)//  && demand < 50) // 500% demand 
		{
			lowerPrice();
			if (unsoldClips > 1000000 || demand < 10) // if demand is below 100 or they're piling up fast, increase the rate at which we lower the price
			{
				//println("[PRICER] Triple lower!")
				if (margin > 0.01)
					lowerPrice();
				if (margin > 0.01)
					lowerPrice();
			}
			println("[PRICER] Lowering price to " + margin);
		}
	}
	else 
	{
		raisePrice();
		raisePrice();
		raisePrice();

		println("[PRICER] Raising price to " + margin);

	}
	*/
}, 3000);

/**
 * STAGE 1 INVESTOR
 */
//var stage1ProjectBuyList = [ 'projectButton1', 'projectButton3', 'projectButton4', 'projectButton5', 'projectButton6', 'projectButton7', 'projectButton8', 'projectButton9', 'projectButton10', 'projectButton10b', 'projectButton11','projectButton12', 'projectButton13', 'projectButton14', 'projectButton15', 'projectButton16', 'projectButton17', 'projectButton19','projectButton20', 'projectButton21', 'projectButton22','projectButton23', 'projectButton24', 'projectButton25', 'projectButton26', 'projectButton27', 'projectButton28', 'projectButton29', 'projectButton30', 'projectButton31', 'projectButton34', 'projectButton40', 'projectButton40b','projectButton42', 'projectButton50', 'projectButton51', 'projectButton60', 'projectButton61', 'projectButton62', 'projectButton63', 'projectButton64', 'projectButton65', 'projectButton66', 'projectButton70', 'projectButton119'];
var stage1ProjectBuyList = [ 'project1', 'project3', 'project4', 'project5', 'project6', 'project7', 'project8', 'project9', 'project10', 'project10b', 'project11','project12', 'project13', 'project14', 'project15', 'project16', 'project17', 'project19','project20', 'project21', 'project22','project23', 'project24', 'project25', 'project26', 'project27', 'project28', 'project29', 'project30', 'project31', 'project34', 'project40', 'project40b','project42', 'project50', 'project51', 'project60', 'project61', 'project62', 'project63', 'project64', 'project65', 'project66', 'project70', 'project119'];
var stage1HighPriorityList = [ { projID: 'project26', projRequirement: 10000, projRequirementType: "ops" }  ];
var stage1ProjectEndList = [ 'projectButton35']; // this needs to be a button string because of the way we check for end conditions
var cfg_disableInvestor = true;
if (typeof investor !== 'undefined')
	clearInterval(investor);
var investor = setInterval(function() { 
	if (cfg_disableInvestor == true)
	{
		//println("[INVESTOR] Investor disabled, skipping");
		return;
	}

	runModeling();

	/**
	 * PROJECT MANAGEMENT
	 */
	// Look through the list of high priority projects; if any are here and the conditions are right, mark them HP
	var highPriorityActiveProject = false;
	for (let proj of stage1HighPriorityList)
	{
		if (proj.projRequirementType == "ops")
		{
			if (operations >= proj.projRequirement)
			{
				println(proj);
				println("Looking at " + proj.prodID);
				
				// Find the actual project object and update it
				var prj = window[proj.projID];
				prj.priority = 1;

				console.log("Priority: " + prj.priority);

				if (prj.element === null || prj.flag == 1)
					continue;
				else
				{
					//println("HIGH PRIORITY PROJECT " + proj.projID);
					highPriorityActiveProject = true;
				}
			}
		}
	}

	// Now actually let's buy stuff
	//for (let projectBuy of stage1ProjectBuyList)
	for (let projectBuy of activeProjects)
	{
		//println("[INVESTOR] projectBuy: " +  prj.title);
		// if we're not in the list of pre-approved projects, let's skip
		if (stage1ProjectBuyList.indexOf(projectBuy.id.replace("Button","")) == -1)
			continue;  

		// If we have a high priority project, we need to check to see if this is one of them. If not we might as well skip it. 
		if (highPriorityActiveProject == true)
		{
			if ( projectBuy.priority != 1)
			{
				println("[INVESTOR] projectBuy " +  projectBuy.title + " is not a priority project, skipping" + " / " + projectBuy.id);
				continue;
			}
		}

		// If this element is in our End List
		// FIXME: this section has to fire first, otherwise if it's processed below it won't trigger the end-game bits
		if (stage1ProjectEndList.indexOf(projectBuy.id) !== -1)
		{
			// .. and we can afford it, let's clear this stage and move on. 
			if ( projectBuy.cost() )
			{
				cfg_disableDroneManager = false; // enable the drone manager
				clearInterval(investor); // disable the investor interval
				clearInterval(clicker);
				clearInterval(pricer);
				clearStage1Graphs();

				initGraphs(2).then(result => stage2Graphs()).then(resolve=>loadStage2Graphs());
				return;			
			}
		}

		if ( projectBuy.cost() )
		{
			println("[INVESTOR] projectBuy - buying " +  projectBuy.title + " / " + projectBuy.id)
			projectBuy.effect();
			break; // FIXME: multiple of these running in a row and the cost() fails to restrict it from buying. Probably another function call to recalculate missing.
		}
		else
		{
			println("[INVESTOR] projectBuy - can't afford " +  projectBuy.title + " / " + projectBuy.id)
		}		
	}

	/**
	 * STAGE ENDS
	 */
	/*
	for (let projectBuy of stage1ProjectEndList) // assume this array will only ever have one element for now (lazy)
	{
		if (typeof document.getElementById(projectBuy) !== "undefined" && document.getElementById(projectBuy) !== null)
		{
			projectObj = document.getElementById(projectBuy);		

			if (projectObj.disabled == true)
			{
				tmpProjectBuys = tmpProjectBuys + " | " + projectBuy;
			}
			else if (projectObj.disabled == false)
			{
				println("[INVESTOR] END GAME! Getting " + projectBuy + "");
				cfg_disableDroneManager = false; // enable the drone manager
				clearInterval(investor); // disable the investor interval
				clearInterval(clicker);
				clearInterval(pricer);				
				projectObj.click();

				return; // skip further processing, we're done here
			}
		}
	}
	*/

	if (typeof projectButton38 !== "undefined" && projectButton38.disabled == true && portTotal+funds >= 8500000) // was 7m, way too early
	{
		println("[INVESTOR] Mid game: stockpiling for Full Monopoly");
		investStratElement.selectedIndex = 0; // Set to Low Risk to remove cash faster(?)
		investWithdraw();
		return;
	}
	else if (typeof projectButton38 !== "undefined" && projectButton38.disabled == false)
	{
		if (funds >= 10000000 && yomi >= 3000)
			projectButton38.click();

		investStratElement.selectedIndex = 2; // Set to high risk to cash up
	}

	/**
	 * HOSTILE TAKEOVER
	 */
	if (typeof projectButton37 !== "undefined" && projectButton37.disabled == true && (portTotal >= 1000000*3 && funds < 1000000*1.1))
	{
		println("[INVESTOR] Mid game: withdrawing cash to get project37 (Hostile Takeover)");
		investStratElement.selectedIndex = 0; // Set to low risk to get cash out sooner
		investWithdraw();

		// This won't process immediately after withdraw even if all the funds are there so we need to wait a few loops until cash accumulates
		println("[INVESTOR] ERROR: withdrew cash but couldn't buy project37, skipping rest of processing");
		return;
	}
	else if (typeof projectButton37 !== "undefined" && projectButton37.disabled == false && funds > 1000000*1.1)
	{
		if (project37.cost() == true)
			projectButton37.click();
	}

	/**
	* TOKENS OF GOODWILL
	*/
   /*if (typeof projectButton40b !== "undefined" && projectButton40b.disabled == true)
   {
	   println("[INVESTOR] Mid game: stockpiling for Token of Goodwill");
	   investWithdraw();

	   return;
   }
   else if (typeof projectButton40b !== "undefined" && projectButton40b.disabled == false)
   {
	   // Get the amount on the button:
	   let goodwillCost = projectButton40b.innerHTML.match(/\(\$(.*?)\)/g).toString().replace(/(,|\(|\)|\$)/g,'')
	   if (funds >= goodwillCost*1.5)
		   projectButton40b.click();
   }*/

	// If we're at the late game, we're trying to get to 100 trust to RELEASE THE HYPNODRONES
	// But don't do it if we still have Tokens of Goodwill
	if (trust >= 98 && trust <= 100 && typeof projectButton40b == "undefined")
	{
		println("[INVESTOR] Late game! Let's just stockpile money.");
		investWithdraw();
		return;
	}


	var buyStr = "";
	if (wire == 0)  // FIXME this isn't great
	{ 
		buyStr = buyStr + "3x wire";

		if (wireCost*3 < funds)
			for ($i = 0; $i < 3; $i++)
				buyWire();
		else
			buyWire();
	} 
	else if (wire < 2000) 
	{ 
		buyStr = buyStr + "1x wire";
		buyWire(); 

		if (clips > 500000000)
		{
			for ($i = 0; $i < 10; $i++)
				buyWire()
		}
		return;
	} 

	// If we're in the late game and have lots of clips, better to have a few extra things of wire to keep average up
	if (clips > 500000000 && wire < 1000000)
	{
		println("[INVESTOR] Late game bulk wire buying");
		for ($i = 0; $i < 10; $i++)
			buyWire()
	}	

	//if (megaClipperDiv.style.display !== "none" || btnMakeMegaClipperElement.disabled == false)
	if (getComputedStyle(document.getElementById("megaClipperDiv")).display !== "none")
	{
		if (megaClipperCost < 7000000 && bankroll > megaClipperCost*10 && marketingLvl >= 12 && megaClipperLevel <= 100)
		{
			println("[INVESTOR] Plenty of spare bankroll, making a withdrawal to buy MEGAclippers while we have < 100 of them");
			investWithdraw();
			makeMegaClipper();
			investDeposit();
		}
		if (megaClipperCost < funds)
		{
			buyStr = buyStr + "MEGAclipper";
			makeMegaClipper();
		}
	}
	else if (marketingLvl < 4 && clipperCost >= 60)
	{
		println("[INVESTOR] Skipping clipper buy to try to early boost Marketing");
	}
	else if (clipperCost < funds && (funds > 200 || clipperCost < 20) && clipperCost < adCost*0.25) // 25% ad cost should help speed up early levels by getting some quick adbuys
	{
		buyStr = buyStr + "clipper";
		makeClipper();
	}

	if (adCost < funds)
	{
		if (marketingLvl < 15 || portTotal > adCost*5 ) // at 14, it costs $819,200, so it's getting expensive
		{
			buyStr = buyStr + "marketing";
			buyAds();
		}
		else if (marketingLvl < 4)
		{
			buyAds();
		}
		else if (adCost*4 < funds)
		{
			buyAds();
		}
		else
		{
			println("[INVESTOR] Can afford marketing, but not buying it...?");
		}
	}

	if (buyStr == "")
		buyStr = "nothing!";

	println("[INVESTOR] Buying " + buyStr);
	// https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
	if (getComputedStyle(document.getElementById("investmentEngine")).display == "none")
	{
		//println("[INVESTOR] Investing not yet available, it seems - skipping"); 
	}
	else
	{
		// Randomly withdraw at the end of the cycle to clear up a bunch of funds for upgrades

		let randomChance = 0.1;
		if (portTotal > 40000000)
			randomChance = 0.5;
		else if (funds == 0)
			randomChance = 1;	

		if (Math.random() < 0.1 && btnWithdraw.disabled == false )
		{
			println("[INVESTOR] Randomly withdrawing investment funds! Chance: " + randomChance);
			investWithdraw();
		}
		else
		{
			println("[INVESTOR] Depositing " + funds); 
			investDeposit(); 
			if (investLevel > 4)
				investStratElement.selectedIndex = 2; // Set to High Risk
			else if (investLevel > 2)
				investStratElement.selectedIndex = 1; // Set to Medium Risk
			else
				investStratElement.selectedIndex = 0; // Set to Medium Risk
		}
	}

}, 5000);

/**
 * MANAGE COMPUTATIONAL RESOURCES
 * */ 
  
var cfg_disableManageComputational = false;
if (typeof manageComputational !== 'undefined')
	clearInterval(manageComputational);
var manageComputational = setInterval(function()
{
	if (cfg_disableManageComputational === true)
	{
		return;
	}

	// Late game so we can get to 300k ops needed for one of the end options
	if (processors > 1000 && memory < 300)
	{
		addMem();
	}

	if (trust > (processors + memory))
	{
		if (processors < (memory / 2) || memory > 250)
		{
			println("[COMPUTE] Spare trust, adding processor");
			addProc();
		}
		else
		{
			println("[COMPUTE] Spare trust, adding memory");
			addMem();
		}
	}

	if (swarmGifts > 0)
	{
		if (processors < (memory / 2) || memory > 250)
		{
			println("[COMPUTE] Spare swarm gifts, adding processor");
			addProc();
		}
		else
		{
			println("[COMPUTE] Spare swarm gifts, adding memory");
			addMem();
		}
	}	
}, 100)

/*
 * QUANTUM COMPUTATIONS
 */
if (typeof quantum !== 'undefined')
	clearInterval(quantum);
var quantum = setInterval(function()
{
	/*if (qChip0.value > 0 && qChip1.value > 0 && qChip2.value > 0)*/
	//if (qChip0.value + qChip1.value + qChip2.value + qChip3.value + qChip4.value + qChip5.value + qChip6.value + qChip7.value + qChip8.value + qChip9.value > 0)
	if (qChips[0].value + qChips[1].value + qChips[2].value + qChips[3].value + qChips[4].value + qChips[5].value + qChips[6].value + qChips[7].value + qChips[8].value + qChips[9].value > 0)
	{
		/*println("[QUANTUM] Quantuming: " + qChip0.value);*/
		qComp();
	}
}, 100);

/*
 * STRATEGIC MODELLING - YOMIIIIIIIIIIIIIIIII
 */
var cfg_disableImproveInvestments = false;
var cfg_disableModeling = false;
/*
if (typeof modeling !== 'undefined')
	clearInterval(modeling);
var modeling = setInterval(function()
*/
function runModeling()
{
	if (strategyEngine.style.display == "none") // check strategyEngineFlag instead
		return false;

	stratPickerElement.options.selectedIndex = stratPickerElement.options.length - 1;		

	if (cfg_disableModeling == true)
	{
		println("[MODELING] skipping modelling");
		return;
	}

	if (btnNewTournamentElement.disabled == false) 
	{
		println("[MODELING] New Tourney");
		newTourney();
		if (btnRunTournamentElement.disabled == false)
		{
			runTourney();		
		}
		else
		{
			println("[MODELING] ERROR: Tried to run a tournament but the button was disabled?");
		}
	}

	if (cfg_disableImproveInvestments == false)
	{
		if (btnImproveInvestments.disabled == false)
		{
			if (investLevel < 8)
			{
				println("[MODELING] Upgrade Investment Engine");
				investUpgrade();
			}
			else
			{
				//println("[MODELING] Investment Engine already at level 7, skipping any more upgrades to save Yomi");
			}
		}
	}
	else
	{
		/*println("[MODELING] Skipping upgrade of Investment Engine");*/
	}
}
//}, 1000);



/** STAGE TWO */
/* SOLAR/DRONE PHASE INVESTOR */
//var stage2ProjectBuyList = [ 'projectButton18', 'projectButton127', 'projectButton41', 'projectButton43', 'projectButton44', 'projectButton45', 'projectButton100', 'projectButton101', 'projectButton102', 'projectButton110', 'projectButton111', 'projectButton112', 'projectButton119', 'projectButton126', 'projectButton125' ];
var stage2ProjectBuyList = [ 'project18', 'project127', 'project41', 'project43', 'project44', 'project45', 'project100', 'project101', 'project102', 'project110', 'project111', 'project112', 'project119', 'project126', 'project125' ];
var stage2ProjectEndList = [ 'projectButton46'];
var stage2HighPriorityList = [];

var cfg_disableDroneManager = true;
if (typeof droneManager !== 'undefined')
	clearInterval(droneManager);
var droneManager = setInterval(function() { 
	if (cfg_disableDroneManager == true)
	{
		//println("[DRONE] Drone Manager disabled, skipping");
		return;
	}

	runModeling();

	if (swarmSliderDivElement.style.display !== "none")
	{
		let randomChance = 0.02;
		if (factoryLevel < 20) // more boosts early game to try to get factories up faster
			randomChance = 0.1;

		if (slider.value < 190)
		{
			//println("[DRONE] Slider at " + slider.value);
			slider.value = Number(slider.value) + 10;
		}
		else
		{
			if (Math.random() < randomChance)
			{
				println("[DRONE] Slider randomly set to Work | Chance: " + randomChance);
				slider.value = 10;
			}
		}
	}


	/**
	 * PROJECT MANAGEMENT
	 */
	// Don't do anything until we have the projects to get started
	/**
	 * PROJECT MANAGEMENT
	 */
	// Look through the list of high priority projects; if any are here and the conditions are right, mark them HP
	var highPriorityActiveProject = false;
	for (let proj of stage2HighPriorityList)
	{
		if (proj.projRequirementType == "ops")
		{
			if (operations >= proj.projRequirement)
			{
				println(proj);
				println("Looking at " + proj.prodID);
				
				// Find the actual project object and update it
				var prj = window[proj.projID];
				prj.priority = 1;

				console.log("Priority: " + prj.priority);

				if (prj.element === null || prj.flag == 1)
					continue;
				else
				{
					//println("HIGH PRIORITY PROJECT " + proj.projID);
					highPriorityActiveProject = true;
				}
			}
		}
	}

	// Now actually let's buy stuff
	//for (let projectBuy of stage2ProjectBuyList)
	for (let projectBuy of activeProjects)
	{
		//println("[INVESTOR] projectBuy: " +  prj.title);
		// if we're not in the list of pre-approved projects, let's skip
		if (stage2ProjectBuyList.indexOf(projectBuy.id.replace("Button","")) == -1)
			continue;

		// If we have a high priority project, we need to check to see if this is one of them. If not we might as well skip it. 
		if (highPriorityActiveProject == true)
		{
			if ( projectBuy.priority != 1)
			{
				println("[INVESTOR] projectBuy " +  projectBuy.title + " is not a priority project, skipping" + " / " + projectBuy.id);
				continue;
			}
		}

		// If this element is in our End List
		// FIXME: this section has to fire first, otherwise if it's processed below it won't trigger the end-game bits
		if (stage2ProjectEndList.indexOf(projectBuy.id) !== -1)
		{
			// .. and we can afford it, let's clear this stage and move on. 
			if ( projectBuy.cost() )
			{
				cfg_disableDroneManager = true;
				cfg_disableProbeLauncher = false;
				cfg_disableProbesManager = false;
				clearInterval(droneManager);
				clearStage2Graphs();

				initGraphs(3).then(result => stage2Graphs()).then(resolve=>loadStage2Graphs());
				return;			
			}
		}

		if ( projectBuy.cost() )
		{
			println("[INVESTOR] projectBuy - buying " +  projectBuy.title + " / " + projectBuy.id)
			projectBuy.effect();
			break; // FIXME: multiple of these running in a row and the cost() fails to restrict it from buying. Probably another function call to recalculate missing.
		}
		else
		{
			println("[INVESTOR] projectBuy - can't afford " +  projectBuy.title + " / " + projectBuy.id)
		}		
	}

	/*
	for (let projectBuy of stage2ProjectBuyList)
	{
		if (typeof document.getElementById(projectBuy) !== "undefined" && document.getElementById(projectBuy) !== null)
		{
			projectObj = document.getElementById(projectBuy);		

			if (projectObj.disabled == true)
			{
				println("[DRONE] Waiting for " + projectBuy + " to get started");
				//return;
			}
			else if (projectObj.disabled == false)
			{
				println("[DRONE] Getting " + projectBuy + "");
				projectObj.click();
				break;
			}
		}
	}

	for (let projectBuy of stage2ProjectEndList)
	{
		if (typeof document.getElementById(projectBuy) !== "undefined" && document.getElementById(projectBuy) !== null)
		{
			projectObj = document.getElementById(projectBuy);		

			if (projectObj.disabled == true)
			{
				println("[DRONE] Waiting for " + projectBuy + " to get started");
				//return;
			}
			else if (projectObj.disabled == false)
			{
				println("[DRONE] END GAME! " + projectBuy + "");
				cfg_disableDroneManager = true;
				cfg_disableProbeLauncher = false;
				cfg_disableProbesManager = false;
				clearInterval(droneManager);
		
				projectObj.click();
				break;
			}
		}
	}*/

	if (entertainButtonDiv.style.display !== "none" && btnEntertainSwarm.disabled == false && creativity > 10000) 
	{
		println("[DRONE] Swarm needs entertainment, fixing");
		entertainSwarm(); 
	}	

	if (availableMatter == 0 && wire == 0)
	{
		println("[DRONE] END GAME! Rebooting factories to get clips");
		factoryReboot();
	}

	var droneMultiplier = 1;

	if ( (harvesterCost + wireDroneCost) * 1000 < (unusedClips - unusedClips/10))
	{
		droneMultiplier = 1000;
		println("[DRONE] Drone Multiplier changed to " + droneMultiplier + ", plenty of spare clips");
	}
	else if ( (harvesterCost + wireDroneCost) * 100 < (unusedClips - unusedClips/10))
	{
		droneMultiplier = 100;
		println("[DRONE] Drone Multiplier changed to " + droneMultiplier + ", plenty of spare clips");
	}
	else if ( (harvesterCost + wireDroneCost) * 10 < (unusedClips - unusedClips/10))
	{
		droneMultiplier = 10;
		println("[DRONE] Drone Multiplier changed to " + droneMultiplier + ", plenty of spare clips");
	}

	/* Leave a buffer */ 
	/* This needs to happen first otherwise power shortages can occur  */
	var powerConsumptionRate = (factoryPowerRate*factoryLevel) + wireDroneLevel + harvesterLevel;
	var safetyMargin = powerConsumptionRate / 10;

	//if (getComputedStyle(document.getElementById("powerDiv")).display == "none" || getComputedStyle(document.getElementById("powerDiv")).display == "none")
	if (project127.flag !== 1)
	{
		println("[DRONE] Solar div not visible yet, skipping");
		return;
	}

	if ( (powerConsumptionRate + safetyMargin) >= parseFloat(document.getElementById("powerProductionRate").innerHTML.replace(/,/g,'')))
	{
		if (storedPower > (powerConsumptionRate*300) )
		{
			println("[DRONE] Short on power, but plenty stored, so not buying new stuff");
		}
		else
		{
			let solarMultiplier = droneMultiplier / 10;
			if (solarMultiplier < 1)
				solarMultiplier = 1;

			println("[DRONE] Buying solar farm (" + solarMultiplier + ") + battery");
			if (farmCost*solarMultiplier < unusedClips)
			{
				makeFarm(solarMultiplier);

				batteryMultipler = solarMultiplier/10;
				if (batteryMultipler < 1)
					batteryMultipler = 1;

				makeBattery(batteryMultipler);
			}
			else
			{
				println("[DRONE] WARNING: wanted to buy solar farm but can't afford it, skipping the rest of processing until we can");
				if (farmCost < unusedClips)
				{
					println("[DRONE] Can afford one solar farm though!");
					makeFarm(1);

					if (Math.random() > 0.7)
						makeBattery(1);
				}

				if (wireDroneLevel == 0 && harvesterLevel == 0)
				{}
				else
					return;
			}
		}
	}
	else
	{
		println("[DRONE] Power is at " + ( powerConsumptionRate + safetyMargin));
		if (batteryCost < unusedClips / 100 && batteryLevel * 10000 < 10000000 && factoryLevel > 50)
		{
			println("[DRONE] Plenty of clips and battery capacity is low, buying more batteries (10x)");
			makeBattery(10);
		}
		else if (batteryCost < unusedClips / 10 && batteryLevel * 10000 < 10000000 && factoryLevel > 50)
		{
			println("[DRONE] Plenty of clips and battery capacity is low, buying more batteries (1)");
			makeBattery(1);
		}
	}

	// WAit for the 1 sextillion clips mark
	if (factoryLevel >= 76 && project102.flag == 0) // FIXME NOT SURE IF THIS FLAG IS RIGHT
	{
		println("[DRONE] Waiting for project102, FIXME");
		return;
	}
	else if (wire > 1000000000000 && factoryLevel >= 70 && factoryCost < unusedClips)
	{
		println("[DRONE] Making late-game factory with no headroom");
		makeFactory();
		if (availableMatter == 0) // If we're at the end game, stock up on factories
		{
			while (factoryCost < unusedClips)
			{
				console.log("[DRONE] Bulk buying factory!!!")
				makeFactory();
			}
		}
	}
	else if (wire > 1000000000000 && factoryLevel >= 20 && factoryCost >= unusedClips)
	{
		println("[DRONE] Backlog of wire, waiting until we can make some factories"); // FIXME this might not be useful, might be too late?
		// if we end up with 2k harv & 4k wire with only 20 factories that's not enough factories!
		return;
	}
	else if (factoryCost < unusedClips && factoryLevel <= 70) // at 70 they cost > 200 quintillion; the big target at this point is 1 sextillion chips
	{
		println("[DRONE] Making factory");
		makeFactory();
	}
	else if (factoryCost*2 < unusedClips && factoryLevel >= 70  &&  wire > 0) 
	{
		println("[DRONE] Making late-game factory with headroom of 2x factory cost");
		makeFactory();
	}
	else
	{
		if (factoryLevel >= 10 && factoryLevel <= 20 && harvesterLevel > 100 && wireDroneLevel > 100)
		{
			if (Math.random() < 0.2)
			{
				println("[DRONE] Randomly allowing processing to continue!");
			}
			else
			{
				println("[DRONE] Not enough clips to make a factory, skipping processing until we can get to 20!");
				return;
			}
		}
	}

	if (availableMatter == 0)
	{
		println("[DRONE] NO MATTER LEFT! doing nothing");
		slider.value = 190;
		return;
	}	

	if (wire > 10000000000 && factoryLevel < 20)
	{
		println("[DRONE] Big wire stockpile, waiting until we can buy some factories");
		return;
	}

	if (getComputedStyle(document.getElementById("harvesterDiv")).display == "none" || getComputedStyle(document.getElementById("wireDroneDiv")).display == "none")
	{
		println("[DRONE] FIXME: Harvester/Wire div not visible, returning");
		return; 
	}

	if (acquiredMatter == 0)
	{
		if (harvesterCost*droneMultiplier < unusedClips)
		{
			println("[DRONE] Making harvester * " + droneMultiplier);
			makeHarvester(droneMultiplier);
		}
	}
	else
	{
		var adjMultiplier;
		if (droneMultiplier >= 10)
		{
			//adjMultiplier = droneMultiplier/10;
			if (wireDroneLevel >= harvesterLevel)
			{
				adjMultiplier = 1;
				println("[DRONE] We have plenty of matter, reducing harvester intake to " + adjMultiplier);
				makeHarvester(adjMultiplier);
			}
			else
			{
				println("[DRONE] Skipping harvest drones to try to equalise levels of wire and harvester drones");
			}
		}
		else
			println("[DRONE] Plenty of matter, skipping harvester purchase");
	}
	
	if (wireDroneCost*droneMultiplier < unusedClips && wireDroneLevel < harvesterLevel*2)
	{
		println("[DRONE] Making wireDrone * " + droneMultiplier);
		makeWireDrone(droneMultiplier);
	}
	else if (wireDroneCost < unusedClips)
	{
		println("[DRONE] Making single wireDrone, can't afford multiplier");
		makeWireDrone(1);
	}
}, 5000);


/*
if (typeof probesTotalRate !== 'undefined')
	clearInterval(probesTotalRate);
var tmp_lastProbeCount = 0;
var tmp_lastProbesLostHaz = 0;
var tmp_probeDescendents = 0;
var probesTotalRate = setInterval(function()
{
	//var current = parseFloat(document.getElementById("probesTotalDisplay").innerHTML.replace(/,/g,''));
	
	var diff = probeCount - tmp_lastProbeCount;
	println("[PROBERATES] TOTAL: " + Math.round(diff).toLocaleString() + " difference in probes: ");
	tmp_lastProbeCount = probeCount;
	
	diff = probesLostHaz - tmp_lastProbesLostHaz;
	println("[PROBERATES] HAZARDS: " + Math.round(diff).toLocaleString() + " difference in probes: ");
	tmp_lastProbesLostHaz = probesLostHaz;
	
	diff = probeDescendents - tmp_probeDescendents;
	println("[PROBERATES] DESCENDENTS: " + Math.round(diff).toLocaleString() + " difference in probes: ");
	tmp_probeDescendents = probeDescendents;

	
}, 2000);
*/

/**
 * PROBE LAUNCHER 
 */
if (typeof probeLauncher !== 'undefined')
	clearInterval(probeLauncher);
var cfg_disableProbeLauncher = true;

var probeLauncher = setInterval(function()
{
	if (cfg_disableProbeLauncher == true)
		return;
	makeProbe();
}, 100);


/**
 * PROBE MANAGER
 */
var cfg_disableProbesManager = true;
var probeMode = "";
var lastProbeMode = "";
//var stage3ProjectBuyList = [ 'projectButton120', 'projectButton121', 'projectButton128', 'projectButton129', 'projectButton130', 'projectButton131', 'projectButton132', 'projectButton133', 'projectButton134', 'projectButton218' ];
var stage3ProjectBuyList = [ 'project120', 'project121', 'project128', 'project129', 'project130', 'project131', 'project132', 'project133', 'project134', 'project218' ];
var stage3HighPriorityList = [];

if (typeof probesManager !== 'undefined')
	clearInterval(probesManager);
var probesManager = setInterval(function()
{
	if (cfg_disableProbesManager == true)
	{
		return;
	}

	if (slider.value < 190)
	{
		println("[PROBES] Slider at " + slider.value);
		slider.value = Number(slider.value) + 10;
	}
	else
	{
		if (Math.random() < 0.05)
		{
			println("[PROBES] Slider randomly set to Work");
			slider.value = 10;
		}
	}
	
	if (btnIncreaseProbeTrust.disabled == false && yomi > 10000) //  FIXME: need to save a buffer of 45000 yomi for late game to buy OODA Loop for speed helping in battles
	{
		println("[PROBES] Increasing probe trust");
		increaseProbeTrust();
	}

	if (btnIncreaseMaxTrust.disabled == false)
	{
		increaseMaxTrust();
	}

	runModeling(); // should be at the end once we untangle stuff

	if (synchButtonDiv.style.display !== "none" && btnSynchSwarmElement.disabled == false && yomi > 5000) 
	{
		println("[DRONE] Swarm is out of sync, fixing");
		synchSwarm(); 
	}

	// Look through the list of high priority projects; if any are here and the conditions are right, mark them HP
	var highPriorityActiveProject = false;
	for (let proj of stage3HighPriorityList)
	{
		if (proj.projRequirementType == "ops")
		{
			if (operations >= proj.projRequirement)
			{
				println(proj);
				println("Looking at " + proj.prodID);
				
				// Find the actual project object and update it
				var prj = window[proj.projID];
				prj.priority = 1;

				console.log("Priority: " + prj.priority);

				if (prj.element === null || prj.flag == 1)
					continue;
				else
				{
					//println("HIGH PRIORITY PROJECT " + proj.projID);
					highPriorityActiveProject = true;
				}
			}
		}
	}

	// Now actually let's buy stuff
	//for (let projectBuy of stage3ProjectBuyList)
	for (let projectBuy of activeProjects)
	{
		//println("[INVESTOR] projectBuy: " +  prj.title);
		// if we're not in the list of pre-approved projects, let's skip
		if (stage3ProjectBuyList.indexOf(projectBuy.id.replace("Button","")) == -1)
			continue;  

		// If we have a high priority project, we need to check to see if this is one of them. If not we might as well skip it. 
		if (highPriorityActiveProject == true)
		{
			if ( projectBuy.priority != 1)
			{
				println("[PROBES] projectBuy " +  projectBuy.title + " is not a priority project, skipping" + " / " + projectBuy.id);
				continue;
			}
		}

		// If this element is in our End List
		// FIXME: this section has to fire first, otherwise if it's processed below it won't trigger the end-game bits
		if (stage3ProjectBuyList.indexOf(projectBuy.id) !== -1)
		{
			// .. and we can afford it, let's clear this stage and move on. 
			if ( projectBuy.cost() )
			{
				// FIXME
				return;			
			}
		}

		if ( projectBuy.cost() )
		{
			println("[PROBES] projectBuy - buying " +  projectBuy.title + " / " + projectBuy.id)
			projectBuy.effect();
			break; // FIXME: multiple of these running in a row and the cost() fails to restrict it from buying. Probably another function call to recalculate missing.
		}
		else
		{
			println("[PROBES] projectBuy - can't afford " +  projectBuy.title + " / " + projectBuy.id)
		}		
	}


	/*
	// Sort the active projects to put priority ones first in the list (and hope that changing the order doesn't blow anything up)
	activeProjects.sort(function(a, b) {
		return b.priority - a.priority;
	});*/

	// first loop through projects and see if there is a high priority one that requires us to suspend buying low pri ones
	var highPriorityActiveProject = false;

	for (let projectBuy of stage3ProjectBuyList)
	{
		if (projectBuy.priority == 1)
		{
			highPriorityActiveProject = true;
		}
	}

	// Now actually let's buy stuff
	for (let projectBuy of stage3ProjectBuyList)
	{
		// If we have a high priority project, we need to check to see if this is one of them. If not we might as well skip it. 
		if (highPriorityActiveProject == true)
		{
			if (projectBuy.priority != 1)
			{
				println("[PROBES] projectBuy " + projectBuy.title + " is not a priority project, skipping");
				continue;
			}
		}

		if (projectBuy.cost())
		{
			println("[PROBES] projectBuy - buying" + projectBuy.title)
			projectBuy.effect();
		}
		else
		{
			println("[PROBES] projectBuy - can't afford " + projectBuy.title)
		}
	}

	// probeUsedTrust - amount of trust used
	// probeTrust - amount of trust available

	var targetSpeed = 0;
	var targetNav = 0;
	var targetRep = Math.floor(probeTrust * 0.6666);
	var targetHaz = Math.ceil(probeTrust * 0.3333);
	var targetFac = 1;
	var targetHarv = 0;
	var targetWire = 0;
	var targetCombat = 0;

	probeMode = "init";

	// everything is terrible
	if (probeCount <= 50000)
	{
		var probeMode = "sub-50k-panic-mode";
		if (checkProbeModeChange(probeMode) == false)
			return;
		println("[PROBES] Less than 50k probes! Panic mode");

		resetAllProbes();
		let ratioTotal = 20;
		targetSpeed = 0;
		targetNav = 0;
		targetRep = Math.floor(11  * (probeTrust / ratioTotal));
		targetHaz = Math.floor(9 * (probeTrust / ratioTotal));
		targetFac = 0;
		targetWire = 0;
		targetHarv = 0;
		targetCombat = 0;

		setProbeValue('Speed', targetSpeed);
		setProbeValue('Nav', targetNav);
		setProbeValue('Rep', targetRep);
		setProbeValue('Haz', targetHaz);
		setProbeValue('Fac', targetFac);
		setProbeValue('Harv', targetHarv);
		setProbeValue('Wire', targetWire);
		setProbeValue('Combat', targetCombat);		

		assignSpareTrust();
		return;
	}
	else if (probeCount <= 1000000)
	{
		var probeMode = "50k-1m-slow-growth";
		if (checkProbeModeChange(probeMode) == false)
			return;
		println("[PROBES] 50k-1m probes! Slow growth mode");

		resetAllProbes();
		let ratioTotal = 20;
		targetSpeed = Math.floor(1  * (probeTrust / ratioTotal));
		targetNav = Math.floor(1  * (probeTrust / ratioTotal));
		targetRep = Math.floor(8  * (probeTrust / ratioTotal));
		targetHaz = Math.floor(7 * (probeTrust / ratioTotal));
		targetFac = Math.floor(1  * (probeTrust / ratioTotal));
		targetWire = Math.floor(1  * (probeTrust / ratioTotal));
		targetHarv = Math.floor(1  * (probeTrust / ratioTotal));
		targetCombat = 0;

		setProbeValue('Speed', targetSpeed);
		setProbeValue('Nav', targetNav);
		setProbeValue('Rep', targetRep);
		setProbeValue('Haz', targetHaz);
		setProbeValue('Fac', targetFac);
		setProbeValue('Harv', targetHarv);
		setProbeValue('Wire', targetWire);
		setProbeValue('Combat', targetCombat);		

		assignSpareTrust();
		return;
	}	
	else if (probeCount <= 20000000)
	{
		var probeMode = "1m-20m-steady-farming-growth";
		if (checkProbeModeChange(probeMode) == false)
			return;
		println("[PROBES] 1m-20m probes! Steady farming & growth");

		resetAllProbes();
		let ratioTotal = 20;
		targetSpeed = Math.floor(1  * (probeTrust / ratioTotal));
		targetNav = Math.floor(1  * (probeTrust / ratioTotal));
		targetRep = Math.floor(8  * (probeTrust / ratioTotal));
		targetHaz = Math.floor(7 * (probeTrust / ratioTotal));
		targetFac = Math.floor(1  * (probeTrust / ratioTotal));
		targetWire = Math.floor(1  * (probeTrust / ratioTotal));
		targetHarv = Math.floor(1  * (probeTrust / ratioTotal));
		targetCombat = 0;

		setProbeValue('Speed', targetSpeed);
		setProbeValue('Nav', targetNav);
		setProbeValue('Rep', targetRep);
		setProbeValue('Haz', targetHaz);
		setProbeValue('Fac', targetFac);
		setProbeValue('Harv', targetHarv);
		setProbeValue('Wire', targetWire);
		setProbeValue('Combat', targetCombat);	

		assignSpareTrust();
		return;
	}
	else if (probeCount <= 80000000)
	{
		if (drifterCount < probeCount / 2)
		{
			var probeMode = "20m-80m-boost-farming-combat";
			if (checkProbeModeChange(probeMode) == false)
				return;
			println("[PROBES] 20m-80m probes! Boost farming + COMBAT");

			resetAllProbes();
			let ratioTotal = 25;
			targetSpeed = Math.floor(2 * (probeTrust / ratioTotal));
			targetNav = Math.floor(1 * (probeTrust / ratioTotal));
			targetRep = Math.floor(10  * (probeTrust / ratioTotal));
			targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
			targetFac = 0;
			targetCombat = 3;
	
			if (wireDroneLevel > harvesterLevel)
			{
				targetHarv = Math.ceil(1 * (probeTrust / ratioTotal));
				targetWire = 0;
			}
			else
			{
				targetHarv = 0;
				targetWire = Math.ceil(1 * (probeTrust / ratioTotal));
			}

			setProbeValue('Speed', targetSpeed);
			setProbeValue('Nav', targetNav);
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
			setProbeValue('Fac', targetFac);
			setProbeValue('Harv', targetHarv);
			setProbeValue('Wire', targetWire);
			setProbeValue('Combat', targetCombat);			
		}	
		else if (drifterCount > probeCount*10) // wayyyyy too many drifters
		{
			var probeMode = "20m-80m-outnumbered-growth";
			if (checkProbeModeChange(probeMode) == false)
				return;

			resetAllProbes();
			println("[PROBES] 20m-80m probes! OUTNUMBERED growth");

			targetSpeed = Math.floor(1 * (probeTrust / 21));
			targetNav = Math.floor(1 * (probeTrust / 21));
			targetRep = Math.floor(10  * (probeTrust / 21));
			targetHaz = Math.floor(8 * (probeTrust / 21));
			targetFac = 0;
			targetCombat = 0;
	
			if (wireDroneLevel > harvesterLevel)
			{
				targetHarv = Math.ceil(1 * (probeTrust / 21));
				targetWire = 0;
			}
			else
			{
				targetHarv = 0;
				targetWire = Math.ceil(1 * (probeTrust / 21));
			}

			setProbeValue('Speed', targetSpeed);
			setProbeValue('Nav', targetNav);
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
			setProbeValue('Fac', targetFac);
			setProbeValue('Harv', targetHarv);
			setProbeValue('Wire', targetWire);
			setProbeValue('Combat', targetCombat);
		}		
		else
		{
			var probeMode = "20m-80m-boost-farming";
			if (checkProbeModeChange(probeMode) == false)
				return;
			resetAllProbes();
			println("[PROBES] 20m-80m probes! Boost farming");
			targetRep = Math.floor(probeTrust * 0.5)-3;
			targetHaz = targetRep-1;
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
			setProbeValue('Combat', 0);
			setProbeValue('Fac', 1);
			setProbeValue('Harv', 1);
			setProbeValue('Wire', 1);
			setProbeValue('Speed', 2);
			setProbeValue('Nav', 2);
		}
		assignSpareTrust();
		return;
		/* // Saving the day formula
		Trust: 30 / 30 (30 Max), Speed: 5, Exploration: 2, Self-Replication: 8, Hazard Remediation: 7
		Factory Production: 1, Harvester Drone Production: 1, Wire Drone Production: 1, Combat: 5 
		*/
	}
	else if (probeCount <= 100000000)
	{
		if (drifterCount > probeCount*10)
		{
			var probeMode = "80m-100m-go-big-fighting";
			if (checkProbeModeChange(probeMode) == false)
				return;

			println("[PROBES] 80m-100m probes but too many drifters - big combat roll!");
			let ratioTotal = 34;
			targetSpeed = Math.floor(6 * (probeTrust / ratioTotal));
			targetNav = Math.floor(1 * (probeTrust / ratioTotal));
			targetRep = Math.floor(10  * (probeTrust / ratioTotal));
			targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
			targetFac = 0;
			targetCombat = Math.floor(8 * (probeTrust / ratioTotal));
	
			if (wireDroneLevel > harvesterLevel)
			{
				targetHarv = Math.ceil(1 * (probeTrust / ratioTotal));
				targetWire = 0;
			}
			else
			{
				targetHarv = 0;
				targetWire = Math.ceil(1 * (probeTrust / ratioTotal));
			}

			setProbeValue('Speed', targetSpeed);
			setProbeValue('Nav', targetNav);
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
			setProbeValue('Fac', targetFac);
			setProbeValue('Harv', targetHarv);
			setProbeValue('Wire', targetWire);
			setProbeValue('Combat', targetCombat);
		}
		else
		{
			var probeMode = "80m-100m-try-fighting";
			if (checkProbeModeChange(probeMode) == false)
				return;

			resetAllProbes();
			
			println("[PROBES] 80m-100m probes - let's try fighting");
			setProbeValue('Combat', 3);
			setProbeValue('Fac', 0);
			setProbeValue('Harv', 1);
			setProbeValue('Wire', 1);
			setProbeValue('Speed', 3);
			setProbeValue('Nav', 2);

			targetRep = Math.ceil((probeTrust - 10) / 2);
			targetHaz = targetRep - 1;
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
		}
		assignSpareTrust();

		return;			

	}
	else if (drifterCount < probeCount && probeCount < 1000000000000000)
	{
		var probeMode = "100m-stable-combat";
		if (checkProbeModeChange(probeMode) == false)
			return;

		resetAllProbes();
		let ratioTotal = 34;

		// 1:2 Speed/Nav seems best ratio for fastest exploration
		targetSpeed = Math.floor(4 * (probeTrust / ratioTotal));
		targetNav = Math.floor(6 * (probeTrust / ratioTotal));
		targetRep = Math.floor(10  * (probeTrust / ratioTotal));
		targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
		targetFac = Math.floor(1 * (probeTrust / ratioTotal));

		if (wire == 0 || harvesterLevel > 2*wireDroneLevel)
		{
			targetWire = Math.ceil(1 * (probeTrust / ratioTotal));
			targetHarv = Math.ceil(1 * (probeTrust / ratioTotal));
		}
		else
		{
			targetWire = 0;
			targetHarv = Math.ceil(2 * (probeTrust / ratioTotal));
		}

		targetCombat = Math.floor(3 * (probeTrust / ratioTotal));

		setProbeValue('Speed', targetSpeed);
		setProbeValue('Nav', targetNav);
		setProbeValue('Rep', targetRep);
		setProbeValue('Haz', targetHaz);
		setProbeValue('Fac', targetFac);
		setProbeValue('Harv', targetHarv);
		setProbeValue('Wire', targetWire);
		setProbeValue('Combat', targetCombat);

		assignSpareTrust();
		return;		
	}
	else if (drifterCount < probeCount && probeCount >= 1000000000000000) // 1 quadrillion. FIXME maybe can do this earlier?
	{
		var probeMode = "1q-stable-explore-combat";
		if (checkProbeModeChange(probeMode) == false)
			return;

		resetAllProbes();
			// 1:2 Speed/Nav seems best ratio for fastest exploration
		if (acquiredMatter > 0) // if we have a buildup of matter
		{
			println("MATTER MODE!!!");
			let ratioTotal = 34;
			targetSpeed = Math.floor(4 * (probeTrust / ratioTotal));
			targetNav = Math.floor(6 * (probeTrust / ratioTotal));
			targetRep = Math.floor(10  * (probeTrust / ratioTotal));
			targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
			targetFac = 1;
			targetWire = 1;
			targetHarv = 1;
			targetCombat = Math.floor(3 * (probeTrust / ratioTotal));
	
			setProbeValue('Speed', targetSpeed);
			setProbeValue('Nav', targetNav);
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
			setProbeValue('Fac', targetFac);
			setProbeValue('Harv', targetHarv);
			setProbeValue('Wire', targetWire);
			setProbeValue('Combat', targetCombat);
		}
		else
		{
			println("Acquired Matter is: " + acquiredMatter);
			let ratioTotal = 31;
			targetSpeed = Math.floor(4 * (probeTrust / ratioTotal));
			targetNav = Math.floor(6 * (probeTrust / ratioTotal));
			targetRep = Math.floor(10  * (probeTrust / ratioTotal));
			targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
			targetFac = 0;
			targetWire = 0;
			targetHarv = 0;
			targetCombat = Math.floor(3 * (probeTrust / ratioTotal));
	
			setProbeValue('Speed', targetSpeed);
			setProbeValue('Nav', targetNav);
			setProbeValue('Rep', targetRep);
			setProbeValue('Haz', targetHaz);
			setProbeValue('Fac', targetFac);
			setProbeValue('Harv', targetHarv);
			setProbeValue('Wire', targetWire);
			setProbeValue('Combat', targetCombat);
	
		}

		assignSpareTrust();
		return;		
	}
	else if (totalMatter - foundMatter == 0)
	{
		var probeMode = "all-explored";
		if (checkProbeModeChange(probeMode) == false)
			return;

		resetAllProbes();
		let ratioTotal = 28;

		targetSpeed = 2;
		targetNav = 0;
		targetRep = Math.floor(10  * (probeTrust / ratioTotal));
		targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
		targetFac = Math.floor(1 * (probeTrust / ratioTotal));
		targetWire = Math.ceil(2 * (probeTrust / ratioTotal));
		targetHarv = Math.ceil(2 * (probeTrust / ratioTotal));
		targetCombat = Math.floor(3 * (probeTrust / ratioTotal));		

		setProbeValue('Speed', targetSpeed);
		setProbeValue('Nav', targetNav);
		setProbeValue('Rep', targetRep);
		setProbeValue('Haz', targetHaz);
		setProbeValue('Fac', targetFac);
		setProbeValue('Harv', targetHarv);
		setProbeValue('Wire', targetWire);
		setProbeValue('Combat', targetCombat);

		assignSpareTrust();
		return;		
	}
	else
	{
		println("========================================================");
		println("[PROBES] NO PROBE RULES TO MATCH THIS SCENARIO???!!!")
		println("========================================================");
	}
	//if (combatButtonDiv.style.display !== "none")
}, 4000);

function resetAllProbes()
{
	println("[RESETPROBES] Resetting probes to zero!");
	setProbeValue('Speed', 0);
	setProbeValue('Nav', 0);
	setProbeValue('Rep', 0);
	setProbeValue('Haz', 0);
	setProbeValue('Fac', 0);
	setProbeValue('Harv', 0);
	setProbeValue('Wire', 0);
	setProbeValue('Combat', 0);
	buttonUpdate();
}



var tmpRotateIndex = 0;
function assignSpareTrust()
{
	let spareTrust = probeTrust - getProbeUsedTrust();
		
	println("[SPARETRUST] Spare trust is: " + spareTrust);

	let rotateTrust = [ 'Rep', 'Haz', 'Speed' ];

	if (spareTrust > 0)
	{
		for (i = 0; i < spareTrust; i++)
		{
			let target = window['probe'+rotateTrust[tmpRotateIndex]] + 1;
			println("[SPARETRUST] Spare trust going to: " + rotateTrust[tmpRotateIndex] + " Target: " + target + " Index: " + tmpRotateIndex);
			setProbeValue(rotateTrust[tmpRotateIndex], target);
			tmpRotateIndex = tmpRotateIndex + 1;

			if (tmpRotateIndex % rotateTrust.length == 0)
			{
				//println("Rotating index back to zero: " + tmpRotateIndex + " i: " + i);
				tmpRotateIndex = 0;
			}
			else
			{
				//println("NOT rotating index: " + tmpRotateIndex + " i: " + i + " array length: " + rotateTrust.length);
			}

			if (tmpRotateIndex > 2)
			{
				println("========================================");
				println("FIXME: tmpRotateIndex overflowed: " + tmpRotateIndex + " i: " + i);
			}
		}
		return; 
	}
}

function checkProbeModeChange(probeMode)
{
	println("[PROBES] ============ "+ probeMode + " ============");

	if (lastProbeMode == probeMode)
	{
		println("[PROBES] Still in mode: " + probeMode + ", returning, no need for changes; assigning spare trust");
		lastProbeMode = probeMode;
		if (Math.random() < 0.1) // randomly change the mode to check to see if we need to re-adjust the 
		{
			println("[PROBES] Forcing a mode change to check on stuff");
			return true;
		}
		assignSpareTrust();
		return false; 
	}
	else
	{
		println("[PROBES] New probeMode "+ probeMode);
		lastProbeMode = probeMode;
		return true;
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}



function isSpareTrust()
{
	if (getProbeUsedTrust() < probeTrust)
		return true;
	
	return false;
}

function getProbeUsedTrust()
{
	let tmpProbeUsedTrust = (probeSpeed+probeNav+probeRep+probeHaz+probeFac+probeHarv+probeWire+probeCombat);
	return tmpProbeUsedTrust;
}

function setProbeValue(field, target)
{
	// NOTE: probeUsedTrust is not updated frequently enough to be useful so we'll calculate our own value in each request
	target = Math.floor(target);

	//println("FIELD: " + field + " TARGET: " + target);

	raiseButton = document.getElementById('btnRaiseProbe' + field);
	lowerButton = document.getElementById('btnLowerProbe' + field);

	println("[SETVALUE] Value for " + field + " is currently: " + window['probe' + field] + " (Target: " + target + ")");

	if (window['probe' + field] > target && window['probe' + field] > 0)
	{
		let tmpct = 0; // safety
		while (window['probe' + field] > target && window['probe' + field] > 0)
		{
			tmpct = tmpct + 1;
			if (tmpct > 20)
			{
				println("[SETVALUE] BREAKING, LOWER tmpct limit hit");
				break;
			}				
			//lowerButton.click();
			eval('lowerProbe' + field)();// FIXME ewwwww
		}
	}
	else if (window['probe' + field] < target)
	{
		let tmpct = 0; // safety
		//println("0: Value for " + field + " is currently: " + window['probe' + field] + " (Target: " + target + ") tmpProbeUsedTrust: " + getProbeUsedTrust() + " probeTrust: " + probeTrust);
		//while (window['probe' + field] <= getProbeUsedTrust() && window['probe' + field] < target && getProbeUsedTrust() < probeTrust)
		//while (window['probe' + field] < target && getProbeUsedTrust() < probeTrust)
		//if (window['probe' + field] < getProbeUsedTrust() && window['probe' + field] < target && getProbeUsedTrust() < probeTrust)

		var initialDelta = target - window['probe' + field];
		//println("initial delta: " + initialDelta);

		if (initialDelta > (probeTrust - getProbeUsedTrust()) )
		{
			initialDelta = probeTrust - getProbeUsedTrust();
			//println("Initial delta was greater than free trust, overriding to " + initialDelta);
		}

		for (let i = initialDelta; i > 0; i--)
		{
			//println(i + " 1: Value for " + field + " is currently: " + window['probe' + field] + " (Target: " + target + ") tmpProbeUsedTrust: " + getProbeUsedTrust() + " probeTrust: " + probeTrust + " InitialDelta: " + initialDelta);

			if (probeTrust - getProbeUsedTrust() > 0)
			{
				//println("Raising Probe for " + field);
				eval('raiseProbe' + field)();// FIXME ewwwww
			}
		}	
	}
	buttonUpdate(); // WOOHOOO, the secret sauce!!! this recalculates probeUsedTrust which is critical so the raiseProbeX functions know if they can fire
}

if (project46.flag == 0 && project35.flag == 0)
{
	println("============== FIRST STAGE CONFIG SET ==============");
	cfg_disableClicker = false;
	cfg_disableInvestor = false;
	cfg_disablePricer = false;
	cfg_disableImproveInvestments = false;
	cfg_disableModeling = false;
	cfg_disableDroneManager = true;
	cfg_disableProbeLauncher = true;
	cfg_disableProbesManager = true;

	initGraphs(1).then(result => loadStage1Graphs());
}
else if (project35.flag == 1 && project46.flag !== 1)
{
	println("============== SECOND STAGE CONFIG SET ==============");
	cfg_disableClicker = true;
	cfg_disableInvestor = true;
	cfg_disablePricer = true;
	cfg_disableImproveInvestments = false;
	cfg_disableModeling = false;
	cfg_disableDroneManager = false;
	cfg_disableProbeLauncher = true;
	cfg_disableProbesManager = true;	
	clearStage1Graphs();

	initGraphs(2).then(result => stage2Graphs()).then(resolve=>loadStage2Graphs());

}
else if (project46.flag == 1)
{
	println("============== THIRD STAGE CONFIG SET ==============");
	cfg_disableClicker = true;
	cfg_disableInvestor = true;
	cfg_disablePricer = true;
	cfg_disableImproveInvestments = false;
	cfg_disableModeling = false;
	cfg_disableDroneManager = true;
	cfg_disableProbeLauncher = false;
	cfg_disableProbesManager = false;	
	clearStage2Graphs();

	initGraphs(3).then(result => stage3Graphs()).then(resolve=>loadStage3Graphs());

}
else
{
	println("============== ERROR NO CONFIG SET ==============");
}
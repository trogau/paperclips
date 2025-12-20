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
	if (cfg_disablePricer === true)
		return;
	
	// this shit just makes a mess
	/*
	if (unsoldClips < clipRate * 3) //  buffer of unsold clips?
	{
		raisePrice(); raisePrice(); raisePrice();

		if (Math.random() > 0.7)
			println("[PRICER] Buffering clips: raising price to " + margin);
		return;
	}

	if (unsoldClips > clipRate*40)
	{
		lowerPrice(); lowerPrice(); lowerPrice(); lowerPrice(); lowerPrice(); 
		lowerPrice(); lowerPrice(); lowerPrice(); lowerPrice(); lowerPrice(); 

		if (Math.random() > 0.7)
			println("[PRICER] De-buffering clips: lowering price to " + margin);
	}

	if (avgSales < clipRate)
	{
		if (margin > 0.01)
		{
			if (Math.random() > 0.7)
				println("[PRICER] Lowering price to " + margin);
			lowerPrice();
		}
	}
	else
	{
		if (Math.random() > 0.7)
			println("[PRICER] Raising price to " + margin);
		raisePrice();
	}
	*/

	if (unsoldClips == 0)
	{
		println("No rise");
		return;
	}

	if (clipRate == 0)
	{
		lowerPrice();
		return;
	}

	if ( unsoldClips  < (clipRate * 10) )
	{
		println("[PRICER] price raise: "  + (unsoldClips) + " vs " + clipRate*10);
		raisePrice();
	}
	else
	{
		if (avgSales > clipRate)
		{
			println("[PRICER] avg sales > cliprate");
			return;
		}
		else
		{
			println("[PRICER] price lower: "  + (unsoldClips) + " vs " + clipRate*10);
			lowerPrice();
		}
	}

	return;

}, 1000);

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
				println("[STAGE1 PROJ] Looking at " + proj.prodID);
				
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
		// If this element is in our End List
		// FIXME: this section has to fire first, otherwise if it's processed below it won't trigger the end-game bits
		if (stage1ProjectEndList.indexOf(projectBuy.id) !== -1)
		{
			// .. and we can afford it, let's clear this stage and move on. 
			if ( projectBuy.cost() )
			{
				projectBuy.effect();
				cfg_disableDroneManager = false; // enable the drone manager
				clearInterval(investor); // disable the investor interval
				clearInterval(clicker);
				clearInterval(pricer);
				clearStage1Graphs();

				initGraphs(2).then(result => stage2Graphs()).then(resolve=>loadStage2Graphs());
				return;			
			}
		}

		//println("[INVESTOR] projectBuy: " +  prj.title);
		// if we're not in the list of pre-approved projects, let's skip
		if (stage1ProjectBuyList.indexOf(projectBuy.id.replace("Button","")) == -1)
		{
			continue;  
		}

		// If we have a high priority project, we need to check to see if this is one of them. If not we might as well skip it. 
		if (highPriorityActiveProject == true)
		{
			if ( projectBuy.priority != 1)
			{
				println("[INVESTOR] projectBuy " +  projectBuy.title + " is not a priority project, skipping" + " / " + projectBuy.id);
				continue;
			}
		}

		println("Checking " + projectBuy.id);



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
}, 10);

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
			println("[DRONE] Slider at " + slider.value);
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
		// If this element is in our End List
		// FIXME: this section has to fire first, otherwise if it's processed below it won't trigger the end-game bits
		if (stage2ProjectEndList.indexOf(projectBuy.id) !== -1)
		{
			// .. and we can afford it, let's clear this stage and move on. 
			if ( projectBuy.cost() )
			{
				projectBuy.effect();
				cfg_disableDroneManager = true;
				cfg_disableProbeLauncher = false;
				cfg_disableProbesManager = false;
				clearInterval(droneManager);
				clearStage2Graphs();

				initGraphs(3).then(result => stage3Graphs()).then(resolve=>loadStage3Graphs());
				return;			
			}
		}

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

		if (typeof projectBuy.id !== 'undefined') // FIXME: sometimes we end up with no projects here & the cost() call below fails
		{
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
		else if (wire > Math.pow(2, 32))
		{
			println("TOO MUCH WIRE: " + acquiredMatter);
			let ratioTotal = 31;
			targetSpeed = Math.floor(4 * (probeTrust / ratioTotal));
			targetNav = Math.floor(5 * (probeTrust / ratioTotal));
			targetRep = Math.floor(10  * (probeTrust / ratioTotal));
			targetHaz = Math.floor(8 * (probeTrust / ratioTotal));
			targetFac = 1;
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

	//println("[SETVALUE] Value for " + field + " is currently: " + window['probe' + field] + " (Target: " + target + ")");

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

	//initGraphs(3).then(result => stage3Graphs()).then(resolve=>loadStage3Graphs());
	initGraphs(3).then(resolve=>loadStage3Graphs());

}
else
{
	println("============== ERROR NO CONFIG SET ==============");
}


/**
 * GRAPHING STUFF
 */

//https://jsfiddle.net/0h1z72s0/
//http://jsfiddle.net/api/post/jquery/1.4/

/** INIT */
var graphLibLoaded = false;
function initGraphs(stage)
{
  console.log("== INIT GRAPHS STAGE: " + stage);
  if (graphLibLoaded == true)
  {
    console.log("== GRAPHLIB ALREADY LOADED - RETURNING IMMEDIATELY");
    return new Promise(function(resolve,reject) { resolve(true); });
  }

  return new Promise(function(resolve,reject)
  {
    if (graphLibLoaded == true)
      resolve(true);
    var j = document.createElement('script'); 
    j.src = "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.js"; 
    document.getElementsByTagName('head')[0].appendChild(j);
    
    j.onload = function() {
      graphLibLoaded = true;
      console.log("LOADED graphs");
      if (stage === 1)
        stage1Graphs();
      else if (stage == 2)
        stage2Graphs();
      else if (stage == 3)
        stage3Graphs();

      var fileref = document.createElement("link");
      fileref.rel = "stylesheet";
      fileref.type = "text/css";
      fileref.href = "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css";
      document.getElementsByTagName("head")[0].appendChild(fileref);

      graphLibLoaded = true;
      resolve(true);
    }

    j.onerror = function() {
      console.log("ERROR occurred loading graph scripts");
      reject(false);
    }
  });
}

function fixGraphBackground() 
{
	var x = document.getElementsByTagName("canvas");
	var i;
	for (i = 0; i < x.length; i++) 
	{
		x[i].style.background = "0,0,0";
	}
}
/** END INIT */

/**
 * Create a draggable graph container component
 * @param {string} id - The ID for the graph div
 * @param {string} borderColor - The border color
 * @param {number} initialRight - Initial position from right edge
 * @param {number} initialTop - Initial position from top edge
 * @param {number} width - Width in pixels (default 500)
 * @param {number} height - Height in pixels (default 400)
 * @returns {HTMLElement} - The created draggable graph container
 */
function createDraggableGraph(id, borderColor, initialRight, initialTop, width, height) {
  width = width || 500;
  height = height || 400;
  
  // Create outer wrapper for positioning
  var wrapper = document.createElement('div');
  wrapper.style.cssText = 'position: absolute; right: ' + initialRight + 'px; top: ' + initialTop + 'px; ' +
                          'z-index: 100;';
  
  // Create drag handle (title bar) with minimize button
  var dragHandle = document.createElement('div');
  dragHandle.style.cssText = 'width: ' + width + 'px; height: 20px; ' +
                             'background: ' + borderColor + '; ' +
                             'cursor: move; ' +
                             'user-select: none; ' +
                             'opacity: 0.3; ' +
                             'border: solid 1px ' + borderColor + '; ' +
                             'display: flex; justify-content: space-between; align-items: center; ' +
                             'padding: 0 5px; box-sizing: border-box;';
  
  // Create title label for the graph
  var titleLabel = document.createElement('span');
  titleLabel.style.cssText = 'color: #ffffff; font-size: 11px; font-weight: normal; ' +
                             'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
  titleLabel.textContent = ''; // Populated from dygraph options when setDygraphInstance is called
  
  // Create minimize toggle button
  var minimizeButton = document.createElement('span');
  minimizeButton.textContent = '▼';
  minimizeButton.style.cssText = 'cursor: pointer; font-size: 12px; color: #ffffff; ' +
                                 'transition: transform 0.3s; padding: 0 5px; flex-shrink: 0;';
  minimizeButton.title = 'Minimize/Expand';
  
  dragHandle.appendChild(titleLabel);
  dragHandle.appendChild(minimizeButton);
  
  // Create the actual graph container
  var container = document.createElement('div');
  container.id = id;
  container.style.cssText = 'width: ' + width + 'px; height: ' + height + 'px; ' +
                            'border: solid 2px ' + borderColor + '; ' +
                            'border-top: none;';
  
  // Create resize handle
  var resizeHandle = document.createElement('div');
  resizeHandle.style.cssText = 'position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; ' +
                               'cursor: nwse-resize; background: ' + borderColor + '; ' +
                               'opacity: 0.5; z-index: 10;';
  
  // Assemble the structure
  wrapper.appendChild(dragHandle);
  wrapper.appendChild(container);
  wrapper.appendChild(resizeHandle);
  
  // State management
  var draggingState = {
    isDragging: false,
    offsetX: 0,
    offsetY: 0
  };
  
  var resizingState = {
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startRight: 0
  };
  
  var isMinimized = false;
  var savedHeight = height;
  var dygraphInstance = null;
  
  // Store reference to dygraph instance when it's created
  wrapper.setDygraphInstance = function(instance) {
    dygraphInstance = instance;
    // Extract and set the title from dygraph options
    if (instance && instance.getOption) {
      var title = instance.getOption('title');
      if (title) {
        titleLabel.textContent = title;
      }
    }
  };
  
  // Minimize/Expand functionality
  minimizeButton.addEventListener('click', function(e) {
    e.stopPropagation();
    isMinimized = !isMinimized;
    
    if (isMinimized) {
      savedHeight = container.offsetHeight;
      container.style.display = 'none';
      resizeHandle.style.display = 'none';
      minimizeButton.style.transform = 'rotate(-90deg)';
      minimizeButton.textContent = '▶';
    } else {
      container.style.display = 'block';
      resizeHandle.style.display = 'block';
      minimizeButton.style.transform = 'rotate(0deg)';
      minimizeButton.textContent = '▼';
      
      // Trigger resize on dygraph if instance exists
      if (dygraphInstance && typeof dygraphInstance.resize === 'function') {
        setTimeout(function() {
          dygraphInstance.resize();
        }, 50);
      }
    }
  });
  
  // Dragging functionality
  var onMouseMove = function(e) {
    if (draggingState.isDragging) {
      var newX = e.clientX - draggingState.offsetX;
      var newY = e.clientY - draggingState.offsetY;
      
      // Keep within viewport bounds
      newX = Math.max(0, Math.min(newX, window.innerWidth - wrapper.offsetWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - wrapper.offsetHeight));
      
      // Convert to right positioning for consistency with original
      var newRight = window.innerWidth - newX - wrapper.offsetWidth;
      wrapper.style.right = newRight + 'px';
      wrapper.style.top = newY + 'px';
      wrapper.style.left = 'auto';
    }
  };
  
  var onMouseUp = function() {
    if (draggingState.isDragging) {
      draggingState.isDragging = false;
      wrapper.style.zIndex = 100; // Reset z-index
      dragHandle.style.opacity = '0.3'; // Reset handle opacity
      // Remove global event listeners to prevent memory leaks
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  };
  
  // Only attach drag handlers to the drag handle, not the minimize button
  dragHandle.addEventListener('mousedown', function(e) {
    // Don't start dragging if clicking on minimize button
    if (e.target === minimizeButton) {
      return;
    }
    
    draggingState.isDragging = true;
    var rect = wrapper.getBoundingClientRect();
    draggingState.offsetX = e.clientX - rect.left;
    draggingState.offsetY = e.clientY - rect.top;
    wrapper.style.zIndex = 1000; // Bring to front when dragging
    dragHandle.style.opacity = '0.7'; // Make handle more visible when dragging
    e.preventDefault();
    
    // Add global event listeners only when dragging starts
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  
  // Resizing functionality
  let resizeTimeout = null;
  const RESIZE_DEBOUNCE_MS = 16; // ~1 animation frame for smooth updates
  const RESIZE_FINAL_DELAY_MS = 50; // Allow DOM to settle before final resize
  
  var onResizeMove = function(e) {
    if (resizingState.isResizing) {
      var deltaX = e.clientX - resizingState.startX;
      var deltaY = e.clientY - resizingState.startY;
      
      var newWidth = Math.max(200, resizingState.startWidth + deltaX);
      var newHeight = Math.max(150, resizingState.startHeight + deltaY);
      
      // Calculate actual delta from constrained width (in case we hit minimum)
      var actualDeltaX = newWidth - resizingState.startWidth;
      
      // Update container and dragHandle dimensions
      container.style.width = newWidth + 'px';
      container.style.height = newHeight + 'px';
      dragHandle.style.width = newWidth + 'px';
      
      // Adjust wrapper's right position to keep left edge fixed
      // When width increases, decrease right value by the same amount
      var newRight = resizingState.startRight - actualDeltaX;
      wrapper.style.right = newRight + 'px';
      
      // Debounce the resize calls during dragging to improve performance
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(function() {
        // Update dygraph if instance exists
        if (dygraphInstance && typeof dygraphInstance.resize === 'function') {
          dygraphInstance.resize();
        }
      }, RESIZE_DEBOUNCE_MS);
    }
  };
  
  var onResizeUp = function() {
    if (resizingState.isResizing) {
      resizingState.isResizing = false;
      resizeHandle.style.opacity = '0.5';
      document.removeEventListener('mousemove', onResizeMove);
      document.removeEventListener('mouseup', onResizeUp);
      
      // Clear any pending resize timeout
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
        resizeTimeout = null;
      }
      
      // Final resize call to ensure graph is properly sized
      // Delay allows DOM to settle and ensures accurate dimension detection
      if (dygraphInstance && typeof dygraphInstance.resize === 'function') {
        setTimeout(function() {
          dygraphInstance.resize();
        }, RESIZE_FINAL_DELAY_MS);
      }
    }
  };
  
  resizeHandle.addEventListener('mousedown', function(e) {
    resizingState.isResizing = true;
    resizingState.startX = e.clientX;
    resizingState.startY = e.clientY;
    resizingState.startWidth = container.offsetWidth;
    resizingState.startHeight = container.offsetHeight;
    
    // Store initial right position to adjust during resize
    // This keeps the left edge fixed while resizing from bottom-right
    var computedStyle = window.getComputedStyle(wrapper);
    resizingState.startRight = parseInt(computedStyle.right) || 0;
    
    resizeHandle.style.opacity = '0.8';
    e.preventDefault();
    e.stopPropagation();
    
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeUp);
  });
  
  return wrapper;
}

function stage1Graphs()
{
  console.log("================ DIVS FOR STAGE 1 GRAPHS ================");
  if (document.getElementById('graphClipsRateDiv') !== null)
    return;

  return new Promise(function(resolve,reject)
  {
    // Create draggable graph containers with original right-anchored positions
    var graphClipsRate = createDraggableGraph('graphClipsRateDiv', 'green', 10, 110, 500, 400);
    document.body.appendChild(graphClipsRate); 

    // INVESTMENT PORTFOLIO
    var graphInvestments = createDraggableGraph('graphInvestmentsDiv', 'yellow', 510, 110, 500, 400);
    document.body.appendChild(graphInvestments); 

    var graphYomi = createDraggableGraph('graphYomiDiv', 'red', 10, 510, 500, 400);
    document.body.appendChild(graphYomi); 

    var graphRevenue = createDraggableGraph('graphRevenueDiv', 'blue', 510, 510, 500, 400);
    document.body.appendChild(graphRevenue); 

    resolve(true);
  });
}


function stage2Graphs()
{
	console.log("================ DIVS FOR STAGE 2 GRAPHS ================");
	if (document.getElementById('graphDronesDiv') !== null)
	{
		println("== Divs for Stage 2 already loaded, skipping");
		return;
	}
    
    return new Promise(function(resolve,reject)
    {
      // Create draggable graph containers with original right-anchored positions
      var graphDrones = createDraggableGraph('graphDronesDiv', 'green', 10, 110, 500, 400);
	  document.body.appendChild(graphDrones); 

	  var graphMatterRate = createDraggableGraph('graphMatterRateDiv', 'yellow', 510, 110, 500, 400);
      document.body.appendChild(graphMatterRate); 

	  var graphWireRate = createDraggableGraph('graphWireRateDiv', 'red', 10, 510, 500, 400);
      document.body.appendChild(graphWireRate); 

      resolve(true);
    });
}

function stage3Graphs()
{
	console.log("================ DIVS FOR STAGE 3 GRAPHS ================");
	if (document.getElementById('graphProbesDiv') !== null)
		return;

    return new Promise(function(resolve,reject)
    {
      // Create draggable graph containers with original right-anchored positions
      var graphProbes = createDraggableGraph('graphProbesDiv', 'green', 10, 110, 500, 400);
      document.body.appendChild(graphProbes); 

      var graphExploration = createDraggableGraph('graphExplorationDiv', 'yellow', 510, 110, 500, 400);
      document.body.appendChild(graphExploration); 

      var graphProbeRates = createDraggableGraph('graphProbeRatesDiv', 'blue', 510, 510, 500, 400);
      document.body.appendChild(graphProbeRates); 

      resolve(true);
    });
}


/* CLIPS STAGE 1  */
function graphClipRates()
{
//  var x = await initGraphs();

  if (typeof graphClipsRateInterval !== 'undefined')
      clearInterval(graphClipsRateInterval);
  var data = [];
  var t = new Date();
  data.push([t, 0, 0]);

  var g = new Dygraph(document.getElementById("graphClipsRateDiv"), data,
      {
          title: "Clips and Wire Growth Rate",
          drawPoints: true,
          showRoller: true,
          rollPeriod: 1,
          labels: ['Time', 'ClipRate', 'WireRate'],
          ylabel: 'Clip Rate',
          y2label: 'Wire Rate',
          series: {
              'WireRate': {
                  axis: 'y2'
              }
          }
      });

  // Store dygraph instance in the wrapper for resize functionality
  var wrapper = document.getElementById("graphClipsRateDiv").parentElement;
  if (wrapper && wrapper.setDygraphInstance) {
    wrapper.setDygraphInstance(g);
  }

  var lastClips = clips;
  var lastWire = wire;

  graphClipsRateInterval = setInterval(function () {
      var x = new Date();  // current time
      
      var diff = clips - lastClips;
      lastClips = clips;

      var wireDiff = wire - lastWire;
      lastWire = wire;
      if (wireDiff < 0) // Hack to stop negative values in graph
          wireDiff = 0;

      //console.log("[GRAPH] Rate is " + diff + "  " + clips + " - " + lastClips);

      data.push([x, diff, wireDiff]);
      if (data.length > 100) {
          data.splice(0, 1);
      }
      g.updateOptions({ 'file': data });
  }, 1000);
  fixGraphBackground();
}


/**
 * INVESTMENTS STAGE 1  
 */
function graphInvestments()
{
    if (typeof graphInvestmentsInterval !== 'undefined')
        clearInterval(graphInvestmentsInterval);
    var gidata = [];
    var t = new Date();
    gidata.push([t,0,0,0]);

    var gInvestments = new Dygraph(document.getElementById("graphInvestmentsDiv"), gidata,
        {
            title: "Investments Growth",
            drawPoints: true,
            showRoller: true,
            rollPeriod: 1,
            labels: ['Time', 'Portfolio', 'Securities', 'Bankroll']
        });

    // Store dygraph instance in the wrapper for resize functionality
    var wrapper = document.getElementById("graphInvestmentsDiv").parentElement;
    if (wrapper && wrapper.setDygraphInstance) {
      wrapper.setDygraphInstance(gInvestments);
    }

    var lastPortfolio = portTotal;
    var lastSecurities = secTotal;
    var lastBankroll = bankroll;

    graphInvestmentsInterval = setInterval(function () {
        var x = new Date();  // current time
        
        /*var portDiff = portTotal - lastPortfolio;
        lastPortfolio = portTotal;

        var secDiff = secTotal - lastSecurities;
        lastSecurities = secTotal;

        var bankrollDiff = bankroll - lastBankroll;
        lastBankroll = bankroll;
        */
        gidata.push([x, portTotal, secTotal, bankroll]);
        if (gidata.length > 100) {
            gidata.splice(0, 1);
        }
        gInvestments.updateOptions({ 'file': gidata });
    }, 1000);
    fixGraphBackground();
}


/**
 * YOMI
 */
function graphYomi()
{
    if (typeof graphYomiInterval !== 'undefined')
        clearInterval(graphYomiInterval);
    var data2 = [];
    var t2 = new Date();
    data2.push([t2, 1, 1]);

    var gYomi = new Dygraph(document.getElementById("graphYomiDiv"), data2,
        {
            title: "Yomi",
            drawPoints: true,
            showRoller: true,
            rollPeriod: 1,
            labels: ['Time', 'YomiRate', 'TotalYomi'],
            valueRange: [0.0],
        });

    // Store dygraph instance in the wrapper for resize functionality
    var wrapper = document.getElementById("graphYomiDiv").parentElement;
    if (wrapper && wrapper.setDygraphInstance) {
      wrapper.setDygraphInstance(gYomi);
    }

    var lastYomi = yomi;

    graphYomiInterval = setInterval(function () {
        var x = new Date();  // current time

        var yomiDiff = yomi - lastYomi;
        //console.log("[GRAPH] Rate is " + yomiDiff + "  " + yomi + " - " + lastYomi);
        lastYomi = yomi;

        data2.push([x, yomiDiff, yomi]);
        if (data2.length > 100) {
            data2.splice(0, 1);
        }
        gYomi.updateOptions({ 'file': data2 });
    }, 1000);
    fixGraphBackground();
}


/**
 * REVENUE
 */

function graphRevenue()
{
    if (typeof graphRevenueInterval !== 'undefined')
        clearInterval(graphRevenueInterval);
    var dataRev = [];
    var t2 = new Date();
    dataRev.push([t2, avgRev]);

    var graphRevenue = new Dygraph(document.getElementById("graphRevenueDiv"), dataRev,
        {
            title: "Revenue",
            drawPoints: true,
            showRoller: true,
            rollPeriod: 1,
            labels: ['Time', 'AvgRevenue'],
            valueRange: [0.0],
        });

    // Store dygraph instance in the wrapper for resize functionality
    var wrapper = document.getElementById("graphRevenueDiv").parentElement;
    if (wrapper && wrapper.setDygraphInstance) {
      wrapper.setDygraphInstance(graphRevenue);
    }

    var lastYomi = yomi;

    graphRevenueInterval = setInterval(function () {
        var x = new Date();  // current time

        dataRev.push([x, avgRev]);
        if (dataRev.length > 100) {
            dataRev.splice(0, 1);
        }
        graphRevenue.updateOptions({ 'file': dataRev });
    }, 1000);
    fixGraphBackground();
}

/**
 *  GRAPH DRONES  
 */
function graphDrones()
{
  if (typeof graphDronesRateInterval !== 'undefined')
      clearInterval(graphDronesRateInterval);
  var gdrdata = [];
  var t = new Date();
  gdrdata.push([t, Math.random()]);

  var gDrones = new Dygraph(document.getElementById("graphDronesDiv"), gdrdata,
      {
          title: "Activity",
          drawPoints: true,
          showRoller: true,
          rollPeriod: 1,
          labels: ['Time', 'ClipRate']
      });

  // Store dygraph instance in the wrapper for resize functionality
  var wrapper = document.getElementById("graphDronesDiv").parentElement;
  if (wrapper && wrapper.setDygraphInstance) {
    wrapper.setDygraphInstance(gDrones);
  }

  var lastClips = clips;

  graphDronesRateInterval = setInterval(function () {
      var x = new Date();  // current time
      
      var diff = clips - lastClips;
      lastClips = clips;

      //console.log("[GRAPH] Rate is " + diff + "  " + clips + " - " + lastClips);

      gdrdata.push([x, clipRate]);
      if (gdrdata.length > 100) {
          gdrdata.splice(0, 1);
      }
      gDrones.updateOptions({ 'file': gdrdata });
  }, 1000);
  fixGraphBackground();
}

/**
 *  GRAPH MATTER RATE
 */
function graphMatterRate()
{
	if (typeof graphMatterRateInterval !== 'undefined')
		clearInterval(graphMatterRateInterval);
		
	var gdrdata = [];
	var t = new Date();
	gdrdata.push([t, Math.random()]);

	var gDrones = new Dygraph(document.getElementById("graphMatterRateDiv"), gdrdata,
		{
			title: "Matter Rate",
			drawPoints: true,
			showRoller: true,
			rollPeriod: 1,
			labels: ['Time', 'MatterRate']
		});

	// Store dygraph instance in the wrapper for resize functionality
	// Note: variable name 'gDrones' is misleading but was pre-existing
	var wrapper = document.getElementById("graphMatterRateDiv").parentElement;
	if (wrapper && wrapper.setDygraphInstance) {
		wrapper.setDygraphInstance(gDrones);
	}

	var lastClips = clips;
  
	graphMatterRateInterval = setInterval(function () {
		var x = new Date();  // current time

		var mtr = 0;
		if (availableMatter>0) 
		{
			var dbsth = 1;
			if (droneBoost>1){
				dbsth = droneBoost * Math.floor(harvesterLevel);
			}	
			mtr = powMod*dbsth*Math.floor(harvesterLevel)*harvesterRate;
	
			mtr = mtr * ((200-sliderPos)/100);
	
			if (mtr>availableMatter){
				mtr = availableMatter;
			}
		}
		matterRate = mtr;
	
//		console.log("[GRAPH] Rate is " + matterRate);

		gdrdata.push([x, matterRate]);
		if (gdrdata.length > 100) {
			gdrdata.splice(0, 1);
		}
		gDrones.updateOptions({ 'file': gdrdata });
	}, 1000);
	fixGraphBackground();
}

/**
 *  GRAPH WIRE RATE
 */
function graphWireRate()
{
	if (typeof graphWireRateInterval !== 'undefined')
		clearInterval(graphWireRateInterval);
		
	var gdrdata = [];
	var t = new Date();
	gdrdata.push([t, Math.random()]);

	var gDrones = new Dygraph(document.getElementById("graphWireRateDiv"), gdrdata,
		{
			title: "Wire Rate",
			drawPoints: true,
			showRoller: true,
			rollPeriod: 1,
			labels: ['Time', 'WireRate']
		});

	// Store dygraph instance in the wrapper for resize functionality
	// Note: variable name 'gDrones' is misleading but was pre-existing
	var wrapper = document.getElementById("graphWireRateDiv").parentElement;
	if (wrapper && wrapper.setDygraphInstance) {
		wrapper.setDygraphInstance(gDrones);
	}

	graphWireRateInterval = setInterval(function () {
		var x = new Date();  // current time

		// FIXME: THIS IS NOT ACCURATE
		//if (acquiredMatter>0) 
		{
			var dbstw = 1;
			if (droneBoost>1){
				dbstw = droneBoost * Math.floor(wireDroneLevel);
				}
			
			var a = powMod*dbstw*Math.floor(wireDroneLevel)*wireDroneRate;
			
			a = a * ((200-sliderPos)/100);
			
			/*
			if (a>acquiredMatter){
				a = acquiredMatter;
			}*/
		}
		//else
		//	a = 0;

		wireRate = a;
	
		//console.log("[GRAPH] wireRate is " + wireRate);

		gdrdata.push([x, wireRate]);
		if (gdrdata.length > 100) {
			gdrdata.splice(0, 1);
		}
		gDrones.updateOptions({ 'file': gdrdata });
	}, 1000);
	fixGraphBackground();
}


/* EXPLORATION   */
function graphExploration()
{
  if (typeof graphExplorationInterval !== 'undefined')    
    clearInterval(graphExplorationInterval);
  var gexdata = [];
  var t = new Date();
  for (var i = 10; i >= 0; i--) {
      var x = new Date(t.getTime() - i * 1000);
      gexdata.push([x, Math.random()]);
  }

  var gExplored = new Dygraph(document.getElementById("graphExplorationDiv"), gexdata,
      {
          title: "Exploration Rate",
          drawPoints: true,
          showRoller: true,
          rollPeriod: 1,
          labels: ['Time', 'ExploredRate']
      });

  // Store dygraph instance in the wrapper for resize functionality
  var wrapper = document.getElementById("graphExplorationDiv").parentElement;
  if (wrapper && wrapper.setDygraphInstance) {
    wrapper.setDygraphInstance(gExplored);
  }

  var lastPercentFound = (100/(totalMatter/foundMatter));

  graphExplorationInterval = setInterval(function () {
      var x = new Date();  // current time
      
      var diff = (100/(totalMatter/foundMatter)) - lastPercentFound;
      lastPercentFound = (100/(totalMatter/foundMatter));

      //console.log("[GRAPH] Rate is " + diff + "  " + clips + " - " + lastClips);

      gexdata.push([x, diff]);
      if (gexdata.length > 100) {
          gexdata.splice(0, 1);
      }
      gExplored.updateOptions({ 'file': gexdata });
  }, 1000);
  fixGraphBackground();
}

/**
 *  PROBES  
 */
function graphProbes()
{
    if (typeof graphProbesInt !== 'undefined')
        clearInterval(graphProbesInt);
    var gpdata = [];
    var t = new Date();
    gpdata.push([t, 0,0,0,0]);

    var gProbes = new Dygraph(document.getElementById("graphProbesDiv"), gpdata,
        {
            title: "Total Probe Metrics",
            drawPoints: true,
            showRoller: true,
            rollPeriod: 1,
            labels: ['Time', 'HazardLosses', 'CombatLosses', 'DriftLosses', 'TotalProbes']
        });

    // Store dygraph instance in the wrapper for resize functionality
    var wrapper = document.getElementById("graphProbesDiv").parentElement;
    if (wrapper && wrapper.setDygraphInstance) {
      wrapper.setDygraphInstance(gProbes);
    }

    // It sucks that these things aren't objects, and we need to store state in window.
    graphProbesInt = setInterval(function () {
        var x = new Date();  // current time
        var y = Math.random();
        //gpdata.push([x, probesLostHaz / 1000000000000000, probesLostCombat / 1000000000000000, probesLostDrift / 1000000000000000, probeCount / 1000000000000000]);
        gpdata.push([x, probesLostHaz , probesLostCombat , probesLostDrift , probeCount ]);
        if (gpdata.length > 100) {
            gpdata.splice(0, 1);
        }
        gProbes.updateOptions({ 'file': gpdata });
    }, 1000);
    fixGraphBackground();
}

function graphProbeRates()
{    
    /* PROBE RATES   */
    if (typeof graphProbeRatesInterval !== 'undefined')
        clearInterval(graphProbeRatesInterval);
    var gprdata = [];
    var t = new Date();
    gprdata.push([t, 0,0,0]);

    var gProbeRates = new Dygraph(document.getElementById("graphProbeRatesDiv"), gprdata,
        {
            title: "Probe change rates",
            drawPoints: true,
            showRoller: true,
            rollPeriod: 1,
            labels: ['Time', 'ProbeRate', 'HazardRate', 'CombatRate']
        });

    // Store dygraph instance in the wrapper for resize functionality
    var wrapper = document.getElementById("graphProbeRatesDiv").parentElement;
    if (wrapper && wrapper.setDygraphInstance) {
      wrapper.setDygraphInstance(gProbeRates);
    }

    var lastHazards = probesLostHaz;
    var lastCombat = probesLostCombat;
    var lastProbes = probeCount;

    graphProbeRatesInterval = setInterval(function () {
        var x = new Date();  // current time
        
        var diffProbes = probeCount - lastProbes;
        lastProbes = probeCount;
        var diffHaz = probesLostHaz - lastHazards;
        lastHazards = probesLostHaz;
        var diffCombat = probesLostCombat - lastCombat;
        lastCombat = probesLostCombat;

        //console.log("[GRAPH] Rate is " + diff + "  " + clips + " - " + lastClips);

        gprdata.push([x, diffProbes, diffHaz, diffCombat]);
        if (gprdata.length > 100) {
            gprdata.splice(0, 1);
        }
        gProbeRates.updateOptions({ 'file': gprdata });
    }, 1000);
    fixGraphBackground();
}

function clearStage1Graphs()
{
	clearIntervalSafe('graphClipsRateInterval');
	clearIntervalSafe('graphInvestmentsInterval');
	clearIntervalSafe('graphYomiInterval');
	clearIntervalSafe('graphRevenueInterval');
	clearDivSafe('graphClipsRateDiv');
	clearDivSafe('graphInvestmentsDiv');
	clearDivSafe('graphYomiDiv');
	clearDivSafe('graphRevenueDiv');  
}

function loadStage1Graphs()
{
	graphClipRates();
	graphInvestments();
	graphYomi();
	graphRevenue();
}

function clearStage2Graphs()
{
	clearIntervalSafe('graphDronesRateInterval');
	clearDivSafe('graphDronesDiv');
	clearDivSafe('graphMatterRateDiv');
	clearDivSafe('graphWireRateDiv');
}

function loadStage2Graphs()
{
	graphDrones();
	graphMatterRate();
	graphWireRate();
}

function clearStage3Graphs()
{
	clearIntervalSafe('graphExplorationInterval');
	clearIntervalSafe('graphProbesInt');
	clearIntervalSafe('graphProbeRatesInterval');

	clearDivSafe('graphExplorationDiv');
	clearDivSafe('graphProbesDiv');
	clearDivSafe('graphProbeRatesDiv');
}

function loadStage3Graphs()
{
	graphExploration();
	graphProbes();
	graphProbeRates();
}

function clearIntervalSafe(interval)
{
	if (typeof interval !== 'undefined')
	{
		console.log("Trying to clear interval: " + interval);
	}
	else
	{
		console.log("Interval not found: " + interval);
	}
}

function clearDivSafe(div) 
{
	console.log("Checking div: " + div);

	if (document.getElementById(div) !== null) 
	{

		console.log("Removing div: " + div);
		document.getElementById(div).remove();
	}
	else 
	{
		console.log("Tried to remove div but it didn't exist: " + div);
	}
}

/**
 * CONTROL PANEL
 * A UI component for managing configuration options
 */
(function() {
	// Configuration metadata: variable name, display label, default value
	var configOptions = [
		{ varName: 'cfg_disablePrints', label: 'Disable Prints', defaultValue: false },
		{ varName: 'cfg_disableClicker', label: 'Disable Clicker', defaultValue: true },
		{ varName: 'cfg_disablePricer', label: 'Disable Pricer', defaultValue: true },
		{ varName: 'cfg_disableInvestor', label: 'Disable Investor', defaultValue: true },
		{ varName: 'cfg_disableManageComputational', label: 'Disable Manage Computational', defaultValue: false },
		{ varName: 'cfg_disableImproveInvestments', label: 'Disable Improve Investments', defaultValue: false },
		{ varName: 'cfg_disableModeling', label: 'Disable Modeling', defaultValue: false },
		{ varName: 'cfg_disableDroneManager', label: 'Disable Drone Manager', defaultValue: true },
		{ varName: 'cfg_disableProbeLauncher', label: 'Disable Probe Launcher', defaultValue: true },
		{ varName: 'cfg_disableProbesManager', label: 'Disable Probes Manager', defaultValue: true }
	];

	function createControlPanel() {
		// Remove existing panel if any
		var existingPanel = document.getElementById('automationControlPanel');
		if (existingPanel) {
			existingPanel.remove();
		}

		// Create main panel container
		var panel = document.createElement('div');
		panel.id = 'automationControlPanel';
		panel.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 300px; background: #1a1a1a; border: 2px solid #4a4a4a; border-radius: 5px; font-family: Arial, sans-serif; z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.3);';

		// Create title bar
		var titleBar = document.createElement('div');
		titleBar.style.cssText = 'background: #2a2a2a; padding: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 3px 3px 0 0; user-select: none;';
		
		var title = document.createElement('span');
		title.textContent = 'Control Panel';
		title.style.cssText = 'color: #ffffff; font-weight: bold; font-size: 14px;';
		
		var arrow = document.createElement('span');
		arrow.textContent = '▼';
		arrow.id = 'controlPanelArrow';
		arrow.style.cssText = 'color: #ffffff; font-size: 12px; transition: transform 0.3s;';
		
		titleBar.appendChild(title);
		titleBar.appendChild(arrow);
		panel.appendChild(titleBar);

		// Create content container
		var content = document.createElement('div');
		content.id = 'controlPanelContent';
		content.style.cssText = 'padding: 10px; max-height: 400px; overflow-y: auto;';

		// Create toggle for each config option
		configOptions.forEach(function(option) {
			var row = document.createElement('div');
			row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #3a3a3a;';

			var label = document.createElement('label');
			label.textContent = option.label;
			label.style.cssText = 'color: #cccccc; font-size: 12px; flex: 1;';
			label.setAttribute('for', option.varName + '_toggle');

			// Create toggle switch
			var toggleContainer = document.createElement('div');
			toggleContainer.style.cssText = 'position: relative; width: 44px; height: 24px;';

			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.id = option.varName + '_toggle';
			checkbox.checked = window[option.varName] === true;
			checkbox.style.cssText = 'opacity: 0; width: 0; height: 0;';
			
			var slider = document.createElement('span');
			slider.style.cssText = 'position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; border-radius: 24px; transition: 0.3s;';
			
			var knob = document.createElement('span');
			knob.style.cssText = 'position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: 0.3s;';
			slider.appendChild(knob);

			// Update slider appearance based on checkbox state
			function updateSlider() {
				if (checkbox.checked) {
					slider.style.backgroundColor = '#2196F3';
					knob.style.transform = 'translateX(20px)';
				} else {
					slider.style.backgroundColor = '#555';
					knob.style.transform = 'translateX(0)';
				}
			}

			// Common toggle handler
			function handleToggle() {
				window[option.varName] = checkbox.checked;
				updateSlider();
				console.log('[CONTROL PANEL] ' + option.label + ' set to: ' + checkbox.checked);
			}

			updateSlider();

			// Handle checkbox change
			checkbox.addEventListener('change', handleToggle);

			// Allow clicking on slider to toggle
			slider.addEventListener('click', function() {
				checkbox.checked = !checkbox.checked;
				handleToggle();
			});

			toggleContainer.appendChild(checkbox);
			toggleContainer.appendChild(slider);

			row.appendChild(label);
			row.appendChild(toggleContainer);
			content.appendChild(row);
		});

		panel.appendChild(content);

		// Add collapse/expand functionality
		var isCollapsed = false;
		titleBar.addEventListener('click', function() {
			isCollapsed = !isCollapsed;
			if (isCollapsed) {
				content.style.display = 'none';
				arrow.style.transform = 'rotate(-90deg)';
			} else {
				content.style.display = 'block';
				arrow.style.transform = 'rotate(0deg)';
			}
		});

		// Add panel to page
		document.body.appendChild(panel);
		console.log('[CONTROL PANEL] Control panel initialized');
	}

	// Initialize the control panel when the script loads
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', createControlPanel);
	} else {
		createControlPanel();
	}
})();

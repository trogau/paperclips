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
var cfg_disableClicker = false;
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
var cfg_disablePricer = false;
if (typeof pricer !== 'undefined')
    clearInterval(pricer);
var pricer = setInterval(function() {
    if (cfg_disablePricer == true)
        return;

    /*if (demand < 7)
    {
        console.log("[PRICER] No demand!");
        if (margin > 0.01)
        {
            lowerPrice();
            console.log("[PRICER] No demand, lowering price to " + margin);
        }
        return;
    }
    */

    clipTarget = clips/100;
    if (clips > 10000)
        clipTarget = clipTarget + 100;
    if (unsoldClips > clipTarget )
    {
        if (margin > 0.01)
        {
            lowerPrice();
            if (unsoldClips > 1000000)
            {
                if (margin > 0.01)
                    lowerPrice();
            }
            console.log("[PRICER] Lowering price to " + margin);
        }
    }
    else 
    {
        raisePrice();
        raisePrice();
        raisePrice();

        console.log("[PRICER] Raising price to " + margin);

    }
}, 3000);

/**
 * STAGE 1 INVESTOR
 */
var projectBuyList = [ 'projectButton1', 'projectButton3', 'projectButton4', 'projectButton5', 'projectButton6', 'projectButton7', 'projectButton8', 'projectButton9', 'projectButton10', 'projectButton10b', 'projectButton11','projectButton12', 'projectButton13', 'projectButton14', 'projectButton15', 'projectButton16', 'projectButton17', 'projectButton19','projectButton20', 'projectButton21', 'projectButton22','projectButton23', 'projectButton24', 'projectButton25', 'projectButton26', 'projectButton27', 'projectButton28', 'projectButton29', 'projectButton30', 'projectButton31', 'projectButton34', 'projectButton40', 'projectButton40b','projectButton42', 'projectButton50', 'projectButton51', 'projectButton60', 'projectButton61', 'projectButton62', 'projectButton63', 'projectButton64', 'projectButton65', 'projectButton66', 'projectButton70', 'projectButton119'];
var projectEndStageList = [ 'projectButton35'];
var cfg_disableInvestor = false;
if (typeof investor !== 'undefined')
    clearInterval(investor);
var investor = setInterval(function() { 
    if (cfg_disableInvestor == true)
    {
        console.log("[INVESTOR] Investor disabled, skipping");
        return;
    }

    /**
     * PROJECT MANAGEMENT
     */
    // Don't do anything until we have the projects to get started

    // projectBuyList.forEach(function(projectBuy) { // this doesn't allow break'ing
    for (let projectBuy of projectBuyList)
    {
        if (typeof document.getElementById(projectBuy) !== "undefined" && document.getElementById(projectBuy) !== null)
        {
            projectObj = document.getElementById(projectBuy);
        

            if (projectObj.disabled == true)
            {
                console.log("[INVESTOR] Waiting for " + projectBuy + "");
                //return;
            }
            else if (projectObj.disabled == false)
            {
                console.log("[INVESTOR] Getting " + projectBuy + "");
                projectObj.click();
                console.log("[INVESTOR] Returning here, shouldn't buy any more");
                break;
            }
        }
    }

    /* 
    // FIXME: 
    for (let projectBuy of projectEndStageList)
    {
        if (typeof document.getElementById(projectBuy) !== "undefined" && 
    }
    */

    if (typeof projectButton38 !== "undefined" && projectButton38.disabled == true && portTotal+funds >= 7000000)
    {
        console.log("[INVESTOR] Mid game: stockpiling for Full Monopoly");
        investStratElement.selectedIndex = 0; // Set to Low Risk to remove cash faster(?)
        investWithdraw();
        runModeling();
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
        console.log("[INVESTOR] Mid game: withdrawing cash to get project37 (Hostile Takeover)");

        investWithdraw();

        // This won't process immediately after withdraw even if all the funds are there so we need to wait a few loops until cash accumulates
        console.log("[INVESTOR] ERROR: withdrew cash but couldn't buy project37, skipping rest of processing");
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
       console.log("[INVESTOR] Mid game: stockpiling for Token of Goodwill");
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
        console.log("[INVESTOR] Late game! Let's just stockpile money.");
        investWithdraw();
        runModeling();
        return;
    }


    var buyStr = "";
    if (wire < 2000) 
    { 
        buyStr = buyStr + "wire";
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
        console.log("[INVESTOR] Late game bulk wire buying");
        for ($i = 0; $i < 10; $i++)
            buyWire()
    }   

    //if (megaClipperDiv.style.display !== "none" || btnMakeMegaClipperElement.disabled == false)
    if (getComputedStyle(document.getElementById("megaClipperDiv")).display !== "none")
    {
        if (megaClipperCost < 7000000 && bankroll > megaClipperCost*10 && marketingLvl >= 12 && megaClipperLevel <= 100)
        {
            console.log("[INVESTOR] Plenty of spare bankroll, making a withdrawal to buy MEGAclippers while we have < 100 of them");
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
    else if (clipperCost < funds && (funds > 200 || clipperCost < 20) && clipperCost < adCost)
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
        else
        {
            if (adCost*4 < funds)
                buyAds();
        }
    }

    if (buyStr == "")
        buyStr = "nothing!";

    console.log("[INVESTOR] Buying " + buyStr);
    // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
    if (getComputedStyle(document.getElementById("investmentEngine")).display == "none")
    {
        //console.log("[INVESTOR] Investing not yet available, it seems - skipping"); 
    }
    else
    {
        // Randomly withdraw at the end of the cycle to clear up a bunch of funds for upgrades

        let randomChance = 0.1;
        if (portTotal > 40000000)
            randomChance = 0.5;

        if (Math.random() < 0.1 && btnWithdraw.disabled == false )
        {
            console.log("[INVESTOR] Randomly withdrawing investment funds! Chance: " + randomChance);
            investWithdraw();
        }
        else
        {
            console.log("[INVESTOR] Depositing " + funds); 
            investDeposit(); 
            if (investLevel > 4)
                investStratElement.selectedIndex = 2; // Set to Medium Risk to remove cash faster(?)
            else if (investLevel > 2)
                investStratElement.selectedIndex = 1; // Set to High Risk to remove cash faster(?)

        }
    }

    console.log("[INVESTOR] Calling modeling...");
    runModeling()
}, 5000);

/**
 * MANAGE COMPUTATIONAL RESOURCES
 * */ 
  
if (typeof manageComputational !== 'undefined')
    clearInterval(manageComputational);
var manageComputational = setInterval(function()
{
    if (trust > (processors + memory))
    {
        if (processors < (memory / 2) || memory > 250)
        {
            console.log("[COMPUTE] Spare trust, adding processor");
            addProc();
        }
        else
        {
            console.log("[COMPUTE] Spare trust, adding memory");
            addMem();
        }
    }

    if (swarmGifts > 0)
    {
        if (processors < (memory / 2) || memory > 250)
        {
            console.log("[COMPUTE] Spare swarm gifts, adding processor");
            addProc();
        }
        else
        {
            console.log("[COMPUTE] Spare swarm gifts, adding memory");
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
        /*console.log("[QUANTUM] Quantuming: " + qChip0.value);*/
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
        console.log("[MODELING] skipping modelling");
        return;
    }

    if (btnNewTournamentElement.disabled == false) 
    {
        console.log("[MODELING] New Tourney");
        newTourney();
        if (btnRunTournamentElement.disabled == false)
        {
            runTourney();       
        }
        else
        {
            console.log("[MODELING] ERROR: Tried to run a tournament but the button was disabled?");
        }
    }

    if (cfg_disableImproveInvestments == false)
    {
        if (btnImproveInvestments.disabled == false)
        {
            if (investLevel < 8)
            {
                console.log("[MODELING] Upgrade Investment Engine");
                investUpgrade();
            }
            else
            {
                //console.log("[MODELING] Investment Engine already at level 7, skipping any more upgrades to save Yomi");
            }
        }
    }
    else
    {
        /*console.log("[MODELING] Skipping upgrade of Investment Engine");*/
    }
}
//}, 1000);



/** STAGE TWO */

/* SOLAR/DRONE PHASE INVESTOR */
var projectBuyList = [ 'projectButton18', 'projectButton127', 'projectButton41', 'projectButton43', 'projectButton44', 'projectButton45', 'projectButton46', 'projectButton100', 'projectButton101', 'projectButton102', 'projectButton110', 'projectButton111', 'projectButton112', 'projectButton126', 'projectButton125' ];
var cfg_disableDroneManager = false;
if (typeof droneManager !== 'undefined')
    clearInterval(droneManager);
var droneManager = setInterval(function() { 
    if (cfg_disableDroneManager == true)
    {
        //console.log("[DRONE] Drone Manager disabled, skipping");
        return;
    }

    if (slider.value < 190)
    {
        console.log("[DRONE] Slider at " + slider.value);
        slider.value = Number(slider.value) + 10;
    }
    else
    {
        if (Math.random() < 0.02)
        {
            console.log("[DRONE] Slider randomly set to Work");
            slider.value = 10;
        }
    }


    /**
     * PROJECT MANAGEMENT
     */
    // Don't do anything until we have the projects to get started
    for (let projectBuy of projectBuyList)
    {
        if (typeof document.getElementById(projectBuy) !== "undefined" && document.getElementById(projectBuy) !== null)
        {
            projectObj = document.getElementById(projectBuy);       

            if (projectObj.disabled == true)
            {
                console.log("[DRONE] Waiting for " + projectBuy + " to get started");
                //return;
            }
            else if (projectObj.disabled == false)
            {
                console.log("[DRONE] Getting " + projectBuy + "");
                projectObj.click();
                break;
            }
        }
    }

    if (availableMatter == 0 && wire == 0)
    {
        console.log("[DRONE] END GAME! Rebooting factories to get clips");
        factoryReboot();
        cfg_disableProbesManager = false;
        cfg_disableDroneManager = true;
        console.log("[DRONE] END GAME! Clearing interval for droneManager");
        clearInterval(droneManager);
    }


    var droneMultiplier = 1;

    if ( (harvesterCost + wireDroneCost) * 1000 < (unusedClips - unusedClips/10))
    {
        droneMultiplier = 1000;
        console.log("[DRONE] Drone Multiplier changed to " + droneMultiplier + ", plenty of spare clips");
    }
    else if ( (harvesterCost + wireDroneCost) * 100 < (unusedClips - unusedClips/10))
    {
        droneMultiplier = 100;
        console.log("[DRONE] Drone Multiplier changed to " + droneMultiplier + ", plenty of spare clips");
    }
    else if ( (harvesterCost + wireDroneCost) * 10 < (unusedClips - unusedClips/10))
    {
        droneMultiplier = 10;
        console.log("[DRONE] Drone Multiplier changed to " + droneMultiplier + ", plenty of spare clips");
    }

    /* Leave a buffer */ 
    /* This needs to happen first otherwise power shortages can occur  */
    var powerConsumptionRate = (factoryPowerRate*factoryLevel) + wireDroneLevel + harvesterLevel;
    var safetyMargin = powerConsumptionRate / 10;

    if (getComputedStyle(document.getElementById("powerDiv")).display == "none" || getComputedStyle(document.getElementById("powerDiv")).display == "none")
    {
        console.log("[DRONE] Solar div not visible yet, skipping");
        return;
    }


    if ( (powerConsumptionRate + safetyMargin) >= parseFloat(document.getElementById("powerProductionRate").innerHTML.replace(/,/g,'')))
    {
        if (storedPower > (powerConsumptionRate*300) )
        {
            console.log("[DRONE] Short on power, but plenty stored, so not buying new stuff");
        }
        else
        {
            let solarMultiplier = droneMultiplier / 10;
            if (solarMultiplier < 1)
                solarMultiplier = 1;

            console.log("[DRONE] Buying solar farm (" + solarMultiplier + ") + battery");
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
                console.log("[DRONE] WARNING: wanted to buy solar farm but can't afford it, skipping the rest of processing until we can");
                if (farmCost < unusedClips)
                {
                    console.log("[DRONE] Can afford one solar farm though!");
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
        console.log("[DRONE] Power is at " + ( powerConsumptionRate + safetyMargin));
        if (batteryCost < unusedClips / 100 && batteryLevel * 10000 < 10000000 && factoryLevel > 50)
        {
            console.log("[DRONE] Plenty of clips and battery capacity is low, buying more batteries (10x)");
            makeBattery(10);
        }
        else if (batteryCost < unusedClips / 10 && batteryLevel * 10000 < 10000000 && factoryLevel > 50)
        {
            console.log("[DRONE] Plenty of clips and battery capacity is low, buying more batteries (1)");
            makeBattery(1);
        }
    }

    // WAit for the 1 sextillion clips mark
    if (factoryLevel >= 76 && project102.flag == 0) // FIXME NOT SURE IF THIS FLAG IS RIGHT
    {
        console.log("[DRONE] Waiting for project102, FIXME");
        return;
    }
    else if (wire > 1000000000000 && factoryLevel >= 70 && factoryCost < unusedClips)
    {
        console.log("[DRONE] Making late-game factory with no headroom");
        makeFactory();
        if (availableMatter == 0) // If we're at the end game, buy two
        {
            if (factoryCost < unusedClips)
                makeFactory();
        }
    }
    else if (wire > 1000000000000 && factoryLevel >= 20 && factoryCost >= unusedClips)
    {
        console.log("[DRONE] Backlog of wire, waiting until we can make some factories"); // FIXME this might not be useful, might be too late?
        // if we end up with 2k harv & 4k wire with only 20 factories that's not enough factories!
        return;
    }
    else if (factoryCost < unusedClips && factoryLevel <= 70) // at 70 they cost > 200 quintillion; the big target at this point is 1 sextillion chips
    {
        console.log("[DRONE] Making factory");
        makeFactory();
    }
    else if (factoryCost*2 < unusedClips && factoryLevel >= 70  &&  wire > 0) 
    {
        console.log("[DRONE] Making late-game factory with headroom of 2x factory cost");
        makeFactory();
    }
    else
    {
        if (factoryLevel >= 10 && factoryLevel <= 20 && harvesterLevel > 100 && wireDroneLevel > 100)
        {
            if (Math.random() < 0.2)
            {
                console.log("[DRONE] Randomly allowing processing to continue!");
            }
            else
            {
                console.log("[DRONE] Not enough clips to make a factory, skipping processing until we can");
                return;
            }
        }
    }

    if (availableMatter == 0)
    {
        console.log("[DRONE] NO MATTER LEFT! doing nothing");
        return;
    }   

    if (wire > 10000000000 && factoryLevel < 20)
    {
        console.log("[DRONE] Big wire stockpile, waiting until we can buy some factories");
        return;
    }

    if (getComputedStyle(document.getElementById("harvesterDiv")).display == "none" || getComputedStyle(document.getElementById("wireDroneDiv")).display == "none")
    {
        console.log("[DRONE] FIXME: Harvester/Wire div not visible, returning");
        return; 
    }

    if (acquiredMatter == 0)
    {
        if (harvesterCost*droneMultiplier < unusedClips)
        {
            console.log("[DRONE] Making harvester * " + droneMultiplier);
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
                console.log("[DRONE] We have plenty of matter, reducing harvester intake to " + adjMultiplier);
                makeHarvester(adjMultiplier);
            }
            else
            {
                console.log("[DRONE] Skipping harvest drones to try to equalise levels of wire and harvester drones");
            }
        }
        else
            console.log("[DRONE] Plenty of matter, skipping harvester purchase");
    }
    
    if (wireDroneCost*droneMultiplier < unusedClips && wireDroneLevel < harvesterLevel*2)
    {
        console.log("[DRONE] Making wireDrone * " + droneMultiplier);
        makeWireDrone(droneMultiplier);
    }
    else if (wireDroneCost < unusedClips)
    {
        console.log("[DRONE] Making single wireDrone, can't afford multiplier");
        makeWireDrone(1);
    }

    runModeling();

}, 2000);


if (typeof probesTotalRate !== 'undefined')
    clearInterval(probesTotalRate);
var tmp_lastProbeCount = 0;
var tmp_lastProbesLostHaz = 0;
var tmp_probeDescendents = 0;
var probesTotalRate = setInterval(function()
{
    //var current = parseFloat(document.getElementById("probesTotalDisplay").innerHTML.replace(/,/g,''));
    
    var diff = probeCount - tmp_lastProbeCount;
    console.log("[PROBERATES] TOTAL: " + Math.round(diff).toLocaleString() + " difference in probes: ");
    tmp_lastProbeCount = probeCount;
    
    diff = probesLostHaz - tmp_lastProbesLostHaz;
    console.log("[PROBERATES] HAZARDS: " + Math.round(diff).toLocaleString() + " difference in probes: ");
    tmp_lastProbesLostHaz = probesLostHaz;
    
    diff = probeDescendents - tmp_probeDescendents;
    console.log("[PROBERATES] DESCENDENTS: " + Math.round(diff).toLocaleString() + " difference in probes: ");
    tmp_probeDescendents = probeDescendents;

    
}, 2000);

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
var projectBuyList = [ 'projectButton120', 'projectButton121', 'projectButton128', 'projectButton129', 'projectButton130', 'projectButton131', 'projectButton132', 'projectButton133', 'projectButton134', 'projectButton218' ];
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
        console.log("[PROBES] Slider at " + slider.value);
        slider.value = Number(slider.value) + 10;
    }
    else
    {
        if (Math.random() < 0.05)
        {
            console.log("[PROBES] Slider randomly set to Work");
            slider.value = 10;
        }
    }
    
    if (btnIncreaseProbeTrust.disabled == false && yomi > 10000) //  FIXME: need to save a buffer of 45000 yomi for late game to buy OODA Loop for speed helping in battles
    {
        console.log("[PROBES] Increasing probe trust");
        increaseProbeTrust();
    }

    if (btnIncreaseMaxTrust.disabled == false)
    {
        increaseMaxTrust();
    }

    runModeling(); // should be at the end once we untangle stuff

    if (synchButtonDiv.style.display !== "none" && btnSynchSwarmElement.disabled == false && yomi > 5000) 
    {
        console.log("[DRONE] Swarm is out of sync, fixing");
        synchSwarm(); 
    }


    for (let projectBuy of projectBuyList)
    {
        if (typeof document.getElementById(projectBuy) !== "undefined" && document.getElementById(projectBuy) !== null)
        {
            projectObj = document.getElementById(projectBuy);       

            if (projectObj.disabled == true)
            {
                console.log("[PROBES] Waiting for " + projectBuy + " to get started");
                //return;
            }
            else if (projectObj.disabled == false)
            {
                console.log("[PROBES] Getting " + projectBuy + "");
                projectObj.click();
                break;
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

    // everything is terrible
    if (probeCount <= 50000)
    {
        var probeMode = "sub-50k-panic-mode";
        if (checkProbeModeChange(probeMode) == false)
            return;
        console.log("[PROBES] Less than 50k probes! Panic mode");
        targetRep = Math.floor(probeTrust * 0.6666);
        targetHaz = Math.ceil(probeTrust * 0.3333);
        setProbeValue('Rep', targetRep);
        setProbeValue('Haz', targetHaz);
        setProbeValue('Combat', 0);
        setProbeValue('Fac', 0);
        setProbeValue('Harv', 0);
        setProbeValue('Wire', 0);
        setProbeValue('Speed', 0);
        setProbeValue('Nav', 0);
        return;
    }
    else if (probeCount <= 1000000)
    {
        var probeMode = "50k-1m-slow-growth";
        if (checkProbeModeChange(probeMode) == false)
            return;
        console.log("[PROBES] 50k-1m probes! Slow growth mode");
        targetRep = Math.floor(probeTrust * 0.5)-2;
        targetHaz = targetRep-1;
        setProbeValue('Rep', targetRep);
        setProbeValue('Haz', targetHaz);
        setProbeValue('Combat', 0);
        setProbeValue('Fac', 1);
        setProbeValue('Harv', 1);
        setProbeValue('Wire', 1);
        setProbeValue('Speed', 1);
        setProbeValue('Nav', 1);

        return;
    }   
    else if (probeCount <= 20000000)
    {
        var probeMode = "1m-20m-steady-farming-growth";
        if (checkProbeModeChange(probeMode) == false)
            return;
        console.log("[PROBES] 1m-20m probes! Steady farming & growth");
        targetRep = Math.floor(probeTrust * 0.5)-2;
        targetHaz = targetRep-1;
        setProbeValue('Rep', targetRep);
        setProbeValue('Haz', targetHaz);
        setProbeValue('Combat', 0);
        setProbeValue('Fac', 1);
        setProbeValue('Harv', 1);
        setProbeValue('Wire', 1);
        setProbeValue('Speed', 1);
        setProbeValue('Nav', 1);

        return;
    }
    else if (probeCount <= 80000000)
    {
        if (drifterCount < probeCount / 2)
        {
            var probeMode = "20m-80m-boost-farming-combat";
            if (checkProbeModeChange(probeMode) == false)
                return;
            console.log("[PROBES] 20m-80m probes! Boost farming + COMBAT");

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
            console.log("[PROBES] 20m-80m probes! OUTNUMBERED growth");

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
            console.log("[PROBES] 20m-80m probes! Boost farming");
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

        /* // Saving the day
        Trust: 30 / 30 (30 Max), Speed: 5, Exploration: 2, Self-Replication: 8, Hazard Remediation: 7
        Factory Production: 1, Harvester Drone Production: 1, Wire Drone Production: 1, Combat: 5 
        */

        return;
    }
    else if (probeCount <= 100000000)
    {
        if (drifterCount > probeCount*10)
        {
            var probeMode = "80m-100m-go-big-fighting";
            if (checkProbeModeChange(probeMode) == false)
                return;

            console.log("[PROBES] 80m-100m probes but too many drifters - big combat roll!");
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

            return;         
        }
        else
        {
            var probeMode = "80m-100m-try-fighting";
            if (checkProbeModeChange(probeMode) == false)
                return;
            
            console.log("[PROBES] 80m-100m probes - let's try fighting");
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

            return;
        }
    }
    else if (drifterCount < probeCount)
    {
        var probeMode = "100m-stable-combat";
        if (checkProbeModeChange(probeMode) == false)
            return;

        let ratioTotal = 30;

        targetSpeed = Math.floor(3 * (probeTrust / ratioTotal));
        targetNav = Math.floor(3 * (probeTrust / ratioTotal));
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
    else
    {
        console.log("[PROBES] Everything seems OK, doing nothing");
    }

    //if (combatButtonDiv.style.display !== "none")
}, 4000);


function assignSpareTrust()
{
    let spareTrust = probeTrust - getProbeUsedTrust();
        
    console.log("SPARE TRUST is: " + spareTrust);
    if (spareTrust > 0)
    {
        if (spareTrust % 2 == 0)
        {
            console.log("SPARE TRUST divis by 2");
            targetSpeed = probeSpeed + (spareTrust / 2);
            targetNav = probeNav + (spareTrust / 2);
            console.log("Target Speed: " + targetSpeed + " Target Nav: "  + targetNav);
            setProbeValue('Speed', targetSpeed);
            setProbeValue('Nav', targetNav);
        }
        else
        {
            for (i = spareTrust; i > 0; i--)
            {
                if (Math.random() > 0.5)
                {
                    targetSpeed = probeSpeed + 1;
                    console.log("TARGET SPEED: " + targetSpeed);
                    setProbeValue('Speed', targetSpeed);
                }
                else
                {
                    targetNav = probeNav + 1;
                    console.log("TARGET NAV: " + targetSpeed);
                    setProbeValue('Speed', targetNav);
                }
            }
        }
    }   
}

function checkProbeModeChange(probeMode)
{
    console.log("[PROBES] ============ "+ probeMode + " ============");

    if (lastProbeMode == probeMode)
    {
        console.log("[PROBES] Still in mode: " + probeMode + ", returning, no need for changes; assigning spare trust");
        console.log("[PROBES] FIXME RETURNING TRUE");
        assignSpareTrust();
        lastProbeMode = probeMode;
        return true; 
    }
    else
    {
        console.log("[PROBES] New probeMode: FIXME RETURNING FALSE"+ probeMode);
        lastProbeMode = probeMode;
        return true;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getProbeUsedTrust()
{
    let tmpProbeUsedTrust = (probeSpeed+probeNav+probeRep+probeHaz+probeFac+probeHarv+probeWire+probeCombat);
    return tmpProbeUsedTrust;
}

function setProbeValue(field, target)
{
    // NOTE: probeUsedTrust is not updated frequently enough to be useful so we'll calculate our own value in each request
    let tmpProbeUsedTrust = getProbeUsedTrust();
    target = Math.floor(target);

    //btnRaiseProbeSpeed

    raiseButton = document.getElementById('btnRaiseProbe' + field);
    lowerButton = document.getElementById('btnLowerProbe' + field);

    //console.log("Target var value for " + field + "  is: " + window['probe' + field]);

    if (window['probe' + field] > target && window['probe' + field] > 0)
    {
        while (window['probe' + field] > target && window['probe' + field] > 0)
        {
            lowerButton.click();
        }
    }
    else if (window['probe' + field] < target)
    {
        let tmpct = 0; // safety
        //console.log("0: Target var value for "+ field + " is: " + window['probe' + field] + " target: " + target + " tmpProbeUsedTrust: " + tmpProbeUsedTrust + " probeTrust: " + probeTrust);
        while (window['probe' + field] < getProbeUsedTrust() && window['probe' + field] < target && getProbeUsedTrust() < probeTrust)
        //if (window['probe' + field] < getProbeUsedTrust() && window['probe' + field] < target && getProbeUsedTrust() < probeTrust)
        {
            //console.log("2: Target var value for "+ field + " is: " + window['probe' + field] + " target: " + target + " tmpProbeUsedTrust: " + tmpProbeUsedTrust + " probeTrust: " + probeTrust);
            
            tmpct = tmpct + 1;
            if (tmpct > 20)
            {
                console.log("[PROBES] BREAKING, tmpct limit hit");
                break;
            }           

            if (probeTrust - getProbeUsedTrust() > 0 && raiseButton.disabled == true)
            {
                // FIXME: hack
                console.log("[PROBES] FIXME: Hack for disabled button");
                console.log(raiseButton);
                for (let i = 0; i < 100; i++)
                {
                    if (i%25==0)
                        console.log("LOOP HACK sleep: " + i);
                }
                //raiseButton.disabled = false;
            }

            if (raiseButton.disabled == false)
            {
                raiseButton.click();
            }
            else
                console.log("[PROBES] ERROR: " + raiseButton.id + " button is disabled, skipping! " + getProbeUsedTrust() + "/" + probeTrust + " target: " + target);
            

        }   
    }
}

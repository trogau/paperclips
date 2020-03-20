//https://jsfiddle.net/0h1z72s0/
//http://jsfiddle.net/api/post/jquery/1.4/

/** INIT */
/*var graphLibLoaded = false;
function initGraphs(stage)
{
  if (graphLibLoaded == true)
  {
    return new Promise(resolve => true);
  }

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
    else if (stage == 3);
      stage3Graphs();
  }

  j.onerror = function() {
    console.log("ERROR occurred loading graph scripts");
    return false;
  }

  var fileref = document.createElement("link");
  fileref.rel = "stylesheet";
  fileref.type = "text/css";
  fileref.href = "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css";
  document.getElementsByTagName("head")[0].appendChild(fileref);

  return new Promise(resolve => true, reject => false);
}*/
var graphLibLoaded = false;
function initGraphs(stage)
{
  if (graphLibLoaded == true)
  {
    console.log("GRAPHLIB ALREADY LOADED< RETURNING IMMEDIATELY");
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
      console.log("LOADED graphs for stage: " + stage);
      console.log(typeof(stage));
      
      /*if (stage === 1)
      {
        console.log("Calling stage 1 graphs " + stage );
        stage1Graphs();
      }
      else if (stage === 2)
      {
        console.log("Calling stage 2 graphs " + stage );
        stage2Graphs().then(resolve=>console.log("loaded stage 2"));
      }
      else if (stage === 3)
      {
        console.log("Calling stage 3 graphs " + stage );
        stage3Graphs();
      }*/

      var fileref = document.createElement("link");
      fileref.rel = "stylesheet";
      fileref.type = "text/css";
      fileref.href = "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css";
      document.getElementsByTagName("head")[0].appendChild(fileref);

      graphLibLoaded = true;
      resolve(true);
    }

    /*j.onerror = function() {
      console.log("ERROR occurred loading graph scripts");
      reject(false);
    }*/
  });
}

function fixGraphBackground()
{
  var x = document.getElementsByTagName("canvas");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.background = "0,0,0";
  }
}
/** END INIT */

function stage1Graphs()
{
  console.log("================ DIVS FOR STAGE 1 GRAPHS ================");
  if (typeof document.getElementById('graphClipsRate') == null)
    return;

  return new Promise(function(resolve,reject)
  {
    var graphClipsRate = document.createElement('div'); 
    graphClipsRate.style = "position: absolute;right:10px;top:110px;border: solid 1px green;width: 500px;height: 400px;"
    graphClipsRate.id = "graphClipsRateDiv";
    document.body.appendChild(graphClipsRate); 

    // INVESTMENT PORTFOLIO
    var graphInvestments = document.createElement('div'); 
    graphInvestments.style = "position: absolute;right:510px;top:110px;border: solid 2px yellow;width: 500px;height: 400px;"
    graphInvestments.id = "graphInvestmentsDiv";
    document.body.appendChild(graphInvestments); 

    var graphYomi = document.createElement('div'); 
    graphYomi.style = "position: absolute;right:10px;top:510px;border: solid 1px red;width: 500px;height: 400px;"
    graphYomi.id = "graphYomiDiv";
    document.body.appendChild(graphYomi); 

    var graphRevenue = document.createElement('div'); 
    graphRevenue.style = "position: absolute;right:510px;top:510px;border: solid 1px blue;width: 500px;height: 400px;"
    graphRevenue.id = "graphRevenueDiv";
    document.body.appendChild(graphRevenue); 

    resolve(true);
  });
}


function stage2Graphs()
{
  console.log("================ DIVS FOR STAGE 2 GRAPHS ================");
  //if (typeof document.getElementById('graphDrones') == null)
    //return;
    
  return new Promise(function(resolve,reject)
  {
    var graphDrones = document.createElement('div'); 
    graphDrones.style = "position: absolute;right:50px;top:150px;border: solid 1px green;width: 500px;height: 400px;"
    graphDrones.id = "graphDronesDiv";
    document.body.appendChild(graphDrones); 

    resolve(true);
  });
}

function stage3Graphs()
{
  console.log("================ DIVS FOR STAGE 3 GRAPHS ================");
  if (typeof document.getElementById('graphProbes') == null)
    return;

    return new Promise(function(resolve,reject)
    {
      var graphProbes = document.createElement('div'); 
      graphProbes.style = "position: absolute;right:10px;top:110px;border: solid 1px green;width: 500px;height: 400px;"
      graphProbes.id = "graphProbesDiv";
      document.body.appendChild(graphProbes); 

      var graphExploration = document.createElement('div'); 
      graphExploration.style = "position: absolute;right:510px;top:110px;border: solid 2px yellow;width: 500px;height: 400px;"
      graphExploration.id = "graphExplorationDiv";
      document.body.appendChild(graphExploration); 

      var graphProbeRates = document.createElement('div'); 
      graphProbeRates.style = "position: absolute;right:510px;top:510px;border: solid 1px blue;width: 500px;height: 400px;"
      graphProbeRates.id = "graphProbeRatesDiv";
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
          labels: ['Time', 'ClipRate', 'WireRate']
      });

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
}

function loadStage2Graphs()
{
  graphDrones();
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
    //clearInterval(interval);
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
 * Clear all the graphs
 */
function clearAllGraphs()
{
  clearStage1Graphs();
  clearStage2Graphs();
  clearStage3Graphs();
}
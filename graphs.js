

//https://jsfiddle.net/0h1z72s0/
//http://jsfiddle.net/api/post/jquery/1.4/

/** INIT */
var j = document.createElement('script'); 
j.src = "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.js"; 
document.getElementsByTagName('head')[0].appendChild(j);


var fileref = document.createElement("link");
fileref.rel = "stylesheet";
fileref.type = "text/css";
fileref.href = "https://cdnjs.cloudflare.com/ajax/libs/dygraph/2.1.0/dygraph.min.css";
document.getElementsByTagName("head")[0].appendChild(fileref);


function fixGraphBackground()
{
  var x = document.getElementsByTagName("canvas");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].style.background = "0,0,0";
  }
}
/** END INIT */

var graphClipsRate = document.createElement('div'); 
graphClipsRate.style = "position: absolute;right:50px;top:550px;border: solid 1px green;width: 600px;height: 400px;"
graphClipsRate.id = "graphClipsRate";
document.body.appendChild(graphClipsRate); 

// INVESTMENT PORTFOLIO
var graphInvestments = document.createElement('div'); 
graphInvestments.style = "position: absolute;right:650px;top:550px;border: solid 2px yellow;width: 400px;height: 400px;"
graphInvestments.id = "graphInvestments";
document.body.appendChild(graphInvestments); 

var graphYomi = document.createElement('div'); 
graphYomi.style = "position: absolute;right:50px;top:50px;border: solid 1px red;width: 600px;height: 500px;"
graphYomi.id = "graphYomi";
document.body.appendChild(graphYomi); 

var graphDrones = document.createElement('div'); 
graphDrones.style = "position: absolute;right:50px;top:150px;border: solid 1px green;width: 600px;height: 400px;"
graphDrones.id = "graphDrones";
document.body.appendChild(graphDrones); 

var graphProbes = document.createElement('div'); 
graphProbes.style = "position: absolute;right:650px;top:50px;border: solid 1px red;width: 600px;height: 500px;"
graphProbes.id = "graphProbes";
document.body.appendChild(graphProbes); 

var graphExploration = document.createElement('div'); 
graphExploration.style = "position: absolute;right:650px;top:50px;border: solid 2px blue;width: 400px;height: 500px;"
graphExploration.id = "graphExploration";
document.body.appendChild(graphExploration); 

var graphProbeRates = document.createElement('div'); 
graphProbeRates.style = "position: absolute;right:650px;top:550px;border: solid 2px yellow;width: 400px;height: 400px;"
graphProbeRates.id = "graphProbeRates";
document.body.appendChild(graphProbeRates); 

/* CLIPS STAGE 1  */
if (typeof graphClipsRateInterval !== 'undefined')
    clearInterval(graphClipsRateInterval);
var data = [];
var t = new Date();
data.push([t, 0, 0]);

var g = new Dygraph(document.getElementById("graphClipsRate"), data,
    {
        title: "Clips and Wire Growth Rate",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
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

/* INVESTMENTS STAGE 1  */
clearInterval(graphInvestmentsInterval);
var gidata = [];
var t = new Date();
gidata.push([t,0,0,0]);

var gInvestments = new Dygraph(document.getElementById("graphInvestments"), gidata,
    {
        title: "Investments Growth",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
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


    //console.log("[GRAPH] Rate is " + diff + "  " + clips + " - " + lastClips);

    gidata.push([x, portTotal, secTotal, bankroll]);
    if (gidata.length > 100) {
        gidata.splice(0, 1);
    }
    gInvestments.updateOptions({ 'file': gidata });
}, 1000);
fixGraphBackground();




/* CLIPS STAGE 1  */
clearInterval(graphYomiInterval);
/* var data2 = [];
var t = new Date();
for (var i = 10; i >= 0; i--) {
    var x = new Date(t.getTime() - i * 1000);
    data2.push([x, Math.random()]);
} */
var data2 = [];
var t2 = new Date();
data2.push([t2, 1, 1]);

var gYomi = new Dygraph(document.getElementById("graphYomi"), data2,
    {
        title: "Activity",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
        labels: ['Time', 'YomiRate', 'TotalYomi'],
        valueRange: [0.0],
    });


var lastYomi = yomi;

graphYomiInterval = setInterval(function () {
    var x = new Date();  // current time

    var yomiDiff = yomi - lastYomi;
    lastYomi = yomi;

    //console.log("[GRAPH] Rate is " + yomiDiff + "  " + yomi + " - " + lastYomi);

    data2.push([x, yomiDiff, yomi]);
    if (data2.length > 100) {
        data2.splice(0, 1);
    }
    gYomi.updateOptions({ 'file': data2 });
}, 4000);
fixGraphBackground();



/* CLIPS STAGE 2  */
if (typeof graphDronesRateInterval !== 'undefined')
    clearInterval(graphDronesRateInterval);
var gdrdata = [];
var t = new Date();
gdrdata.push([t, Math.random()]);

var gDrones = new Dygraph(document.getElementById("graphDrones"), gdrdata,
    {
        title: "Activity",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
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


/* EXPLORATION   */
clearInterval(graphExplorationInterval);
var gexdata = [];
var t = new Date();
for (var i = 10; i >= 0; i--) {
    var x = new Date(t.getTime() - i * 1000);
    gexdata.push([x, Math.random()]);
}

var gExplored = new Dygraph(document.getElementById("graphExploration"), gexdata,
    {
        title: "Activity",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
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

/* PROBES  */
if (typeof graphProbesInt !== 'undefined')
    clearInterval(graphProbesInt);
var gpdata = [];
var t = new Date();
gpdata.push([t, 0,0,0,0]);

var gProbes = new Dygraph(document.getElementById("graphProbes"), gpdata,
    {
        title: "Activity",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
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


/* PROBE RATES   */
if (typeof graphProbeRatesInterval !== 'undefined')
    clearInterval(graphProbeRatesInterval);
var gprdata = [];
var t = new Date();
gprdata.push([t, 0,0,0]);

var gProbeRates = new Dygraph(document.getElementById("graphProbeRates"), gprdata,
    {
        title: "Activity",
        drawPoints: true,
        showRoller: true,
        rollPeriod: 10,
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


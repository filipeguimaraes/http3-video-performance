var hls = null;
var startTime = 0;

//from events
var dataLoad = new Array(); //{ time: seconds, load: load }
//var dataLatency = new Array(); //{ time: seconds, latency: seconds }
var dataBuffer = new Array(); //{ time: seconds, buffer: buffer }
var dataFPSDrop = new Array(); //{ time: seconds, drop: drop frames, total: total frames }
//var dataBandwidth = new Array();

//from hls
var dataLatencyEstimate = new Array(); // [{ time: seconds, latencyEstimate: latency },...]
var drift = new Array(); //[{time: seconds, drift: seconds},...]
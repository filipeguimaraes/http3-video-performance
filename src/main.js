
function main() {
  var duration = document.getElementById("duration").value;
  var protocol = document.getElementById("protocolSelected").checked == true ? "h2" : "h3";

  if (Hls.isSupported()) {
    var video = document.getElementById("video");
    hls = new Hls();
    hls.loadSource("https://video.dev:443/hls/stream.m3u8");
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });

    //stats at 0 seconds
    dataLatencyEstimate.push({ time: 0, latencyEstimate: hls.latency })
    drift.push({ time: 0, drift: hls.drift });
    startTime = self.performance.now();

    hls.on(Hls.Events.LEVEL_LOADED, onLevelLoaded);
    hls.on(Hls.Events.FRAG_BUFFERED, onFragBuffered);
    hls.on(Hls.Events.FPS_DROP, onFPSDrop);


    setInterval(function () {
      dataLatencyEstimate.push({ time: addTime(), latencyEstimate: hls.latency })
      drift.push({ time: addTime(), drift: hls.drift });
    }, 500);


    setTimeout(() => {
      video.pause();
      hls.destroy();
      saveFile(protocol + "-" + duration + "-" + (new Date()).toISOString() + ".json");
    }, (duration * 1000));

  }
}

//seconds past
function addTime() {
  return (Math.round((self.performance.now() - startTime) / 10) / 100);
}


function onLevelLoaded(event, data) {
  dataLoad.push({ time: addTime(), load: (data.stats.loading.end - data.stats.loading.first) });
}

function onFragBuffered(event, data) {
  dataBuffer.push({ time: addTime(), buffer: (data.stats.buffering.end - data.stats.parsing.end) });
}

function onFPSDrop(event, data) {
  dataFPSDrop.push({ time: addTime(), drop: (data.currentDropped + '/' + data.currentDecoded) });
}



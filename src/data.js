
function saveFile(filename) {
  var dataAll = {
    load: dataLoad,
    buffer: dataBuffer,
    fpsDrop: dataFPSDrop,
    latencyEstimate: dataLatencyEstimate,
    drift: drift
  };
  var jsonObjectAsString = JSON.stringify(dataAll);

  var blob = new Blob([jsonObjectAsString], {
    type: 'application/json'
  });

  var anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.innerHTML = ""
  anchor.click();
  location.reload();
}
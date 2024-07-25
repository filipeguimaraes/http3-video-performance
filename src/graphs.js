var dataH2;
var dataH3;

const fileSelectorH2 = document.getElementById("file-selector-h2");
fileSelectorH2.addEventListener("change", (event) => {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');


    reader.onload = readerEvent => {
        dataH2 = JSON.parse(readerEvent.target.result);
        fileSelectorH2.disabled = true;
        if (dataH3 != undefined) {
            createMeans();
            createCharts();
            createChartsEvents();
        }
    }
});


const fileSelectorH3 = document.getElementById("file-selector-h3");
fileSelectorH3.addEventListener("change", (event) => {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = readerEvent => {
        dataH3 = JSON.parse(readerEvent.target.result);
        console.log(dataH3);
        fileSelectorH3.disabled = true;
        if (dataH2 != undefined) {
            createMeans();
            createCharts();
            createChartsEvents();
        }
    }
});

function roundNum(number) {
    return +(Math.round(number + "e+2") + "e-2");
}

function findMedian(arr) {
    arr.sort((a, b) => a - b);
    const middleIndex = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
        return roundNum((arr[middleIndex - 1] + arr[middleIndex]) / 2);
    } else {
        return arr[middleIndex];
    }
}

function createMeans() {
    let latencyh2 = dataH2.latencyEstimate.map(function (obj) { return obj.latencyEstimate; });
    let latencyh3 = dataH3.latencyEstimate.map(function (obj) { return obj.latencyEstimate; });

    var lateciamediah2 = roundNum(latencyh2.reduce((a, b) => a + b, 0) / latencyh2.length);
    var lateciamediah3 = roundNum(latencyh3.reduce((a, b) => a + b, 0) / latencyh3.length);
    var lateciamedianah2 = roundNum(findMedian(latencyh2));
    var lateciamedianah3 = roundNum(findMedian(latencyh3));

    let drifth2 = dataH2.drift.map(
        function (obj) {
            if (obj.drift > 1) { return roundNum((obj.drift - 1) * 100); }
            else { return roundNum((1 - obj.drift) * 100); }
        }).filter((valor) => valor != -1);
    let drifth3 = dataH3.drift.map(
        function (obj) {
            if (obj.drift > 1) { return roundNum((obj.drift - 1) * 100); }
            else { return roundNum((1 - obj.drift) * 100); }
        }).filter((valor) => valor != -1);

    let driftmediah2 = roundNum(drifth2.reduce((a, b) => a + b, 0) / drifth2.length);
    let driftmediah3 = roundNum(drifth3.reduce((a, b) => a + b, 0) / drifth3.length);
    let driftmedianah2 = roundNum(findMedian(drifth2));
    let driftmedianah3 = roundNum(findMedian(drifth3));

    document.getElementById("lats").innerHTML = '<div style="margin:30px"><h3>Média latência estimadas</h3><b>H2: </b><a>' + lateciamediah2 + ' ms</a><p></p><b>H3: </b><a>' + lateciamediah3 + ' ms</a><p></p><h3>Mediana latência estimadas</h3><b>H2: </b><a>' + lateciamedianah2 + ' ms</a><p></p><b>H3: </b><a>' + lateciamedianah3 + ' ms </a></div>';

    document.getElementById("drift").innerHTML = '<div style="margin:30px"><h3>Média drift</h3><b>H2: </b><a>' + driftmediah2 + ' %</a><p></p><b>H3: </b><a>' + driftmediah3 + ' %</a><p></p><h3><h3>Mediana drift</h3><b>H2: </b><a>' + driftmedianah2 + ' %</a><p></p><b>H3: </b><a>' + driftmedianah3 + ' % </a></div>';
}


function createCharts() {
    new Chart(document.getElementById("latencyChart"), {
        type: "line",
        data: {
            labels: dataH3.latencyEstimate.map(function (obj) { return obj.time; }),
            datasets: [{
                label: "HTTP/2 - Latência estimada",
                data: dataH2.latencyEstimate
            },
            {
                label: "HTTP/3  - Latência estimada",
                data: dataH3.latencyEstimate
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Tempo decorrido (s)', type: 'linear' } },
                y: { title: { display: true, text: 'Latência (ms)' } }
            },
            parsing: {
                xAxisKey: 'time',
                yAxisKey: 'latencyEstimate'
            }
        }
    });

    new Chart(document.getElementById("driftChart"), {
        type: "line",
        data: {
            labels: dataH3.drift.map(function (obj) { return obj.time; }),
            datasets: [{
                label: "HTTP/2 - Drift",
                data: dataH2.drift
            },
            {
                label: "HTTP/3 - Drift",
                data: dataH3.drift
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Tempo decorrido (s)' }, type: 'linear' },
                y: { title: { display: true, text: 'Drift' } }
            },
            parsing: {
                xAxisKey: 'time',
                yAxisKey: 'drift'
            }
        }
    });
}

function createChartsEvents() {
    new Chart(document.getElementById("loadChart"), {
        type: "line",
        data: {
            //labels: Array.from({ length: 61 }, (value, index) => index),
            datasets: [{
                label: "HTTP/2 - Carga",
                data: dataH2.load
            },
            {
                label: "HTTP/3  - Carga",
                data: dataH3.load
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Tempo decorrido (s)' }, type: 'linear' },
                y: { title: { display: true, text: 'Tempo carregado  (s)' } }
            },
            parsing: {
                xAxisKey: 'time',
                yAxisKey: 'load'
            }
        }
    });


    new Chart(document.getElementById("bufferChart"), {
        type: "line",
        data: {
            //labels: dataH3.buffer.map(function (obj) { return obj.time; }),
            datasets: [{
                label: "HTTP/2 - Buffer",
                data: dataH2.buffer
            },
            {
                label: "HTTP/3 - Buffer",
                data: dataH3.buffer
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Tempo decorrido (s)' }, type: 'linear' },
                y: { title: { display: true, text: 'Tempo carregado (s)' } }
            },
            parsing: {
                xAxisKey: 'time',
                yAxisKey: 'buffer'
            }
        }
    });



    new Chart(document.getElementById("fpsChart"), {
        type: "line",
        data: {
            labels: dataH3.fpsDrop.map(function (obj) { return obj.time; }),
            datasets: [{
                label: "HTTP/2 - Fotogramas perdidos",
                data: dataH2.fpsDrop
            },
            {
                label: "HTTP/3 - Fotogramas perdidos",
                data: dataH3.fpsDrop
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Tempo decorrido (s)' } },
                y: { title: { display: true, text: 'Fotogramas perdidos' } }
            },
            parsing: {
                xAxisKey: 'time',
                yAxisKey: 'drop'
            }
        }
    });
}



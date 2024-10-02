var allData = null;

var phrases = [];

var codigoMunicipios = [];
var candidatos = [];

$(document).ready(async function () {
  fetch("candidatos-full.json")
    .then((response) => response.json())
    .then((data) => {
      allData = data;
      SepararPalavras(allData);
    })
    .catch((error) => {
      console.error("Erro ao carregar dados:", error);
      searchResults.innerHTML =
        '<div class="col-12"><p class="text-danger">Falha ao carregar os dados dos candidatos. Por favor, tente novamente mais tarde.</p></div>';
    });
});

async function GerarCanva() {
  var wordCount = {};

  phrases.forEach((phrase) => {
    var palavras = phrase.toLowerCase().split(" ");

    palavras.forEach((palavra) => {
      if (wordCount[palavra]) {
        wordCount[palavra]++;
      } else {
        wordCount[palavra] = 1;
      }
    });
  });

  var palavrasParaNuvem = Object.keys(wordCount).map((palavra) => {
    return { text: palavra, weight: wordCount[palavra] };
  });

  palavrasParaNuvem.sort((a, b) => b.weight - a.weight);

  $("#wordcloud").jQCloud(palavrasParaNuvem);

  //canvas
  gerarNuvemDePalavras();
}

async function newCanva() {
  const wordFrequency = {};

  phrases.forEach((phrase) => {
    const words = phrase.split(" ");
    words.forEach((word) => {
      const lowerWord = word.toLowerCase();
      if (lowerWord) {
        wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
      }
    });
  });

  // Converter o objeto de frequências em um array para o AnyChart
  const data = Object.keys(wordFrequency).map((word) => ({
    x: word,
    value: wordFrequency[word],
  }));

  var dataSet = anychart.data.set(data);
  var colors = anychart.scales
    .ordinalColor()
    .colors(["#26959f", "#f18126", "#3b8ad8", "#60727b", "#e24b26"]);

  var chart = anychart.tagCloud();

  chart
    .title(false) //.title("Nuvem de Palavras")
    .data(dataSet)
    .colorScale(colors)
    .angles([-90, 0, 90]);

  const url = window.location.href;
  if (url.includes("dash.html") || url.includes("dash")) {
    chart.tooltip().enabled(true);
    chart.contextMenu().enabled(true);
    var colorRange = chart.colorRange();
    colorRange.enabled(true).colorLineSize(15);
    colorRange.enabled(true);
  } else {
    chart.tooltip().enabled(false);
    chart.contextMenu().enabled(false);
    var colorRange = chart.colorRange();
    //colorRange.enabled(true).colorLineSize(15);
    colorRange.enabled(false);
  }

  chart.container("container");
  chart.draw();

  var normalFillFunction = chart.normal().fill();
  var hoveredFillFunction = chart.hovered().fill();

  chart.listen("pointsHover", function (e) {
    if (e.actualTarget === colorRange) {
      if (e.points.length) {
        chart.normal({
          fill: "black 0.1",
        });
        chart.hovered({
          fill: chart.colorScale().valueToColor(e.point.get("category")),
        });
      } else {
        chart.normal({
          fill: normalFillFunction,
        });
        chart.hovered({
          fill: hoveredFillFunction,
        });
      }
    }
  });
}

function SepararPalavras(data) {
  for (var i = 0; i < data.length; i++) {
    phrases.push(data[i].Coligacao);
  }

  newCanva();
}

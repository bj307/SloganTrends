var allData = null;
var stopWords = [
  "de",
  "a",
  "o",
  "que",
  "e",
  "do",
  "da",
  "em",
  "um",
  "para",
  "é",
  "com",
  "não",
  "uma",
  "os",
  "no",
  "se",
  "na",
  "por",
  "mais",
  "as",
  "dos",
  "como",
  "mas",
  "foi",
  "ao",
  "ele",
  "das",
  "tem",
  "à",
  "seu",
  "sua",
  "ou",
  "ser",
  "quando",
  "muito",
  "há",
  "nos",
  "já",
  "está",
  "eu",
  "também",
  "só",
  "pelo",
  "pela",
  "até",
  "isso",
  "ela",
  "entre",
  "era",
  "depois",
  "sem",
  "mesmo",
  "aos",
  "ter",
  "seus",
  "quem",
  "nas",
  "me",
  "esse",
  "eles",
  "estão",
  "você",
  "tinha",
  "foram",
  "essa",
  "num",
  "nem",
  "suas",
  "meu",
  "às",
  "minha",
  "têm",
  "numa",
  "pelos",
  "elas",
  "havia",
  "seja",
  "qual",
  "será",
  "nós",
  "tenho",
  "lhe",
  "deles",
  "essas",
  "esses",
  "pelas",
  "este",
  "fosse",
  "dele",
  "tu",
  "te",
  "vocês",
  "vos",
  "lhes",
  "meus",
  "minhas",
  "teu",
  "tua",
  "teus",
  "tuas",
  "nosso",
  "nossa",
  "nossos",
  "nossas",
  "dela",
  "delas",
  "esta",
  "estes",
  "estas",
  "aquele",
  "aquela",
  "aqueles",
  "aquelas",
  "isto",
  "aquilo",
  "estou",
  "está",
  "estamos",
  "estão",
  "estive",
  "esteve",
  "estivemos",
  "estiveram",
  "estava",
  "estávamos",
  "estavam",
  "estivera",
  "estivéramos",
  "esteja",
  "estejamos",
  "estejam",
  "estivesse",
  "estivéssemos",
  "estivessem",
  "estiver",
  "estivermos",
  "estiverem",
  "hei",
  "há",
  "havemos",
  "hão",
  "houve",
  "houvemos",
  "houveram",
  "houvera",
  "houvéramos",
  "haja",
  "hajamos",
  "hajam",
  "houvesse",
  "houvéssemos",
  "houvessem",
  "houver",
  "houvermos",
  "houverem",
  "houverei",
  "houverá",
  "houveremos",
  "houverão",
  "houveria",
  "houveríamos",
  "houveriam",
  "sou",
  "somos",
  "são",
  "era",
  "éramos",
  "eram",
  "fui",
  "foi",
  "fomos",
  "foram",
  "fora",
  "fôramos",
  "seja",
  "sejamos",
  "sejam",
  "fosse",
  "fôssemos",
  "fossem",
  "for",
  "formos",
  "forem",
  "serei",
  "será",
  "seremos",
  "serão",
  "seria",
  "seríamos",
  "seriam",
  "tenho",
  "tem",
  "temos",
  "tém",
  "tinha",
  "tínhamos",
  "tinham",
  "tive",
  "teve",
  "tivemos",
  "tiveram",
  "tivera",
  "tivéramos",
  "tenha",
  "tenhamos",
  "tenham",
  "tivesse",
  "tivéssemos",
  "tivessem",
  "tiver",
  "tivermos",
  "tiverem",
  "terei",
  "terá",
  "teremos",
  "terão",
  "teria",
  "teríamos",
  "teriam",
  "partido",
  "isolado",
];
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

  $("#closeModalFrase").on("click", function () {
    $("#modalLstFrases").modal("toggle");
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
    var wordsTrash = phrase.split(" ");
    const words = limparPalavras(wordsTrash);
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
  if (url.includes("slogans.html") || url.includes("slogans")) {
    chart.tooltip().enabled(true);
    chart.contextMenu().enabled(false);
    var colorRange = chart.colorRange();
    colorRange.enabled(true).colorLineSize(15);
    colorRange.enabled(true);

    chart.listen("pointClick", function (e) {
      var word = e.point.get("x"); // Obtém a palavra

      BuscarTodasOcorrencias(word);
    });
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

function BuscarTodasOcorrencias(word) {
  var lstPhrasesContains = allData.filter((cdd) => {
    return cdd.Coligacao.toLowerCase().includes(word.toLowerCase());
  });

  $("#tituloModalPalavra").text("Palavra:" + word);

  MontarDadosFrases(lstPhrasesContains);
}

function limparPalavras(palavras) {
  return palavras.filter(function (palavra) {
    return !stopWords.includes(palavra.toLowerCase());
  });
}

function MontarDadosFrases(fs) {
  $("#tblFrases > tbody").html("");
  var html = "";
  for (var i = 0; i < fs.length; i++) {
    var dd = fs[i];
    html += `<tr>`;
    html += `<td>${dd.Nome}</td>`;
    html += `<td>${dd.Coligacao}</td>`;
    html += `<td>${dd.SiglaPartido}</td>`;
    html += `<td>${dd.Municipio}</td>`;
    html += `<td>${dd.UF}</td>`;
    html += `</tr>`;
  }

  $("#tblFrases > tbody").html(html);
  $("#modalLstFrases").modal("toggle");
}

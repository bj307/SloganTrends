document.addEventListener('DOMContentLoaded', function () {
    const candidatesByPartyChartCtx = document.getElementById('candidatesByPartyChart').getContext('2d');
    const candidatesByAgeChartCtx = document.getElementById('candidatesByAgeChart').getContext('2d');
    const candidatesByGenderChartCtx = document.getElementById('candidatesByGenderChart').getContext('2d');
    const candidatesByEducationChartCtx = document.getElementById('candidatesByEducationChart').getContext('2d');
    const candidatesByCivilStatusChartCtx = document.getElementById('candidatesByCivilStatusChart').getContext('2d');
    const candidatesByRegionChartCtx = document.getElementById('candidatesByRegionChart').getContext('2d');
    const topCandidates = document.getElementById('topCandidates');
    const wordCloudContainer = document.getElementById('wordCloud');

    fetch('candidatos-full.json')
        .then(response => response.json())
        .then(data => {
            // Função para criar um card para cada item no JSON
            function createCard(item) {
                const card = document.createElement('div');
                card.className = 'card m-2 p-2';
                card.style.width = '18rem';
                card.innerHTML = `
                    <h5 class="card-title">${item.NomeUrna}</h5>
                    <p class="card-text">Partido: ${item.SiglaPartido}</p>
                    <p class="card-text">Município: ${item.Municipio}</p>
                    <p class="card-text">Ocupação: ${item.Ocupacao}</p>
                    <p class="card-text">Estado: ${item.UF}</p>
                    <p class="card-text">Região: ${item.Regiao}</p>
                `;
                card.addEventListener('click', () => openModal(item));
                return card;
            }
            // Dashboard: Distribuição de Candidatos por Partido
            const candidatesByParty = data.reduce((acc, item) => {
                acc[item.SiglaPartido] = (acc[item.SiglaPartido] || 0) + 1;
                return acc;
            }, {});

            const candidatesByPartyLabels = Object.keys(candidatesByParty);
            const candidatesByPartyData = Object.values(candidatesByParty);

            new Chart(candidatesByPartyChartCtx, {
                type: 'bar',
                data: {
                    labels: candidatesByPartyLabels,
                    datasets: [{
                        label: 'Candidatos por Partido',
                        data: candidatesByPartyData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribuição de Candidatos por Partido'
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Dashboard: Distribuição de Candidatos por Faixa Etária
            const candidatesByAge = data.reduce((acc, item) => {
                acc[item.FaixaEtaria] = (acc[item.FaixaEtaria] || 0) + 1;
                return acc;
            }, {});

            const candidatesByAgeLabels = Object.keys(candidatesByAge);
            const candidatesByAgeData = Object.values(candidatesByAge);

            new Chart(candidatesByAgeChartCtx, {
                type: 'bar',
                data: {
                    labels: candidatesByAgeLabels,
                    datasets: [{
                        label: 'Candidatos por Faixa Etária',
                        data: candidatesByAgeData,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribuição de Candidatos por Faixa Etária'
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Dashboard: Distribuição de Candidatos por Gênero
            const candidatesByGender = data.reduce((acc, item) => {
                acc[item.Genero] = (acc[item.Genero] || 0) + 1;
                return acc;
            }, {});

            const candidatesByGenderLabels = Object.keys(candidatesByGender);
            const candidatesByGenderData = Object.values(candidatesByGender);

            new Chart(candidatesByGenderChartCtx, {
                type: 'pie',
                data: {
                    labels: candidatesByGenderLabels,
                    datasets: [{
                        label: 'Candidatos por Gênero',
                        data: candidatesByGenderData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribuição de Candidatos por Gênero'
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Dashboard: Distribuição de Candidatos por Grau de Instrução
            const candidatesByEducation = data.reduce((acc, item) => {
                acc[item.GrauInstrucao] = (acc[item.GrauInstrucao] || 0) + 1;
                return acc;
            }, {});

            const candidatesByEducationLabels = Object.keys(candidatesByEducation);
            const candidatesByEducationData = Object.values(candidatesByEducation);

            new Chart(candidatesByEducationChartCtx, {
                type: 'bar',
                data: {
                    labels: candidatesByEducationLabels,
                    datasets: [{
                        label: 'Candidatos por Grau de Instrução',
                        data: candidatesByEducationData,
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribuição de Candidatos por Grau de Instrução'
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Dashboard: Distribuição de Candidatos por Estado Civil
            const candidatesByCivilStatus = data.reduce((acc, item) => {
                acc[item.EstadoCivil] = (acc[item.EstadoCivil] || 0) + 1;
                return acc;
            }, {});

            const candidatesByCivilStatusLabels = Object.keys(candidatesByCivilStatus);
            const candidatesByCivilStatusData = Object.values(candidatesByCivilStatus);

            new Chart(candidatesByCivilStatusChartCtx, {
                type: 'pie',
                data: {
                    labels: candidatesByCivilStatusLabels,
                    datasets: [{
                        label: 'Candidatos por Estado Civil',
                        data: candidatesByCivilStatusData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribuição de Candidatos por Estado Civil'
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Dashboard: Distribuição de Candidatos por Região
            const candidatesByRegion = data.reduce((acc, item) => {
                acc[item.Regiao] = (acc[item.Regiao] || 0) + 1;
                return acc;
            }, {});

            const candidatesByRegionLabels = Object.keys(candidatesByRegion);
            const candidatesByRegionData = Object.values(candidatesByRegion);

            new Chart(candidatesByRegionChartCtx, {
                type: 'bar',
                data: {
                    labels: candidatesByRegionLabels,
                    datasets: [{
                        label: 'Candidatos por Região',
                        data: candidatesByRegionData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribuição de Candidatos por Região'
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 20,
                                padding: 15
                            }
                        }
                    }
                }
            });

            // Top Candidatos por Despesa Máxima
            const topCandidatesData = data.sort((a, b) => b.DespesaMaxima - a.DespesaMaxima).slice(0, 5);
            topCandidatesData.forEach(item => {
                const card = createCard(item);
                topCandidates.appendChild(card);
            });


            // Nuvem de Palavras das Coligações
            const wordFrequencies = data.reduce((acc, item) => {
                const words = item.Coligacao.split(' ');
                words.forEach(word => {
                    acc[word] = (acc[word] || 0) + 1;
                });
                return acc;
            }, {});

            const sortedWordFrequencies = Object.entries(wordFrequencies).sort((a, b) => b[1] - a[1]);
            const limitedWordCloudData = sortedWordFrequencies.slice(0, 10).map(d => ({ text: d[0], size: d[1] * 10 })); // Limitar a 10 palavras

            // Usar d3-cloud para criar a nuvem de palavras
            d3.layout.cloud()
                .size([300, 300])
                .words(limitedWordCloudData)
                .padding(5)
                .rotate(() => ~~(Math.random() * 2) * 90)
                .font("Impact")
                .fontSize(d => d.size)
                .on("end", draw)
                .start();

            function draw(words) {
                d3.select(wordCloudContainer)
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", 300)
                    .append("g")
                    .attr("transform", "translate(150,150)")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", d => d.size + "px")
                    .style("font-family", "Impact")
                    .style("fill", (d, i) => d3.schemeCategory10[i % 10])
                    .attr("text-anchor", "middle")
                    .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
                    .text(d => d.text);
            }
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
});
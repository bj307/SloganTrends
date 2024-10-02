document.addEventListener('DOMContentLoaded', function () {
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    const regionFilter = document.getElementById('regionFilter');
    const cityFilter = document.getElementById('cityFilter');
    const stateFilter = document.getElementById('stateFilter');
    const partyFilter = document.getElementById('partyFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');

    let allData = []; // Armazenará todos os dados do JSON

    fetch('candidatos-full.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            populateFilters(allData);
            filterAndDisplayResults();
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            searchResults.innerHTML = '<div class="col-12"><p class="text-danger">Falha ao carregar os dados dos candidatos. Por favor, tente novamente mais tarde.</p></div>';
        });

    // Função para criar os cartões dos candidatos
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card m-2 p-2';
        card.style.width = '18rem';
        card.innerHTML = `
            <h5 class="card-title">${item.NomeUrna}</h5>
            <p class="card-text"><strong>Partido:</strong> ${item.SiglaPartido}</p>
            <p class="card-text"><strong>Município:</strong> ${item.Municipio}</p>
            <p class="card-text"><strong>Ocupação:</strong> ${item.Ocupacao}</p>
            <p class="card-text"><strong>Estado:</strong> ${item.UF}</p>
            <p class="card-text"><strong>Região:</strong> ${item.Regiao}</p>
        `;
        card.addEventListener('click', () => openModal(item));
        return card;
    }

    // Função para abrir o modal com detalhes do candidato
    function openModal(item) {
        document.getElementById('modalNome').textContent = item.NomeUrna || 'N/A';
        document.getElementById('modalPartido').textContent = item.SiglaPartido || 'N/A';
        document.getElementById('modalMunicipio').textContent = item.Municipio || 'N/A';
        document.getElementById('modalOcupacao').textContent = item.Ocupacao || 'N/A';
        document.getElementById('modalEstado').textContent = item.UF || 'N/A';
        document.getElementById('modalRegiao').textContent = item.Regiao || 'N/A';
        document.getElementById('modalDespesaMaxima').textContent = item.DespesaMaxima || 'N/A';
        document.getElementById('modalColigacao').textContent = item.Coligacao || 'N/A';
        document.getElementById('modalGenero').textContent = item.Genero || 'N/A';
        document.getElementById('modalFaixaEtaria').textContent = item.FaixaEtaria || 'N/A';
        document.getElementById('modalEstadoCivil').textContent = item.EstadoCivil || 'N/A';
        document.getElementById('modalCor').textContent = item.Cor || 'N/A';
        document.getElementById('modalGrauInstrucao').textContent = item.GrauInstrucao || 'N/A';
        document.getElementById('modalIdentidadeGenero').textContent = item.IdentidadeGenero || 'N/A';
        document.getElementById('modalQuilombola').textContent = item.Quilombola === 'S' ? 'Sim' : 'Não';
        document.getElementById('modalReeleicao').textContent = item.Reeleicao === 'S' ? 'Sim' : 'Não';
        $('#candidateModal').modal('show');
    }

    // Função para filtrar e exibir os resultados
    function filterAndDisplayResults() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedRegion = regionFilter.value;
        const selectedState = stateFilter.value;
        const selectedCity = cityFilter.value;
        const selectedParty = partyFilter.value;

        let filteredData = allData.filter(item => {
            const matchesSearch = item.NomeUrna.toLowerCase().includes(searchTerm);
            const matchesRegion = selectedRegion === '' || item.Regiao === selectedRegion;
            const matchesState = selectedState === '' || item.UF === selectedState;
            const matchesCity = selectedCity === '' || item.Municipio === selectedCity;
            const matchesParty = selectedParty === '' || item.SiglaPartido === selectedParty;
            return matchesSearch && matchesRegion && matchesState && matchesCity && matchesParty;
        });

        searchResults.innerHTML = '';

        if (filteredData.length === 0) {
            searchResults.innerHTML = '<div class="col-12"><p class="text-warning">Nenhum candidato corresponde aos critérios de busca.</p></div>';
            return;
        }

        filteredData.forEach(item => {
            const card = createCard(item);
            searchResults.appendChild(card);
        });
    }

    // Função para popular os filtros com base nos dados
    function populateFilters(data) {
        const regions = new Set();
        const states = new Set();
        const cities = new Set();
        const parties = new Set();

        data.forEach(item => {
            regions.add(item.Regiao);
            states.add(item.UF);
            cities.add(item.Municipio);
            parties.add(item.SiglaPartido);
        });

        populateSelect(regionFilter, regions, 'Todas as Regiões');
        populateSelect(stateFilter, states, 'Todos os Estados');
        populateSelect(cityFilter, cities, 'Todas as Cidades');
        populateSelect(partyFilter, parties, 'Todos os Partidos');
    }

    // Função para popular um elemento select
    function populateSelect(selectElement, items, defaultText) {
        const fragment = document.createDocumentFragment();

        // Adiciona a opção padrão
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = defaultText;
        fragment.appendChild(defaultOption);

        // Adiciona as opções únicas e ordenadas
        Array.from(items).sort().forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            fragment.appendChild(option);
        });

        selectElement.innerHTML = '';
        selectElement.appendChild(fragment);
    }

    // Função para atualizar os filtros com base nas seleções atuais
    function updateFilters() {
        const selectedRegion = regionFilter.value;
        const selectedState = stateFilter.value;
        const selectedParty = partyFilter.value;

        let filteredData = allData;

        // Filtra por Região se selecionada
        if (selectedRegion) {
            filteredData = filteredData.filter(item => item.Regiao === selectedRegion);
        }

        // Filtra por Estado se selecionado
        if (selectedState) {
            filteredData = filteredData.filter(item => item.UF === selectedState);
        }

        // Filtra por Partido se selecionado
        if (selectedParty) {
            filteredData = filteredData.filter(item => item.SiglaPartido === selectedParty);
        }

        // Atualiza os filtros de Estado, Cidade e Região com base nos dados filtrados
        const regions = new Set();
        const states = new Set();
        const cities = new Set();
        const parties = new Set();

        filteredData.forEach(item => {
            regions.add(item.Regiao);
            states.add(item.UF);
            cities.add(item.Municipio);
            parties.add(item.SiglaPartido);
        });

        // Atualiza os filtros, preservando as seleções atuais se ainda forem válidas
        populateSelect(regionFilter, regions, 'Todas as Regiões');
        populateSelect(stateFilter, states, 'Todos os Estados');
        populateSelect(cityFilter, cities, 'Todas as Cidades');
        populateSelect(partyFilter, parties, 'Todos os Partidos');

        // Se a seleção atual ainda estiver disponível, mantê-la; caso contrário, resetar
        if (!regions.has(selectedRegion)) {
            regionFilter.value = '';
        } else {
            regionFilter.value = selectedRegion;
        }

        if (!states.has(selectedState)) {
            stateFilter.value = '';
        } else {
            stateFilter.value = selectedState;
        }

        if (!cities.has(selectedCity)) {
            cityFilter.value = '';
        } else {
            cityFilter.value = selectedCity;
        }

        if (!parties.has(selectedParty)) {
            partyFilter.value = '';
        } else {
            partyFilter.value = selectedParty;
        }
    }

    // Função de debounce para otimizar a busca
    function debounce(func, delay) {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Event Listeners
    searchInput.addEventListener('input', debounce(filterAndDisplayResults, 300));
    regionFilter.addEventListener('change', () => {
        updateFilters();
        filterAndDisplayResults();
    });
    stateFilter.addEventListener('change', () => {
        updateFilters();
        filterAndDisplayResults();
    });
    cityFilter.addEventListener('change', filterAndDisplayResults);
    partyFilter.addEventListener('change', () => {
        updateFilters();
        filterAndDisplayResults();
    });
    resetFiltersBtn.addEventListener('click', resetFilters);

    // Função para resetar todos os filtros
    function resetFilters() {
        searchInput.value = '';
        regionFilter.value = '';
        stateFilter.value = '';
        cityFilter.value = '';
        partyFilter.value = '';
        populateFilters(allData);
        filterAndDisplayResults();
    }
});
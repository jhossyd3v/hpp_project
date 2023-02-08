(function pokedex() {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const pokemonImageUrl = 'https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/';
    const pokemonSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

    let lastGotFromStoragePokemon = {};
    let lastSavedInStoragePokemon = {};
    let lastCreatedPokemon = {};
    let selectedPokemon = {};
    let pokemons = [];
    let lastGotFromStoragePokemons = [];
    let previousPokemon = {};
    let nextPokemon = {};

    let wasPokemonCreated = function (name, url, id = -1) {
        lastCreatedPokemon = {};
        createPokemon(name, url, id);
        return lastCreatedPokemon.hasOwnProperty('id');
    }
    let createPokemon = function (name, url, id = -1) {
        if (id === -1) {
            id = getIdFromUrl(url);
        }

        lastCreatedPokemon = {
            id,
            name,
            url,
            description: '',
            types: [],
            hasInfoFromApi: false,
            genera: ''
        };
    }

    let getIdFromUrl = function (url) {
        let urlAfterSplit = url.split('/');
        let idPosition = urlAfterSplit.length - 2;

        return parseInt(urlAfterSplit[idPosition])
    }

    let getStringPokemonId = function (pokemonId) {
        return `pkmn${pokemonId}`;
    }

    let existPokemonInStorage = function (pokemonId = 1) {
        lastGotFromStoragePokemon = {};
        getPokemonInStorage(pokemonId);
        return lastGotFromStoragePokemon.hasOwnProperty('id') && pokemonId === lastGotFromStoragePokemon.id;
    }

    let getPokemonInStorage = function (pokemonId = 1) {
        let stringId = getStringPokemonId(pokemonId);
        let pokemon = localStorage.getItem(stringId);
        if (pokemon === null) {
            lastGotFromStoragePokemon = {};
        } else {
            lastGotFromStoragePokemon = JSON.parse(pokemon);
        }
    }

    let wasSavedPokemonInStorage = function (pokemon = {}) {
        lastSavedInStoragePokemon = {};
        setPokemonInStorage(pokemon);
        return lastSavedInStoragePokemon.hasOwnProperty('id') && pokemon.id === lastSavedInStoragePokemon.id;
    }

    let setPokemonInStorage = function (pokemon = {}) {
        if (!pokemon.hasOwnProperty('id')) {
            lastSavedInStoragePokemon = {};
        } else {
            let stringId = getStringPokemonId(pokemon.id);
            lastSavedInStoragePokemon = pokemon;
            localStorage.setItem(stringId, JSON.stringify(pokemon));
        }
    }

    let getListOfPokemons = function (start, limit, toDraw = true) {
        return new Promise((resolve, reject) => {
            let myResponse = {
                result: false
            }
            pokemons = [];
            lastGotFromStoragePokemons = [];

            if (start > 150) {
                resolve(myResponse);
            } else {
                if ((start + limit) > 150) {
                    limit = 150 - start;
                }

                if (existRangeOfPokemonsInStorage(start, limit)) {
                    pokemons = lastGotFromStoragePokemons;
                    if (toDraw) {
                        addPokemonsOnGrid();
                    }
                    myResponse.result = true;
                    resolve(myResponse);
                } else {
                    fetch(`${apiUrl}?limit=${limit}&offset=${start}`)
                        .then(response => response.json())
                        .then(response => {
                            const { results } = response;

                            results.forEach(pkmn => {
                                if (wasPokemonCreated(pkmn.name, pkmn.url)) {
                                    if (!existPokemonInStorage(lastCreatedPokemon.id)) {
                                        if (wasSavedPokemonInStorage(lastCreatedPokemon)) {
                                            pokemons.push(lastSavedInStoragePokemon);
                                        } else {
                                            pokemons.push(lastCreatedPokemon);
                                        }
                                    } else {
                                        pokemons.push(lastGotFromStoragePokemon);
                                    }
                                }
                            })

                            if (pokemons.length > 0) {
                                myResponse.result = true;
                            }
                            if (toDraw) {
                                addPokemonsOnGrid();
                            }

                            resolve(myResponse);
                        }).catch(error => {
                            reject(error);
                        })
                }
            }
        });
    }

    let addPokemonsOnGrid = function () {
        let pokemonsContainer = document.getElementById('pokemons_container');
        let pokemonItems = '';
        pokemons.forEach(pokemon => {
            pokemonItems += getPokemonHTMLForGrid(pokemon);
        })

        pokemonsContainer.innerHTML = pokemonsContainer.innerHTML + pokemonItems;
    }

    let getPokemonHTMLForGrid = function (pokemon = {}) {
        let htmlContent = '';

        if (pokemon.hasOwnProperty('id') && pokemon.hasOwnProperty('name')) {
            htmlContent = `<a class="pokemon_item" href="./pokemon.html?id=${pokemon.id}">
                                <header class="pokemon_item__header">
                                    <span class="pokemon_item__header__id">${pokemon.id}</span>
                                    <span class="pokemon_item__header__name">${pokemon.name}</span>
                                </header>
                                <img src="${pokemonImageUrl}${pokemon.id}.svg" alt="Imagen de ${pokemon.name}" class="pokemon_item__image"></img>
                            </a>`;
        }

        return htmlContent;
    }

    let existRangeOfPokemonsInStorage = function (start, limit) {
        getListOfPokemonsFromStorage(start, limit);
        return lastGotFromStoragePokemons.length === limit;
    }

    let getListOfPokemonsFromStorage = function (start, limit) {
        let current = start + 1;
        let last = start + limit;
        lastGotFromStoragePokemons = [];

        for (; current <= last; current++) {
            if (existPokemonInStorage(current)) {
                lastGotFromStoragePokemons.push(lastGotFromStoragePokemon);
            }
        }
    }

    let getPokemonInfo = function (pokemonId = 1) {
        selectedPokemon = {};

        if (pokemonId > 150) {
            pokemonId = 150;
        } else if (pokemonId < 1) {
            pokemonId = 1;
        }

        let start = pokemonId - 2;

        if (start < 1) {
            start = 1
        }


        getListOfPokemons(start, 3, false)
            .then(response => {
                if (response.result) {
                    if (existPokemonInStorage(pokemonId)) {
                        if (lastGotFromStoragePokemon.hasInfoFromApi) {
                            selectedPokemon = lastGotFromStoragePokemon;
                            drawPokemonInfo();
                        } else {
                            fetchPokemonInfo(pokemonId)
                                .then(response => {
                                    if (response.result) {
                                        drawPokemonInfo();
                                    }
                                }).catch(error => { console.log(error) });
                        }
                    } else {
                        if (response.result) {
                            fetchPokemonInfo(pokemonId)
                                .then(response => {
                                    if (response.result) {
                                        drawPokemonInfo();
                                    }
                                }).catch(error => { console.log(error) });
                        }
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    let fetchPokemonInfo = function (pokemonId = 1) {
        return new Promise((resolve, reject) => {
            let myResponse = { result: false };
            let pokemonUrl = `${apiUrl}${pokemonId}`;

            fetch(pokemonUrl)
                .then(response => response.json())
                .then(response => {
                    const { name, types, species } = response;
                    if (wasPokemonCreated(name, pokemonUrl, pokemonId)) {
                        lastCreatedPokemon.types = getTypesArray(types);
                        lastCreatedPokemon.hasInfoFromApi = true;
                        if (wasSavedPokemonInStorage(lastCreatedPokemon)) {
                            selectedPokemon = lastSavedInStoragePokemon;
                            myResponse.result = true;
                        } else {
                            selectedPokemon = lastCreatedPokemon;
                            myResponse.result = true;
                        }
                        return fetch(species.url);
                    } else {
                        throw new Error("Pokemon couldn't be created")
                    }
                }).then(response => response.json())
                .then(response => {
                    const { flavor_text_entries, genera } = response;

                    selectedPokemon.description = getDescription(flavor_text_entries);
                    selectedPokemon.genera = getGenera(genera);
                    if (wasSavedPokemonInStorage(selectedPokemon)) {
                        myResponse.result = true;
                    }
                    resolve(myResponse);
                }).catch(error => {
                    reject(error);
                })
        });
    }

    let getTypesArray = function (types = []) {
        let typesArray = [];

        types.forEach(type => {
            typesArray.push(type.type.name);
        })

        return typesArray;
    }

    let getDescription = function (flavorTextEntries = []) {
        let description = '';

        flavorTextEntriesFiltered = flavorTextEntries.filter(textEntry => {
            return textEntry.language.name === 'en';
        })

        if (flavorTextEntriesFiltered.length > 0) {
            description = flavorTextEntriesFiltered[0].flavor_text.toString();
        }

        return description;
    }

    let getGenera = function (generas = []) {
        let genera = '';

        let generaFiltered = generas.filter(genus => {
            return genus.language.name === 'en';
        })

        if (generaFiltered.length > 0) {
            genera = generaFiltered[0].genus;
        }

        return genera;
    }

    let drawPokemonInfo = function () {
        let pokemonContainer = document.getElementById('pokemon_container');
        let previousMenuItem = document.getElementById('previous_pokemon');
        let nextMenuItem = document.getElementById('next_pokemon');

        pokemonContainer.innerHTML = getPokemonHTML();

        if (existPreviousPokemon(selectedPokemon.id)) {
            previousMenuItem.innerHTML = getNavigationPokemonHTML(previousPokemon, true);
        }

        if (existNextPokemon(selectedPokemon.id)) {
            nextMenuItem.innerHTML = getNavigationPokemonHTML(nextPokemon, false);
        }
    }

    let getPokemonHTML = function () {
        let htmlContent = '';
        let mainType = '';
        let typesSpan = '';

        if (selectedPokemon.hasOwnProperty('id')) {
            const { types, name, id, description, genera } = selectedPokemon;
            if (types.length > 0) {
                mainType = types[0];
            }

            typesSpan = types.map(type => `<span class="pokemon_container__type pokemon_container__type--${type}">${type}</span>`);
            typesSpan = typesSpan.join('');

            htmlContent = `<figure id="pokemon_container__image_container" class="pokemon_container__image_container--${mainType}">
                                <img src="${pokemonImageUrl}${id}.svg" alt="Imagen de ${name}" id="pokemon_container__image">
                            </figure>
                            <section id="pokemon_container__data">
                                <p><span id="pokemon_container__name">${id} - ${name}</span>${typesSpan}</p>
                                <p id="pokemon_container__genera">${genera}</p>
                                <p id="pokemon_container__description">${description}</p>
                            </section>`;
        }

        return htmlContent;
    }

    let getNavigationPokemonHTML = function (pokemon = {}, previous = true) {
        let htmlContent = '';
        let arrow = '< ';


        if (pokemon.hasOwnProperty('id')) {
            if (!previous) {
                arrow = ' >'
                htmlContent = `<a class="nav_menu__list__item__link" href="./pokemon.html?id=${pokemon.id}">
                                <img class="nav_menu__list__item__image" src="${pokemonSpriteUrl}${pokemon.id}.png" alt="Sprite de ${pokemon.name}">
                                <span class="nav_menu__list__item__name">${pokemon.id}<span class="nav_menu__list__item__no_mobile"> - ${pokemon.name}</span>${arrow}</span>
                            </a>`;
            } else {
                htmlContent = `<a class="nav_menu__list__item__link" href="./pokemon.html?id=${pokemon.id}">
                                <span class="nav_menu__list__item__name">${arrow}${pokemon.id}<span class="nav_menu__list__item__no_mobile"> - ${pokemon.name}</span></span>
                                <img class="nav_menu__list__item__image" src="${pokemonSpriteUrl}${pokemon.id}.png" alt="Sprite de ${pokemon.name}">
                            </a>`;
            }
        }

        return htmlContent;
    }

    let existPreviousPokemon = function (pokemonId) {
        previousPokemon = {};
        let previousPokemonId = pokemonId - 1;
        if (previousPokemonId >= 1) {
            getPreviousPokemon(previousPokemonId);
        }

        return previousPokemon.hasOwnProperty('id');
    }

    let getPreviousPokemon = function (pokemonId = 1) {
        if (existPokemonInStorage(pokemonId)) {
            previousPokemon = lastGotFromStoragePokemon;
        }
    }

    let existNextPokemon = function (pokemonId) {
        nextPokemon = {};
        let nextPokemonId = pokemonId + 1;
        if (nextPokemonId <= 150) {
            getNextPokemon(nextPokemonId);
        }

        return nextPokemon.hasOwnProperty('id');
    }

    let getNextPokemon = function (pokemonId = 1) {
        if (existPokemonInStorage(pokemonId)) {
            nextPokemon = lastGotFromStoragePokemon;
        }
    }

    if (!window.hasOwnProperty('pokedex')) {
        window.pokedex = {
            getListOfPokemons,
            getPokemonInfo
        };
    }
})()
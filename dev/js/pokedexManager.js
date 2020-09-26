(function pokedex() {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const pokemonImageUrl = 'https://pokeres.bastionbot.org/images/pokemon/';
    const pokemonSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

    let lastPokemonGotFromStorage = {};
    let lastPokemonSavedInStorage = {};
    let lastPokemonCreated = {};
    let pokemons = [];
    let lastPokemonsGotFromStorage = [];

    let pokemonCreated = function (name, url, id = -1) {
        lastPokemonCreated = {};
        createPokemon(name, url, id);
        return lastPokemonCreated.hasOwnProperty('id');
    }
    let createPokemon = function (name, url, id = -1) {
        if (id === -1) {
            id = getIdFromUrl(url);
        }

        lastPokemonCreated = {
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
        lastPokemonGotFromStorage = {};
        getPokemonInStorage(pokemonId);
        return lastPokemonGotFromStorage.hasOwnProperty('id') && pokemonId === lastPokemonGotFromStorage.id;
    }

    let getPokemonInStorage = function (pokemonId = 1) {
        let stringId = getStringPokemonId(pokemonId);
        let pokemon = localStorage.getItem(stringId);
        if (pokemon === null) {
            lastPokemonGotFromStorage = {};
        } else {
            lastPokemonGotFromStorage = JSON.parse(pokemon);
        }
    }

    let wasSavedPokemonInStorage = function (pokemon = {}) {
        lastPokemonSavedInStorage = {};
        setPokemonInStorage(pokemon);
        return lastPokemonSavedInStorage.hasOwnProperty('id') && pokemon.id === lastPokemonSavedInStorage.id;
    }

    let setPokemonInStorage = function (pokemon = {}) {
        if (!pokemon.hasOwnProperty('id')) {
            lastPokemonSavedInStorage = {};
        } else {
            let stringId = getStringPokemonId(pokemon.id);
            lastPokemonSavedInStorage = pokemon;
            localStorage.setItem(stringId, JSON.stringify(pokemon));
        }
    }

    let getListOfPokemons = function (start, limit) {
        return new Promise((resolve, reject) => {
            let myResponse = {
                result: false
            }
            pokemons = [];
            lastPokemonsGotFromStorage = [];

            if (start > 150) {
                resolve(myResponse);
            } else {
                if ((start + limit) > 150) {
                    limit = 150 - start;
                }

                if (existRangeOfPokemonsInStorage(start, limit)) {
                    pokemons = lastPokemonsGotFromStorage;
                    addPokemonsOnGrid();
                    myResponse.result = true;
                    resolve(myResponse);
                } else {
                    fetch(`${apiUrl}?limit=${limit}&offset=${start}`)
                        .then(response => response.json())
                        .then(response => {
                            const { results } = response;

                            results.forEach(pkmn => {
                                if (pokemonCreated(pkmn.name, pkmn.url)) {
                                    if (!existPokemonInStorage(lastPokemonCreated.id)) {
                                        console.log('No Existe');
                                        if (wasSavedPokemonInStorage(lastPokemonCreated)) {
                                            console.log('Guardado');
                                            pokemons.push(lastPokemonSavedInStorage);
                                        } else {
                                            console.log('Creado');
                                            pokemons.push(lastPokemonCreated);
                                        }
                                    } else {
                                        console.log('Existe')
                                        pokemons.push(lastPokemonGotFromStorage);
                                    }
                                }
                            })

                            if (pokemons.length > 0) {
                                myResponse.result = true;
                            }
                            addPokemonsOnGrid();

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

    let getPokemonHTMLForGrid = function (pokemon) {
        let htmlContent = '';

        if (pokemon.hasOwnProperty('id') && pokemon.hasOwnProperty('name')) {
            htmlContent = `<a class="pokemon_item" href="./pokemon.html?id=${pokemon.id}">
                                <header class="pokemon_item__header">
                                    <span class="pokemon_item__header__id">${pokemon.id}</span>
                                    <span class="pokemon_item__header__name">${pokemon.name}</span>
                                </header>
                                <img src="${pokemonImageUrl}${pokemon.id}.png" alt="Imagen de ${pokemon.name}" class="pokemon_item__image"></img>
                            </a>`;
        }

        return htmlContent;
    }

    let existRangeOfPokemonsInStorage = function (start, limit) {
        getListOfPokemonsFromStorage(start, limit);
        return lastPokemonsGotFromStorage.length === limit;
    }

    let getListOfPokemonsFromStorage = function (start, limit) {
        let current = start + 1;
        let last = start + limit;
        lastPokemonsGotFromStorage = [];

        for (; current <= last; current++) {
            if (existPokemonInStorage(current)) {
                lastPokemonsGotFromStorage.push(lastPokemonGotFromStorage);
            }
        }
    }

    if (!window.hasOwnProperty('pokedex')) {
        window.pokedex = {
            getListOfPokemons
        };
    }
})()
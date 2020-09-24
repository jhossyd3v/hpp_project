const apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonImageBaseUrl = 'https://pokeres.bastionbot.org/images/pokemon/';

let limit = 20;

window.onload = load;

function load() {
    getListOfPokemons(0);
}

function getListOfPokemons(start) {
    if (validateIfRangeOfPokemonsInLocalStorage(start)) {
        let pokemons = getPokemonsInLocalStorageByRange(start);
        drawPokemonsInContainer(pokemons);
    } else {
        fetch(`${apiBaseUrl}?limit=${limit}&offset=${start}`)
            .then(response => response.json())
            .then(response => {
                let pokemons = response.results;
                let pokemonsToDraw = [];
                pokemons.forEach(pokemon => {
                    let pokemonObject = new Pokemon(pokemon.name, pokemon.url);
                    let pokemonInStorage = localStorage.getItem(pokemonObject.id);
                    if (pokemonInStorage === null) {
                        localStorage.setItem(pokemonObject.id, JSON.stringify(pokemonObject));
                        pokemonsToDraw.push(pokemonObject);
                    } else {
                        pokemonsToDraw.push(JSON.parse(pokemonInStorage));
                    }
                });
                drawPokemonsInContainer(pokemonsToDraw);
            }).catch(error => {
                console.log(error);
            })
    }
}

function Pokemon(name, url, id = -1) {
    this.name = name;
    this.url = url;
    this.id = id;
    this.description = '';
    this.types = [];
    this.hasInfoFromApi = false;

    if (this.id === -1) {
        let urlAfterSplit = url.split('/');
        let idPosition = urlAfterSplit.length - 2;

        this.id = parseInt(urlAfterSplit[idPosition])
    }
}

function validateIfRangeOfPokemonsInLocalStorage(start) {
    let totalOfPokemonInStorage = 0;
    let current = start + 1;
    let last = start + limit;

    for (; current <= last; current++) {
        if (localStorage.getItem(current) !== null) {
            totalOfPokemonInStorage++;
        }
    }
    console.log({ totalOfPokemonInStorage, limit });
    return totalOfPokemonInStorage === limit;
}

function getPokemonsInLocalStorageByRange(start) {
    let pokemons = [];
    let current = start + 1;
    let last = start + limit;

    for (; current <= last; current++) {
        let pokemonItem = localStorage.getItem(current);
        if (pokemonItem !== null) {
            pokemons.push(JSON.parse(pokemonItem));
        }
    }

    return pokemons;
}

function drawPokemonsInContainer(pokemons = []) {
    try {
        let pokemonsContainer = document.getElementById('pokemons_container');
        // let pokemonsContent = '';
        pokemons.forEach(pokemon => {
            let pokemonContent = getPokemonListItemHtml(pokemon);
            if (pokemonContent !== '') {
                pokemonsContainer.innerHTML = pokemonsContainer.innerHTML + pokemonContent;
            }
        })
    } catch (error) {
        console.log(error);
    }
}

function getPokemonListItemHtml(pokemon) {
    if (pokemon.hasOwnProperty('name') && pokemon.hasOwnProperty('id')) {
        return `<a class="pokemon_item" href="./pokemon.html?id=${pokemon.id}">
                    <header class="pokemon_item__header">
                        <span class="pokemon_item__header__id">${pokemon.id}</span>
                        <span class="pokemon_item__header__name">${pokemon.name}</span>
                    </header>
                    <img src="${pokemonImageBaseUrl}${pokemon.id}.png" alt="Imagen de ${pokemon.name}" class="pokemon_item__image"></img>
                </a>`;
    }

    return '';
}
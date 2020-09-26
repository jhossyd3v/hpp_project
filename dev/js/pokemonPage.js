const apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonImageBaseUrl = 'https://pokeres.bastionbot.org/images/pokemon/';
const pokemonSpriteBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

// window.onload = load;
window.addEventListener('load', load);

function load() {
    getPokemonInfo();
}

async function getPokemonInfo() {
    let pokemonId = getParamId();
    let pokemon = localStorage.getItem(pokemonId);

    if (pokemon !== null) {
        pokemon = JSON.parse(pokemon);
        if (!pokemon.hasInfoFromApi) {
            pokemon = await fetchInfoPokemon(pokemon.id);
            console.log(pokemon);
        }
        drawPokemonInfo(pokemon);
    } else {
        pokemon = await fetchInfoPokemon(pokemonId);
        console.log({ pokemon });
        drawPokemonInfo(pokemon);
    }
}

async function fetchInfoPokemon(pokemonId) {
    try {
        let pokemon;
        let urlPokemon = `${apiBaseUrl}${pokemonId}/`

        let pokemonResponse = await fetch(urlPokemon);
        let pokemonData = await pokemonResponse.json();

        let pokemonSpeciesResponse = await fetch(pokemonData.species.url);
        let pokemonSpeciesData = await pokemonSpeciesResponse.json();

        pokemon = new Pokemon(pokemonData.name, urlPokemon, pokemonData.id);
        pokemonData.types.forEach(pokemonType => {
            pokemon.types.push(pokemonType.type.name);
        });
        if (pokemonSpeciesData.flavor_text_entries.length > 0) {
            pokemon.description = pokemonSpeciesData.flavor_text_entries[0].flavor_text.split('');
            localStorage.setItem(pokemon.id, JSON.stringify(pokemon));
        }
        if (pokemonSpeciesData.genera.length > 0) {
            let generaFiltered = pokemonSpeciesData.genera.filter(genus => {
                return genus.language.name === 'en';
            })
            pokemon.genera = '';
            if (generaFiltered.length > 0) {
                pokemon.genera = generaFiltered.genus;
            }
        }
        pokemon.hasInfoFromApi = true;
        localStorage.setItem(pokemon.id, JSON.stringify(pokemon));

        return pokemon;
    } catch (error) {
        console.log(error);
        return localStorage.getItem(pokemonId);
    }
}

function getParamId() {
    let getParams = location.search.substr(1).split('&');
    let pokemonId = 1;

    getParams.forEach(getParam => {
        let param = getParam.split('=');
        if (param[0] === 'id') {
            let temporalId = parseInt(param[1]);
            if (!isNaN(temporalId)) {
                pokemonId = temporalId;
            }
        }
    })

    return pokemonId;
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

function drawPokemonInfo(pokemon) {
    if (pokemon.hasOwnProperty('id')) {
        console.log('A')
        let pokemonContainer = document.getElementById('pokemon_container');
        let bgtype = '';
        if (pokemon.types.length > 0) {
            bgtype = `bgtype_${pokemon.types[0]}`;
        }
        let typesSpan = pokemon.types.map(pokemonType => `<span class="pokemon_container__type bgtype_${pokemonType}">${pokemonType}</span>`);
        typesSpan = typesSpan.join('');

        pokemonContainer.innerHTML = `<figure id="pokemon_container__image_container" class="${bgtype}">
                                            <img src="${pokemonImageBaseUrl}${pokemon.id}.png" alt="Imagen de ${pokemon.name}" id="pokemon_container__image">
                                        </figure>
                                        <section id="pokemon_container__data">
                                            <h3 id="pokemon_container__name">${pokemon.name}</h3>
                                            <p>${typesSpan}</p>
                                            <p id="pokemon_container__description">${pokemon.description}</p>
                                        </section>`;
        let nextPokemonId = pokemon.id + 1;
        let previousPokemonId = pokemon.id - 1;
        if (nextPokemonId <= 150) {
            let nextPokemon = JSON.parse(localStorage.getItem(nextPokemonId));
            let nextMenuItem = document.getElementById('next_pokemon');
            nextMenuItem.innerHTML = `<a class="nav_menu__list__item__link" href="./pokemon.html?id=${nextPokemonId}">
                                            <span class="nav_menu__list__item__name">${nextPokemonId} - ${nextPokemon.name}</span>
                                            <img class="nav_menu__list__item__image" src="${pokemonSpriteBaseUrl}${nextPokemonId}.png" alt="Sprite de ${nextPokemon.name}">
                                        </a>`;
        }

        if (previousPokemonId >= 1) {
            let previousPokemon = JSON.parse(localStorage.getItem(previousPokemonId));
            let previousMenuItem = document.getElementById('previous_pokemon');
            previousMenuItem.innerHTML = `<a class="nav_menu__list__item__link" href="./pokemon.html?id=${previousPokemonId}">
                                            <span  class="nav_menu__list__item__name">${previousPokemonId} - ${previousPokemon.name}</span>
                                            <img class="nav_menu__list__item__image" src="${pokemonSpriteBaseUrl}${previousPokemonId}.png" alt="Sprite de ${previousPokemon.name}">
                                        </a>`;
        }

    }
}
// window.onload = load;
window.addEventListener('load', load);

function load() {
    calculateItemsToShow();
    endlessScroll.init();
}

function calculateItemsToShow() {
    let pokemonsContainerWidth = document.getElementById('pokemons_container').clientWidth;
    let documentHeight = document.documentElement.offsetHeight;

    let rows = Math.ceil(documentHeight / 142) + 1;
    let columns = Math.floor(pokemonsContainerWidth / 172);
    let totalItemsToShow = columns * rows;
    let totalItemsToGet = columns * 3;

    endlessScroll.config(totalItemsToShow, totalItemsToGet, pokedex.getListOfPokemons);
}
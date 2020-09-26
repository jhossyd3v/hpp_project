window.addEventListener('load', load);

function load() {
    let pokemonId = getParamId();
    pokedex.getPokemonInfo(pokemonId);
}
function getParamId() {
    let getParams = location.search.substr(1).split('&');
    let hasIdParam = false;
    let pokemonId = 1;

    getParams.forEach(getParam => {
        let param = getParam.split('=');
        if (param[0] === 'id') {
            let temporalId = parseInt(param[1]);
            if (!isNaN(temporalId)) {
                pokemonId = temporalId;
                hasIdParam = true;
            }
        }
    })

    if (!hasIdParam) {
        pokemonId = Math.ceil(Math.random() * 150);
    }

    return pokemonId;
}
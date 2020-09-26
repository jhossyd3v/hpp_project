window.addEventListener('load', load);

function load() {
    let pokemonId = getParamId();
    pokedex.getPokemonInfo(pokemonId);
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
function generationI() {
    for (i = 0; i <= 151; i++) {
        const jsonPokemon = jsonPokemons[i];
        const jsonEspece = jsonEspeces[i];
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");
        const imagePokemon = document.createElement("img");
        imagePokemon.src = jsonPokemon.sprites.front_default
        const nomPokemon = document.createElement("p");
        for (let i = 0; i < jsonEspece.names.length; i++) {
            if (jsonEspece.names[i].language.name == "fr") {
                nomPokemon.innerText = jsonEspece.names[i].name
            }
        }
        divLePokemon.append(imagePokemon, nomPokemon);
        divPokedex.append(divLePokemon);
    }
}
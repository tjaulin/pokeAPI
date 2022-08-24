//TODO 905 pokémons en tout dans l'API

//TODO Boucler sur le nom de pokémon pour mettre en francais (en général c le 4 mais des fois c le 5)
//TODO exemple le pokemon numéro 762
 
window.onload = init;
let navbar = [];

function init() {
    /*  Navbar - On rempli le tableau de navbar */
    navAccueil = document.querySelector(".navAccueil");
    navPokedex = document.querySelector(".navPokedex");
    navGenerations = document.querySelector(".navGenerations");
    navPokeRandom = document.querySelector(".navPokeRandom");
    navbar.push(navAccueil, navPokedex, navGenerations, navPokeRandom); 

    main = document.querySelector(".main");
    content = document.querySelector(".content");
    divAllPokemon = document.querySelector(".allPokemon");
    pokedex = document.querySelector(".pokedex");
    divPresentation = document.querySelector(".divPresentation");
    title = document.querySelector(".title");
    aleaPokemon();
}

async function aleaPokemon() {
    for (i = 0 ; i < 5; i++) {
        //Création d'un nombre aléatoire en fonction du nombre total de pokémon (+ 1 a la fin pour éviter le 0)
        const nbAleaPokemon = Math.floor(Math.random() * 905) + 1;

        let initPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${nbAleaPokemon}`);
        let pokeJson = await initPokemon.json();

        let initEspece = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nbAleaPokemon}`)
        let especeJson = await initEspece.json();
        const linkPokepedia = document.createElement("a");
        linkPokepedia.classList.add("linkLePokemon");
        linkPokepedia.href = `https://www.pokepedia.fr/${especeJson.names[4].name}`;
        linkPokepedia.target = "_blank";
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");
        const imagePokemon = document.createElement("img");
        imagePokemon.src = pokeJson.sprites.front_default
        const nomPokemon = document.createElement("p");
        nomPokemon.innerText = especeJson.names[4].name
        linkPokepedia.append(imagePokemon, nomPokemon);
        divLePokemon.append(linkPokepedia);
        divAllPokemon.append(divLePokemon);
    }
}
 
async function pokeAPI() {
    /*  Navbar - On supprime la classe "active" et on la remet au bonne endroit */
    navbar.forEach(item => {
        if (item.classList.contains("active")) {
            item.classList.remove("active");
        }
        if (item.classList.contains("navPokedex")) {
            item.classList.add("active");
        }
    });

    /* On remplace le titre et on supprime certains éléments du DOM */
    content.remove();
    divPresentation.remove();
    title.innerText = "Pokedex";

    let initPokeApi = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=915`);
    // console.log("Initialisation de l'api : ");
    // console.log(initPokeApi);
    let pokeJson = await initPokeApi.json();
    console.log("pokeJson : ");
    console.log(pokeJson);
    let listPokemons = await pokeJson.results
    console.log("listPokemons : ");
    console.log(listPokemons);

    const arrayPromisesPokemons = [];
    listPokemons.forEach(objListe=>{
        const promisePokemon = fetch(objListe.url);
        arrayPromisesPokemons.push(promisePokemon);
    });
    console.log('arrayPromisesPokemons :');
    console.log(arrayPromisesPokemons);

    const resPokemons = await Promise.all(arrayPromisesPokemons);
    console.log('resPokemons :');
    console.log(resPokemons);

    const arrayPromisesJsonPokemons = [];
    resPokemons.forEach(resPokemon=>{
        arrayPromisesJsonPokemons.push(resPokemon.json());
    });
    const jsonPokemons = await Promise.all(arrayPromisesJsonPokemons);

    console.log("jsonPokemons :")
    console.log(jsonPokemons)

    const arrayPromisesEspeces = [];
    jsonPokemons.forEach(jsonPokemon=>{
        arrayPromisesEspeces.push(fetch(jsonPokemon.species.url));
    });
    const resEspeces = await Promise.all(arrayPromisesEspeces);

    const arrayPromisesJsonEspeces = [];
    resEspeces.forEach(resEspece=>{
        arrayPromisesJsonEspeces.push(resEspece.json());
    });

    const jsonEspeces = await Promise.all(arrayPromisesJsonEspeces);
    console.log("jsonEspeces :");
    console.log(jsonEspeces);

    const divPokedex = document.createElement("div");
    divPokedex.classList.add("pokedex");

    for (let i = 0; i < listPokemons.length; i++) {
        const jsonPokemon = jsonPokemons[i];
        const jsonEspece = jsonEspeces[i];
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");
        const imagePokemon = document.createElement("img");
        imagePokemon.src = jsonPokemon.sprites.front_default
        const nomPokemon = document.createElement("p");

        const divNewGeneration = document.createElement("div");
        divNewGeneration.classList.add("generationSeparator");
        const titleNewGeneraton = document.createElement("p")
        titleNewGeneraton.classList.add("titleGenerationSeparator")
        const hrNewGeneration = document.createElement("hr");
        switch (i) {
            case 0 :
                titleNewGeneraton.innerText = "1ère génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 151 :
                titleNewGeneraton.innerText = "2ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 251 :
                titleNewGeneraton.innerText = "3ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 386 :
                titleNewGeneraton.innerText = "4ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 493 :
                titleNewGeneraton.innerText = "5ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 649 :
                titleNewGeneraton.innerText = "6ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 721 :
                titleNewGeneraton.innerText = "7ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 809 :
                titleNewGeneraton.innerText = "8ème génération"
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
        }

        for (let i = 0; i < jsonEspece.names.length; i++) {
            if (jsonEspece.names[i].language.name == "fr") {
                nomPokemon.innerText = jsonEspece.names[i].name
            }
        }
        divLePokemon.append(imagePokemon, nomPokemon);
        divPokedex.append(divLePokemon);
    }
    main.append(divPokedex);

}

//TODO Voir la fonction telechargerDonneesPokemons() dans le projet de ronan sur le fichier DAO.js
//TODO Son repo : https://bitbucket.org/setsunadilandau/tp-pokedex-supvinci/src/main/

async function changeUserApi() {

    let initPokeApi = await fetch(`https://pokeapi.co/api/v2/`);
    // console.log("Initialisation de l'api : ");
    // console.log(initPokeApi);
    let resultatInitPokeApiIntoJson = await initPokeApi.json();

    let selectApi = document.getElementById("pokemon");
    let userChoiceApi = selectApi.value;
    console.log("userChoiceApi :");
    console.log(userChoiceApi);

    switch (userChoiceApi) {
        case ('ability'):
            userChoiceApi = resultatInitPokeApiIntoJson.ability;
            break;

        case ('pokemon'):
            userChoiceApi = resultatInitPokeApiIntoJson.pokemon;
            break;

        default :
            userChoiceApi = "";
            break;
    }
    console.log("userChoiceApi :");
    console.log(userChoiceApi);

    let requestUserApi = await fetch(`${userChoiceApi}`);
    console.log("requestUserApi :");
    console.log(requestUserApi);
    let requestToJson = await requestUserApi.json();
    console.log("requestToJson :");
    console.log(requestToJson);
}
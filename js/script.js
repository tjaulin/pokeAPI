//TODO 905 pokémons en tout dans l'API

//TODO Boucler sur le nom de pokémon pour mettre en francais (en général c le 4 mais des fois c le 5)
//TODO exemple le pokemon numéro 762
//TODO Voir la fonction telechargerDonneesPokemons() dans le projet de ronan sur le fichier DAO.js
//TODO Son repo : https://bitbucket.org/setsunadilandau/tp-pokedex-supvinci/src/main/

//TODO https://developer.mozilla.org/fr/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage

window.onload = init;
let navbar = [];

function init(bool) {    
    /*  Navbar - On rempli le tableau de navbar */
    navAccueil = document.querySelector(".navAccueil");
    navPokedex = document.querySelector(".navPokedex");
    navGenerations = document.querySelector(".navGenerations");
    navPokeRandom = document.querySelector(".navPokeRandom");
    navbar.push(navAccueil, navPokedex, navGenerations, navPokeRandom); 
    
    divPokedex = document.createElement("div");
    divPokedex.classList.add("pokedex");
    divContentSheetPokemon = document.createElement("div");
    divContentSheetPokemon.classList.add("contentSheetPokemon");
    main = document.querySelector(".main");
    content = document.querySelector(".content");
    divAllPokemon = document.querySelector(".allPokemon");
    divPresentation = document.querySelector(".divPresentation");
    title = document.querySelector(".title");
    if (bool == true) {
        showPokedex();
    } else {
        aleaPokemon();
    }
    whatGeneration;
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

async function showPokedex() {
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
    if (content) {
        content.remove();
    }
    if (divPresentation) {
        divPresentation.remove();
    }
    if (divContentSheetPokemon) {
        divContentSheetPokemon.remove();
    }

    title.innerText = "Pokedex";

    let initPokeApi = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=905`);
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

    for (let i = 0; i < listPokemons.length; i++) {
        const jsonPokemon = jsonPokemons[i];
        const jsonEspece = jsonEspeces[i];
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");        
        divLePokemon.addEventListener("click", pokemonSheet.bind(null, jsonPokemon, jsonEspece));
        // https://askcodez.com/comment-passer-des-arguments-a-la-methode-addeventlistener-de-la-fonction-decouteur.html
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

async function pokemonSheet(jsonPokemon, jsonEspece) {

    divContentSheetPokemon.remove();

    /* Création du bouton retour */
    const btnRetour = document.createElement("div");
    btnRetour.classList.add("btnRetour");
    btnRetour.innerText = "Retour";
    btnRetour.setAttribute('onclick', `returnPokedex(${true})`);

    divPokedex.remove();
    for (let i = 0; i < jsonEspece.names.length; i++) {
        if (jsonEspece.names[i].language.name == "fr") {
            title.innerText = jsonEspece.names[i].name
        }
    }
    console.log(jsonPokemon);
    console.log(jsonEspece);
    // Description du pokedex du pokemon selon les différents jeux
    const divDescPokedex = document.createElement("div");
    divDescPokedex.classList.add("divDescPokedex");
    for (let i = 0; i < jsonEspece.flavor_text_entries.length; i++) {
        const versionJeu = jsonEspece.flavor_text_entries[i].version.name;
        if (jsonEspece.flavor_text_entries[i].language.name == "fr") {
            const titleDescPokedex = document.createElement("h5");
            const pDescPokedex = document.createElement("p");
            switch (versionJeu) {
                case ("black", "white"):
                    titleDescPokedex.innerText = "Pokemon Noir & Blanc";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;
                case ("x"):
                    titleDescPokedex.innerText = "Pokemon X";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;

                case ("y"):
                    titleDescPokedex.innerText = "Pokemon Y";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;

                case ("omega-ruby", "alpha-sapphire"):
                    titleDescPokedex.innerText = "Pokemon Rubis Oméga & Saphir Alpha";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;

                case ("lets-go-pikachu", "lets-go-eevee"):
                    titleDescPokedex.innerText = "Pokemon Let's go, Pikachu & Let's go, Évoli";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;

                case ("sword"):
                    titleDescPokedex.innerText = "Pokemon Épée";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;

                case ("shield"):
                    titleDescPokedex.innerText = "Pokemon Bouclier";
                    pDescPokedex.innerHTML = jsonEspece.flavor_text_entries[i].flavor_text;
                    divDescPokedex.append(titleDescPokedex, pDescPokedex);
                    break;
            }
        }
    }

    //Poids du pokemon
    const poidsPokemon = document.createElement("p");
    poidsPokemon.innerText = `${jsonPokemon.weight}kg`;

    divContentSheetPokemon.append(btnRetour, divDescPokedex, poidsPokemon);
    main.append(divContentSheetPokemon);

}

function returnPokedex(bool) {
    if (bool == true) {
        divContentSheetPokemon.remove();
        init(true);
    }
}

async function whatGeneration(generation) {
    let pokemonIdDepart = 0;
    let pokemonIdArrivee = 0;

    navbar.forEach(item => {
        if (item.classList.contains("active")) {
            item.classList.remove("active");
        }
        if (item.classList.contains("navGenerations")) {
            item.classList.add("active");
        }
    });

    let initPokeApi = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=905`);
    let pokeJson = await initPokeApi.json();
    let listPokemons = await pokeJson.results
    const arrayPromisesPokemons = [];
    listPokemons.forEach(objListe=>{
        const promisePokemon = fetch(objListe.url);
        arrayPromisesPokemons.push(promisePokemon);
    });

    const resPokemons = await Promise.all(arrayPromisesPokemons);

    const arrayPromisesJsonPokemons = [];
    resPokemons.forEach(resPokemon=>{
        arrayPromisesJsonPokemons.push(resPokemon.json());
    });
    const jsonPokemons = await Promise.all(arrayPromisesJsonPokemons);

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
    console.log(jsonEspeces)

    /* On remplace le titre et on supprime certains éléments du DOM */
    content.remove();
    divPresentation.remove();

    divPokedex.innerHTML = '';

    switch (generation) {
        case 1 :
            title.innerText = "Génération 1";
            pokemonIdDepart = 0;
            pokemonIdArrivee = 151;
            break;
        case 2 :
            title.innerText = "Génération 2";
            pokemonIdDepart = 151;
            pokemonIdArrivee = 251;
            break;
        case 3 :
            title.innerText = "Génération 3";
            pokemonIdDepart = 251;
            pokemonIdArrivee = 386;
            break;
        case 4 :
            title.innerText = "Génération 4";
            pokemonIdDepart = 386;
            pokemonIdArrivee = 493;
            break;
        case 5 :
            title.innerText = "Génération 5";
            pokemonIdDepart = 493;
            pokemonIdArrivee = 649;
            break;
        case 6 :
            title.innerText = "Génération 6";
            pokemonIdDepart = 649;
            pokemonIdArrivee = 721;
            break;
        case 7 :
            title.innerText = "Génération 7";
            pokemonIdDepart = 721;
            pokemonIdArrivee = 809;
            break;
        case 8 :
            title.innerText = "Génération 8";
            pokemonIdDepart = 809;
            pokemonIdArrivee = 905;
            break;
    }

    for (let i = pokemonIdDepart; i < pokemonIdArrivee; i++) {
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
    main.append(divPokedex);
}

//TODO 905 pokémons en tout dans l'API

//TODO Boucler sur le nom de pokémon pour mettre en francais (en général c le 4 mais des fois c le 5)
//TODO exemple le pokemon numéro 762
//TODO Voir la fonction telechargerDonneesPokemons() dans le projet de ronan sur le fichier DAO.js
//TODO Son repo : https://bitbucket.org/setsunadilandau/tp-pokedex-supvinci/src/main/

//TODO https://developer.mozilla.org/fr/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage

//TODO Check la vidéo
//TODO https://www.youtube.com/watch?v=cNmn72kiZWU
//TODO Le Repo : https://github.com/arslanah99/Pokedex-Tutorial
//TODO https://www.youtube.com/watch?v=Iz5iNOMCIjY
//TODO Le Repo : https://github.com/Kirti-salunkhe/PokemonApp

//TODO Rechercher dans le pokedex
//TODO https://fr.acervolima.com/barre-de-recherche-utilisant-html-css-et-javascript/

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
    sectionPage = document.querySelector(".sectionPage");
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
        //TODO:  Régler ce bug
        let initPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${nbAleaPokemon}`);
        let pokeJson = await initPokemon.json();

        let initEspece = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nbAleaPokemon}`);
        let especeJson = await initEspece.json();
        const linkPokepedia = document.createElement("a");
        linkPokepedia.classList.add("linkLePokemon");
        // for (let i = 0; i < especeJson.names.length; i++) {
        //     if (especeJson.names[i].language.name == "fr") {
        //         linkPokepedia.href = `https://www.pokepedia.fr/${especeJson.names[i].name}`;
        //     } else {
        //         linkPokepedia.href = `https://www.pokepedia.fr/${especeJson.name}`;
        //     }
        // }
        linkPokepedia.target = "_blank";
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");
        const imagePokemon = document.createElement("img");
        imagePokemon.src = pokeJson.sprites.other.home.front_default
        const nomPokemon = document.createElement("p");
        for (let i = 0; i < especeJson.names.length; i++) {
            if (especeJson.names[i].language.name == "fr") {
                nomPokemon.innerText = especeJson.names[i].name;
                linkPokepedia.href = `https://www.pokepedia.fr/${especeJson.names[i].name}`;
            }
        }
        linkPokepedia.append(imagePokemon, nomPokemon);
        divLePokemon.append(linkPokepedia);
        divAllPokemon.append(divLePokemon);
    }
}

async function showPokedex() {
    
    title.innerText = "Pokedex";
    sectionPage.innerHTML = "";
    afficherLoader();

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

    const divRechercherPokemon = document.createElement("div");
    divRechercherPokemon.classList.add("rechercherPokemon");
    divRechercherPokemon.innerHTML = `
    <div class="divInputRechercherPokemon">
        <input type="text" onkeyup="rechercherPokemon()" id="maRecherchePokemon" name="search"
            placeholder="Rechercher un pokemon…" autocomplete="off"
            aria-label="Rechercher un pokemon parmi le contenu du site"/>
    </div>
    `
    
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
    
    sectionPage.innerHTML = "";
    for (let i = 0; i < listPokemons.length; i++) {
        const jsonPokemon = jsonPokemons[i];
        const jsonEspece = jsonEspeces[i];
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");
        //Ici on ajoute une classe a la div permettant de savoir dans quel génération le pokemon est
        let generationPokemon = jsonEspece.generation.name;
        divLePokemon.classList.add(`${generationPokemon}`);
        divLePokemon.addEventListener("click", pokemonSheet.bind(null, jsonPokemon, jsonEspece, "pokedex"));
        // https://askcodez.com/comment-passer-des-arguments-a-la-methode-addeventlistener-de-la-fonction-decouteur.html
        const imagePokemon = document.createElement("img");
        imagePokemon.src = jsonPokemon.sprites.other.home.front_default
        const nomPokemon = document.createElement("p");
        nomPokemon.classList.add("pLePokemon");
        const divNewGeneration = document.createElement("div");
        divNewGeneration.classList.add("generationSeparator");
        const iconeGeneration = document.createElement("i");
        iconeGeneration.classList.add("fa-solid", "fa-chevron-down");
        divNewGeneration.append(iconeGeneration);
        const titleNewGeneraton = document.createElement("p")
        titleNewGeneraton.classList.add("titleGenerationSeparator")
        const hrNewGeneration = document.createElement("hr");
        switch (i) {
            case 0 :
                titleNewGeneraton.innerText = "1ère génération"
                iconeGeneration.classList.add("icone_generation_1");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 151 :
                titleNewGeneraton.innerText = "2ème génération"
                iconeGeneration.classList.add("icone_generation_2");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 251 :
                titleNewGeneraton.innerText = "3ème génération"
                iconeGeneration.classList.add("icone_generation_3");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 386 :
                titleNewGeneraton.innerText = "4ème génération"
                iconeGeneration.classList.add("icone_generation_4");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 493 :
                titleNewGeneraton.innerText = "5ème génération"
                iconeGeneration.classList.add("icone_generation_5");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 649 :
                titleNewGeneraton.innerText = "6ème génération"
                iconeGeneration.classList.add("icone_generation_6");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 721 :
                titleNewGeneraton.innerText = "7ème génération"
                iconeGeneration.classList.add("icone_generation_7");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
            case 809 :
                titleNewGeneraton.innerText = "8ème génération"
                iconeGeneration.classList.add("icone_generation_8");
                divNewGeneration.append(titleNewGeneraton, hrNewGeneration);
                divPokedex.append(divNewGeneration);
                break;
        }

        //réduit les pokemon de la génération "séléctionner"
        iconeGeneration.addEventListener("click", ()=>{
            iconeGeneration.classList.toggle("fa-chevron-right");
            iconeGeneration.classList.toggle("fa-chevron-down");
            let generationNumber = iconeGeneration.classList.value
            let pokemonGeneration1 = document.getElementsByClassName("generation-i");
            let pokemonGeneration2 = document.getElementsByClassName("generation-ii");
            let pokemonGeneration3 = document.getElementsByClassName("generation-iii");
            let pokemonGeneration4 = document.getElementsByClassName("generation-iv");
            let pokemonGeneration5 = document.getElementsByClassName("generation-v");
            let pokemonGeneration6 = document.getElementsByClassName("generation-vi");
            let pokemonGeneration7 = document.getElementsByClassName("generation-vii");
            let pokemonGeneration8 = document.getElementsByClassName("generation-viii");
            
            if (iconeGeneration.classList.contains("fa-chevron-right")) {
                switch (generationNumber) {
                    case 'fa-solid icone_generation_1 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration1.length; i++) { 
                            pokemonGeneration1[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_2 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration2.length; i++) { 
                            pokemonGeneration2[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_3 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration3.length; i++) { 
                            pokemonGeneration3[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_4 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration4.length; i++) { 
                            pokemonGeneration4[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_5 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration5.length; i++) { 
                            pokemonGeneration5[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_6 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration6.length; i++) { 
                            pokemonGeneration6[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_7 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration7.length; i++) { 
                            pokemonGeneration7[i].style.display="none";
                        }
                        break;
                    case 'fa-solid icone_generation_8 fa-chevron-right':
                        for (i = 0; i < pokemonGeneration8.length; i++) { 
                            pokemonGeneration8[i].style.display="none";
                        }
                        break;
                }
            } else {
                switch (generationNumber) {
                    case 'fa-solid icone_generation_1 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration1.length; i++) { 
                            pokemonGeneration1[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_2 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration2.length; i++) { 
                            pokemonGeneration2[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_3 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration3.length; i++) { 
                            pokemonGeneration3[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_4 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration4.length; i++) { 
                            pokemonGeneration4[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_5 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration5.length; i++) { 
                            pokemonGeneration5[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_6 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration6.length; i++) { 
                            pokemonGeneration6[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_7 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration7.length; i++) { 
                            pokemonGeneration7[i].style.display="flex";
                        }
                        break;
                    case 'fa-solid icone_generation_8 fa-chevron-down':
                        for (i = 0; i < pokemonGeneration8.length; i++) { 
                            pokemonGeneration8[i].style.display="flex";
                        }
                        break;
                }
            }
        });
        
        for (let i = 0; i < jsonEspece.names.length; i++) {
            if (jsonEspece.names[i].language.name == "fr") {
                nomPokemon.innerText = jsonEspece.names[i].name
            }
        }
        divLePokemon.append(imagePokemon, nomPokemon);
        divPokedex.append(divLePokemon);
    }
    sectionPage.append(divRechercherPokemon, divPokedex);
}

async function pokemonSheet(jsonPokemon, jsonEspece, where = null, generation) {
    
    divContentSheetPokemon.remove();
    sectionPage.innerHTML = "";

    /* Création du bouton retour */
    const btnRetour = document.createElement("div");
    btnRetour.classList.add("btnRetour");
    btnRetour.innerText = "Retour";
    if (where == "pokedex") {
        btnRetour.setAttribute('onclick', `returnPokedex(${true})`);
    }

    if (where == "generationSelections") {
        btnRetour.setAttribute('onclick', `whatGeneration(${generation})`);
    }
    
    divPokedex.remove();
    let numPokedexNational = 0;
    for(let i = 0; i < jsonEspece.pokedex_numbers.length; i++) {
        if (jsonEspece.pokedex_numbers[i].pokedex.name == "national") {
            numPokedexNational = jsonEspece.pokedex_numbers[i].entry_number;
        }
    }
    let numBeforeNumPokedexNational = "";
    if (numPokedexNational < 10) {
        numBeforeNumPokedexNational = "00";
    } else if (numPokedexNational >= 10 && numPokedexNational < 99){
        numBeforeNumPokedexNational = "0";
    }

    for (let i = 0; i < jsonEspece.names.length; i++) {
        if (jsonEspece.names[i].language.name == "fr") {
            title.innerHTML = `
            ${jsonEspece.names[i].name}
            <span class="numPokedexNational">#${numBeforeNumPokedexNational}${numPokedexNational}</span>
            `
        }
    }

    //Sous titre (Nom du pokemon en anglais)
    titleNameENPokemon = document.createElement("h2");
    titleNameENPokemon.classList.add("titleNameENPokemon");
    titleNameENPokemon.innerText = jsonPokemon.name;

    console.log(jsonPokemon);
    console.log(jsonEspece);

    const divFlexDetailsPokemon = document.createElement("div");
    divFlexDetailsPokemon.classList.add("d-flex", "justify-content-between");

    //Détails des pokemon
    const divDetailsPokemon = document.createElement("div")
    divDetailsPokemon.classList.add("detailsPokemon");

    //Poids du pokemon
    const poidsPokemon = document.createElement("p");
    let conversionPoidsEnKg = jsonPokemon.weight/10.0
    poidsPokemon.innerText = `${conversionPoidsEnKg}kg`;

    //Type du pokemon
    const arrayPromisesTypesPokemons = [];
    jsonPokemon.types.forEach(unType=>{
        const promisePokemon = fetch(unType.type.url);
        arrayPromisesTypesPokemons.push(promisePokemon);
    });
    const resultatsTypesPokemon = await Promise.all(arrayPromisesTypesPokemons);
    const arrayPromisesJsonTypesPokemon = [];
    resultatsTypesPokemon.forEach(unType=>{
        arrayPromisesJsonTypesPokemon.push(unType.json());
    });
    const jsonTypesPokemon = await Promise.all(arrayPromisesJsonTypesPokemon);
    console.log("jsonTypesPokemon :");
    console.log(jsonTypesPokemon);

    const divTypesPokemon = document.createElement("div");
    divTypesPokemon.classList.add("typesPokemon");
    const titleTypePokemon = document.createElement("h5");
    if(jsonTypesPokemon.length > 1) {
        titleTypePokemon.innerText = "Types :";
    } else {
        titleTypePokemon.innerText = "Type :";
    }
    const divTypes = document.createElement("div");
    divTypes.classList.add("d-flex");
    for (let i = 0; i < jsonTypesPokemon.length; i++) {
        const jsonTypePokemon = jsonTypesPokemon[i];
        for(let i = 0; i < jsonTypePokemon.names.length; i++) {
            if(jsonTypePokemon.names[i].language.name == "fr") {
                const pType = document.createElement("p");
                pType.classList.add("type");
                pType.innerText = jsonTypePokemon.names[i].name;
                colorTypesPokemon(pType, jsonTypePokemon.names[i].name);
                divTypes.append(pType);
            }
        }
    }
    divTypesPokemon.append(titleTypePokemon, divTypes);

    //Image du pokemon
    const imagePokemon = document.createElement("img");
    imagePokemon.src = jsonPokemon.sprites.other.home.front_default

    // Description du pokedex du pokemon selon les différents jeux
    const divDescPokedex = document.createElement("div");
    divDescPokedex.classList.add("divDescPokedex");
    const titleDescPokedex = document.createElement("h2");
    titleDescPokedex.innerText = "Description pokedex";
    divDescPokedex.append(titleDescPokedex);
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

    divDetailsPokemon.append(imagePokemon, divTypesPokemon, poidsPokemon);
    divFlexDetailsPokemon.append(divDetailsPokemon, divDescPokedex);
    divContentSheetPokemon.append(btnRetour, divFlexDetailsPokemon);
    sectionPage.append(titleNameENPokemon, divContentSheetPokemon);
}

async function colorTypesPokemon(pType, typePokemon) {
    switch (typePokemon) {
        default :
            pType.classList.add("background-color-normal");
            break;
        case 'Normal':
            pType.classList.add("background-color-normal");
            break;
        case 'Combat':
            pType.classList.add("background-color-combat");
            break;
        case 'Vol':
            pType.classList.add("background-color-vol");
            break;
        case 'Poison':
            pType.classList.add("background-color-poison");
            break;
        case 'Sol':
            pType.classList.add("background-color-sol");
            break;
        case 'Roche':
            pType.classList.add("background-color-roche");
            break;
        case 'Insecte':
            pType.classList.add("background-color-insecte");
            break;
        case 'Spectre':
            pType.classList.add("background-color-spectre");
            break;
        case 'Acier':
            pType.classList.add("background-color-acier");
            break;
        case 'Feu':
            pType.classList.add("background-color-feu");
            break;
        case 'Eau':
            pType.classList.add("background-color-eau");
            break;
        case 'Plante':
            pType.classList.add("background-color-plante");
            break;
        case 'Electrik':
            pType.classList.add("background-color-electrik");
            break;
        case 'Psy':
            pType.classList.add("background-color-psy");
            break;
        case 'Glace':
            pType.classList.add("background-color-glace");
            break;
        case 'Dragon':
            pType.classList.add("background-color-dragon");
            break;
        case 'Ténèbres':
            pType.classList.add("background-color-tenebre");
            break;
        case 'Fée':
            pType.classList.add("background-color-fee");
            break;
    }
}

function returnPokedex(bool) {
    if (bool == true) {
        if(divContentSheetPokemon) {
            divContentSheetPokemon.remove();
        }
        init(true);
    }
}

async function whatGeneration(generation) {
    let pokemonIdDepart = 0;
    let pokemonIdArrivee = 0;

    sectionPage.innerHTML = "";
    title.innerText = "";
    afficherLoader();
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
    if (content) {
        content.remove();
    }
    if (divPresentation) {
        divPresentation.remove();
    }

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

    sectionPage.innerHTML = "";

    for (let i = pokemonIdDepart; i < pokemonIdArrivee; i++) {
        const jsonPokemon = jsonPokemons[i];
        const jsonEspece = jsonEspeces[i];
        const divLePokemon = document.createElement("div");
        divLePokemon.classList.add("lePokemon");
        divLePokemon.addEventListener("click", pokemonSheet.bind(null, jsonPokemon, jsonEspece, "generationSelections", generation));
        const imagePokemon = document.createElement("img");
        imagePokemon.src = jsonPokemon.sprites.other.home.front_default
        const nomPokemon = document.createElement("p");
        for (let i = 0; i < jsonEspece.names.length; i++) {
            if (jsonEspece.names[i].language.name == "fr") {
                nomPokemon.innerText = jsonEspece.names[i].name
            }
        }
        divLePokemon.append(imagePokemon, nomPokemon);
        divPokedex.append(divLePokemon);
    }
    sectionPage.append(divPokedex);
}

function afficherLoader() {
    sectionPage.innerHTML = "";

    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.innerHTML = `
        <h2>Loading...</h2>
    `;
    sectionPage.append(loader);

    const loaderPoint = document.createElement("div");
    loaderPoint.classList.add("loaderPoint");
    loaderPoint.innerHTML = `
        <div class="point" style="--i:0;"></div>
        <div class="point" style="--i:1;"></div>
        <div class="point" style="--i:2;"></div>
        <div class="point" style="--i:3;"></div>
        <div class="point" style="--i:4;"></div>
        <div class="point" style="--i:5;"></div>
        <div class="point" style="--i:6;"></div>
        <div class="point" style="--i:7;"></div>
        <div class="point" style="--i:8;"></div>
        <div class="point" style="--i:9;"></div>
    `;
    loader.append(loaderPoint);
}


function rechercherPokemon() {
    let valeurRecherche = document.getElementById('maRecherchePokemon').value
    valeurRecherche = valeurRecherche.toLowerCase();
    let namesPokemon = document.getElementsByClassName('pLePokemon');
    let lePokemon = document.getElementsByClassName("lePokemon");

    for (i = 0; i < namesPokemon.length; i++) { 
        if (!namesPokemon[i].innerHTML.toLowerCase().includes(valeurRecherche)) {
            lePokemon[i].style.display="none";
        }
        else {
            lePokemon[i].style.display="flex";                 
        }
    }
}
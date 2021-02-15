class AbsNav extends Abs {
    constructor() {
        super();
        //Variable pour savoir quelle page est la page actuelle
        this.PAGE = "INITIALISATION";
        this.choixPage(this.PAGE);
    }

    init(){
    }

    getMessage(message, pieceJointe){
        //console.log("Abs Nav recoit : "+message);
        let result = "";
        if (message === MESSAGE.INIT){
            this.init();
        }
        else if (message === MESSAGE.CHANGEPAGE){
            this.choixPage(pieceJointe);
        }
        else {
            // Cette ligne ? Crée une erreur pendant debug
            result = super.recoitMessage(message, pieceJointe);
        }
        return result;
    }

    // Permet d'afficher la page qui doit l'être
    choixPage(message){
        switch (message){
            case MESSAGE.INIT ://Même chose que accueil
            case MESSAGE.ACCUEIL:
                // On envoie un message à la classe Accueil pour qu'elle charge sa page
                this.ctrl.getMessageFromAbstraction(MESSAGE.CHANGEPAGE, MESSAGE.ACCUEIL);
                this.PAGE = "ACCUEIL";
                // On highlight l'onglet qui a été cliqué
                this.ctrl.getMessageFromAbstraction(MESSAGE.HIGHLIGHT, "Accueil");
                break;
            case MESSAGE.INIT2048:
                this.ctrl.getMessageFromAbstraction(MESSAGE.CHANGEPAGE, MESSAGE.INIT2048);
                this.PAGE = "2048";
                this.ctrl.getMessageFromAbstraction(MESSAGE.HIGHLIGHT, "2048");
                break;
            case MESSAGE.DEMINEUR:
                this.ctrl.getMessageFromAbstraction(MESSAGE.CHANGEPAGE, MESSAGE.DEMINEUR);
                this.PAGE = "DEMINEUR";
                this.ctrl.getMessageFromAbstraction(MESSAGE.HIGHLIGHT, "Demineur");
                break;
            case MESSAGE.PROFIL:
                this.ctrl.getMessageFromAbstraction(MESSAGE.CHANGEPAGE, MESSAGE.PROFIL);
                this.PAGE = "PROFIL";
                this.ctrl.getMessageFromAbstraction(MESSAGE.HIGHLIGHT, "Profil");
                break;
        }
    }
}

class PresNav extends Pres{
    constructor() {
        super();
        // Je récupère mon élément nav avec son id
        this.div = document.getElementById('barrenav');
        // Array qui contient les éléments de cette barre de nav
        this.elements = [];

        this.currentElement = null;
    }

    getMessage(message, pieceJointe){
        switch (message) {
            case MESSAGE.CHANGEPAGE:
                this.choixPage(pieceJointe);
                break;
            case MESSAGE.AFFICHETOI:
                this.afficheNav();
                break;
            case MESSAGE.HIGHLIGHT:
                this.highlightOnglet(pieceJointe);
                break;
        }
    }

    highlightOnglet(page) {
        // Modifie le CSS pour mettre en valeur l'onglet actuel

        // Effacer l'ancien highlight
        if(this.currentElement){ // Si il en existe un
            //ancien.className = "";
            this.currentElement.style.cssText = null;
        }

        // l'id html de l'element est composé comme ça : ongletAcceuil, ...
        let id = "onglet" + page;
        this.currentElement = document.getElementById(id);
        //console.log("Voici l'element à highlight : "+element);

        // Placer le nouveau highlight
        this.currentElement.className = "current-tab";
        // Ligne précédente n'a aucun effet : son background n'est pas prioritaire
        this.currentElement.style.cssText = "background-color: burlywood";
    }

    afficheNav() {
        // Création des divs clickables
        let boutonAcceuil = document.createElement("div");
        boutonAcceuil.setAttribute("id","ongletAccueil");
        boutonAcceuil.innerHTML = "<p>ACCUEIL</p>";
        boutonAcceuil.addEventListener("click", ()=> {
            let div = document.getElementById('container');
            if(div) {document.body.removeChild(div);} //vide la page s'il y a quelque chose
            this.ctrl.getMessageFromPresentation(MESSAGE.CHANGEPAGE, MESSAGE.ACCUEIL);
        })
        this.elements.push(boutonAcceuil);

        let boutonDemineur = document.createElement("div");
        boutonDemineur.setAttribute("id", "ongletDemineur");
        boutonDemineur.innerHTML = "<p>DEMINEUR</p>";
        boutonDemineur.addEventListener("click", () => {
            let div = document.getElementById('container');
            if(div) {document.body.removeChild(div);} //vide la page s'il y a quelque chose
            this.ctrl.getMessageFromPresentation(MESSAGE.CHANGEPAGE, MESSAGE.DEMINEUR);
        })
        this.elements.push(boutonDemineur);

        let bouton2048 = document.createElement("div");
        bouton2048.setAttribute("id", "onglet2048");
        bouton2048.innerHTML = "<p>2048</p>";
        bouton2048.addEventListener("click", () => {
            let div = document.getElementById('container');
            if(div) {
                document.body.removeChild(div);
            } //vide la page s'il y a quelque chose
            this.ctrl.getMessageFromPresentation(MESSAGE.CHANGEPAGE, MESSAGE.INIT2048);
        })
        this.elements.push(bouton2048);

        let boutonProfil = document.createElement("div");
        boutonProfil.setAttribute("id", "ongletProfil");
        boutonProfil.innerHTML = "<p>PROFIL</p>";
        boutonProfil.addEventListener("click", () => {
            let div = document.getElementById('container');
            if(div) {document.body.removeChild(div);} //vide la page s'il y a quelque chose
            this.ctrl.getMessageFromPresentation(MESSAGE.CHANGEPAGE, MESSAGE.PROFIL);
        })
        this.elements.push(boutonProfil);

        // on rajoute tous les elements de la barre de navigation dans le nav du html
        for (let i = 0; i < this.elements.length; i++) {
            //elements[i].setAttribute("class", "barrenav");
            //barre.innerHTML += elements[i];
            this.div.appendChild(this.elements[i]);
        }
    }
}

class CtrlNav extends Ctrl{
    constructor(abs, pres) {
        super(abs,pres);
    }

    getMessageFromParent(message){
        if (message === MESSAGE.INIT){
            this.abs.getMessage(message); //deprecated
            this.pres.getMessage(MESSAGE.AFFICHETOI); //affiche barre de nav
        }
    }

    getMessageFromAbstraction(message, piecejointe){
        //console.log("CtrlNav recoit : "+message);
        switch (message){
            case MESSAGE.HIGHLIGHT:
                this.pres.getMessage(message, piecejointe);
                break;
            case MESSAGE.CHANGEPAGE:
                this.parent.recoitMessageDUnEnfant(MESSAGE.CHANGEPAGE, piecejointe);
                //envoi le message à ciment avec le nom de la page à generer
                break;
        }
    }

    getMessageFromPresentation(message, piecejointe){
        switch (message){
            case MESSAGE.CHANGEPAGE:
                this.abs.getMessage(MESSAGE.CHANGEPAGE, piecejointe);
                break;
        }
    }
}
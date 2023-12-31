// Définir une classe Timer
class Timer {
    constructor() {
        //On récupère le span d'affichage du temps avec getElementbyID
        this.display = document.getElementById('timer-display'); 
        //Ainsi que le bouton du canvas
        this.button = document.getElementById('confirmation-canvas'); 
        this.totalTime = 1200; // 20 minutes en secondes
        this.display.textContent = this.formatTime(); //On affiche le Timer 
        this.timerInterval = null; // On itialise l'intervalle du chronomètre à null
        // On met un Event Listener pour lancer la méthode start au clique sur le bouton avec une fonction fléchée
        this.button.addEventListener("click", () => this.start());
        //On vérifie si le temps restant est enregistré dans sessionStorage
        const savedTime = sessionStorage.getItem('remainingTime');
        if (savedTime) {
            //Si un temps est enregistré, on le récupère on le transforme en integer avec parseInt() et on démarre le timer
            this.totalTime = parseInt(savedTime, 10);
            this.start();
        }
        this.display.textContent = this.formatTime(); //On affiche le Timer
    }

    start() {
        //On vérifie que l'intervalle soit nulle
        if (!this.timerInterval) {
            // On set un intervalle avec la méthode setInterval pour éxecuter la méthode update toutes les secondes
            sessionStorage.setItem('remainingTime', this.totalTime.toString());
            this.timerInterval = setInterval(() => this.update(), 1000); 
        }
    }

    update() { // Si le timer atteint 0
        if (this.totalTime <= 0) {
            //On arrête l'intervalle du Timer avec clearInterval()
            clearInterval(this.timerInterval);
            //On le remet à null
            this.timerInterval = null;
            sessionStorage.clear();
            location.reload();
        } else { //Sinon on réduit le temps d'une seconde et on update l'affichage avec formatTime
            this.totalTime--; // Réduit le temps restant d'une seconde
            //On enregistre le temps restant dans sessionStorage en convertissant le temps restant en string 
            // Car on peut enregistrer que des chaines de caractères dans sessionStorage
            sessionStorage.setItem('remainingTime', this.totalTime.toString()); 
            this.display.textContent = this.formatTime(); // Met à jour l'affichage du temps
        }
    }

    formatTime() { // Pour afficher le temps en minutes et secondes
        const minutes = Math.floor(this.totalTime / 60); // On divise le temps restant en minutes et on prends l'entier de ça avec Math.floor()
        const seconds = this.totalTime % 60; // On divise par les minutes mais on prends que le reste avec %
        // On formatte le temps au format "mm:ss". Si le nb de secondes est inférieur à 10 on rajoute un 0 devant pour garder le bon formattage
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; 
    }
    
}

// Crée une instance de la classe Timer
const timer = new Timer(); 

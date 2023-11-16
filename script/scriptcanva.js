// Définition de la classe DrawingCanvas
class DrawingCanvas {
    constructor() {
        // Récupère l'élément canvas à partir de son ID
        this.canvas = document.getElementById('signature-canvas');
        // Récupère le contexte 2D du canvas
        this.ctx = this.canvas.getContext('2d');
        //Bouton de confirmation pareil
        this.confirmButton = document.getElementById('confirmation-canvas');
        //Bouton d'annulation
        this.cancelButton = document.getElementById('annulation-canvas');
        // Boolean pour suivre si l'utilisateur dessine actuellement
        this.drawing = false;
        // Ajoute un EventListener pour le bouton de la souris enfoncé (mousedown)
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        // Ajoute un EventListener pour le bouton de la souris relâché (mouseup)
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        // Ajoute un EventListener pour le mouvement de la souris (mousemove)
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        // Ajoute des EventListener pour le toucher 
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), false);

        //On utilise les propriétés de l'API Canvas pour définir les propriétés du trait.
        // Epaisseur du trait
        this.ctx.lineWidth = 5;
        // Style du trait
        this.ctx.lineCap = 'round';
        // Couleur du trait
        this.ctx.strokeStyle = 'black';

        //On met le bouton de confirmation en disabled par défaut et on crée un compteur pour confirmer la signature
        this.confirmButton.disabled = true;
        this.confirmationDrawing = 0;

        //On ajoute un Eventlistener au bouton annuler et une fonction fléchée pour manipuler le css et le canva
        this.cancelButton.addEventListener('click', (e) => {
            var popup = document.getElementById('canvas-popup');
            var form = document.getElementById('reservation-form');
            var map = document.getElementById('map');
            map.style.pointerEvents = 'all';
            map.style.opacity = '1';
            form.style.pointerEvents = 'all';
            form.style.opacity = '1';
            popup.style.display = 'none';
        });
        //Pour bind clearCanvas au clique sur le bouton annuler
        this.cancelButton.addEventListener('click',this.clearCanvas.bind(this));  
    }

    // Méthode appelée lorsqu'un bouton de la souris est enfoncé
    handleMouseDown() {
        this.drawing = true;
    }

    // Méthode pour gérer le début du toucher
    handleTouchStart(e) {
        e.preventDefault(); // Prévient le comportement par défaut du navigateur
        this.drawing = true;
        // Obtient la position de toucher et commence le dessin
        const touch = e.touches[0];
        this.ctx.moveTo(touch.clientX - this.canvas.getBoundingClientRect().left, touch.clientY - this.canvas.getBoundingClientRect().top);
    }

    // Méthode appelée lorsqu'un bouton de la souris est relâché
    handleMouseUp() {
        this.drawing = false;
        // Commencer un nouveau chemin de dessin
        this.ctx.beginPath();        
    }
    // Méthode pour gérer la fin du toucher
    handleTouchEnd() {
        this.drawing = false;
        this.ctx.beginPath(); // Commence un nouveau chemin
    }

    // Méthode appelée lorsqu'il y a un mouvement de la souris
    handleMouseMove(e) {
        //si this.drawing est false on return
        if (!this.drawing) return;
        // Sinon on commence à tracer une ligne
        this.ctx.lineTo(e.clientX - this.canvas.getBoundingClientRect().left, e.clientY - this.canvas.getBoundingClientRect().top);
        // Et on trace le trait
        this.ctx.stroke();

        // Et on déplace le pointeur du dessin vers la nouvelle position de la souris
        this.ctx.moveTo(e.clientX - this.canvas.getBoundingClientRect().left, e.clientY - this.canvas.getBoundingClientRect().top);
        //On incrémente le compteur et on vérifie si il y a assez de dessin
        this.confirmationDrawing ++;
        this.toggleConfirmButton();
        
    }
    // Méthode pour gérer le mouvement du toucher
    handleTouchMove(e) {
        if (!this.drawing) return;
        e.preventDefault(); // Prévient le comportement de scroll par défaut
        const touch = e.touches[0];
        this.ctx.lineTo(touch.clientX - this.canvas.getBoundingClientRect().left, touch.clientY - this.canvas.getBoundingClientRect().top);
        this.ctx.stroke();
        this.ctx.moveTo(touch.clientX - this.canvas.getBoundingClientRect().left, touch.clientY - this.canvas.getBoundingClientRect().top);

        this.confirmationDrawing++;
        this.toggleConfirmButton();
    }
    //La méthode pour activer le bouton de confirmation
    toggleConfirmButton() {
        //Si le compteur est à 3 ou plus on disable plus le bouton, il devient cliquable.
        if (this.confirmationDrawing >= 3) {
            this.confirmButton.disabled = false;
        }
    }
    clearCanvas() { //Méthode pour effacer le canva
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}


// On crée une nouvelle instance de classe
const canvasApp = new DrawingCanvas();


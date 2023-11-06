class Diaporama {
	// Méthode constructor() pour créer et initialiser un objet
	constructor() {
		this.slide = document.querySelectorAll('.slide'); // On sélectionne les slides
		this.index = 0; // Pour incrémenter ou décrémenter
		this.isPlaying = true; //Booléen pour activer le sliderama ou pas
		this.timer = null; //Le timer pour passer 5s sur chaque slide
		//Méthode pour commencer le slide directement
		this.startSlide();
		// Méthode pour gérer les touches du clavier
		this.keyboardSlide();
	}

	//Méthode pour avancer d'une slide
	nextSlide() {
		// On cache la slide correspondant à l'index en cours 
		this.slide[this.index].style.display = "none";
		//Incrémente l'index pour passer à la prochaine slide 
		this.index ++;
		//Si la valeur de l'index dépasse le nombre de slide on le remet à 0
		if (this.index >= this.slide.length) {
			this.index = 0;
		}
		//On affiche la prochaine slide 
		this.slide[this.index].style.display = "block";
	}

	//Méthode pour reculer d'une slide, même principe 
	prevSlide() {
		this.slide[this.index].style.display = "none";
		this.index --;
		//Si la valeur de l'index est moins que 0 on le met à la derniere slide
		if (this.index<0) {
			this.index = this.slide.length -1;
		}
		this.slide[this.index].style.display = "block";
	}

	//Méthode pour commencer le diapo
	startSlide() {
		// On affiche la première slide
		this.slide[this.index].style.display ="block";
		// On met un timer de 5000 ms pour passer à la prochaine slide
		this.timer = setInterval(()=> this.nextSlide(), 5000);
	}
	//Méthode pour play/pause le diapo + afficher le bon bouton
	playPause() {
		let btnPlayPause = document.querySelector('.btn-play-pause');
		let btnPlay = btnPlayPause.querySelector('.btn-play');
		let btnPause = btnPlayPause.querySelector('.btn-pause');
		if (this.isPlaying) {
			clearInterval(this.timer);
			btnPlay.style.display = "inline-block";
			btnPause.style.display = "none";
		} else {
			this.startSlide();
			btnPlay.style.display = "none";
			btnPause.style.display = "inline-block";
		}
		this.isPlaying = !this.isPlaying;
	}
	//Méthode pour naviguer avec les touches du clavier
	keyboardSlide() {
		// On met un EventListener et une fonction pour si quelqu'un appuie sur une touche
		document.addEventListener('keydown', (e) => {
			// Si la touche c'est la flèche gauche on run la méthode prevSlide() sinon si c'est la flèche droite on run nextSlide()
			if (e.keyCode === 37) {
				this.prevSlide();
			} else if (e.keyCode ===  39) {
				this.nextSlide();
			}

		});
	}

}
// Crée une nouvelle instance de Diaporama()
let diaporama = new Diaporama(); 

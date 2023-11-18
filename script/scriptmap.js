class MapApp {
	constructor() {
		this.map = null; // Pour stocker l'objet de la carte leaflet
		this.markerCluster = null; // Pour faire nos cluster
		this.customIcon1 = null; // Pour stocker mon icone perso 
		this.customIcon2 = null; // Pareil  
		// On appelle les méthodes suivantes
		this.initMap(); // Méthode pour créer la carte
		this.customIcons(); //Méthode pour nos icones
		this.fetchData(); // Méthode pour récupérer la data de l'API JCDECEAUX
        MapApp.selectStation(); //On appelle notre méthode statique selectStation
        let sessionStorageExists = false; //Un booléen pour voir si sessionStorage existe
	}
	initMap() { // Méthode pour créer la carte
        this.map = L.map('map').setView([47.2184, -1.5536], 13); // Créer une nouvelle carte avec l'id map et la centrer sur les coordonnées de Nantes
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { //Ajoute une tile a la carte en focntion des coordnonées et du zoom
        	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Pour s/o les créateurs et la plateforme
        }).addTo(this.map); //On ajoute la tuile a notre map

        //Pour les options des cluster
        const optionsCluster = {
        	spiderfyOnMaxZoom : true, // Pour disperser les icones dans un cluster, option de bibliothèque
        	iconCreateFunction : this.customClusterIcon.bind(this), // Pour créer l'icone du cluster.
        };

        //Pour créer les cluster
        this.markerCluster = L.markerClusterGroup(optionsCluster);
        this.map.addLayer(this.markerCluster);

	}
	customIcons() { //Par soucis de légibilité, je mets les données des icones dans une méthode
		this.customIcon1 = L.icon({
			iconUrl : 'img/marker-icon-red.png',
			iconSize : [25,41],
			iconAnchor: [12,41],
			popupAnchor: [1,-34],
		});
		this.customIcon2 = L.icon({
			iconUrl : 'img/marker-icon-green.png',
			iconSize : [25,41],
			iconAnchor: [12,41],
			popupAnchor: [1,-34],
		});
	}
    customClusterIcon(cluster) { //Méthode pour créer une icone de cluster 
        return L.divIcon({
            html: `<div class="custom-cluster">${cluster.getChildCount()}</div>`, // on crée une div qui servira d'icone avec le nombre de markers
            className: 'custom-cluster-icon', // Pour la personnaliser
            iconSize: L.point(40, 40), //La taille
        });
    }
    fetchData() {
        // On stock l'URL de l'API dans une constante ainsi que l'API KEY dans une variable
        let apiKey = '289658e73d5657e0b9531911373d0b34c073b33d'
        const apiUrl = `https://api.jcdecaux.com/vls/v3/stations?contract=nantes&apiKey=${apiKey}`;

        fetch(apiUrl) //fonction fetch pour récupérer les données de l'API
            .then(response => response.json()) //Pour formatter les données
            .then(data => { 
                data.forEach(station => { //Pour chaque station
                    const coords = station.position; // stock les coordonnées dans coords
                    let marker; // crée une variable
                    // Condition pour créer un marker avec une icone rouge ou verte en fonction de l'état de la station
                    // Ou des disponibilités de vélos
                    if (station.totalStands.availabilities.bikes === 0 ||station.status === "CLOSED") {
                        marker = this.createMarker([coords.latitude, coords.longitude], this.customIcon1);
                    } else {
                        marker = this.createMarker([coords.latitude, coords.longitude], this.customIcon2);
                    }

                    this.bindPopupToMarker(marker, station); //On appelle la méthode bindPopupToMarker 

                    this.markerCluster.addLayer(marker); //On ajoute le marker au cluster.
                });
            })
            .catch(error => { // Pour afficher les éventuelles erreurs dans la console
                console.error('Error fetching data:', error);
            });
    }
    createMarker(position, icon) { //Pour créer des marker sur la carte
        return L.marker(position, { icon: icon });
    }
    bindPopupToMarker(marker, station) { // Pour bind un popup personnalisé au marker
        let buttonOrMessage; // Variable bouton ou message en fonction de la condition ci-dessous
        if (station.totalStands.availabilities.bikes === 0 ||station.status === "CLOSED") { //Boucle if pour afficher un bouton ou un message selon paramètres
            buttonOrMessage = '<p>Aucun vélo disponible. Impossible de réserver.</p>';
        } else { 
            //J'ai stocké les infos de la station directement dans le bouton et j'ai mis la fonction replace pour remplacer les quotes par un autre type de quotes
            // J'ai utilisé stingify() pour convertir l'objet station en sting JSON pour pouvoir le stocker
            // J'ai ajouté un onclick pour appeler selectStation() ici
            buttonOrMessage = `<button id="bouton_selectionner" class="btn-select" data-station='${JSON.stringify(station).replace(/'/g, '&rsquo;')}' onclick="MapApp.selectStation(this)">Sélectionner</button>`;
        }
        // Ca c'est la structure de notre popup, son contenu
        const popupContent = `
            <div id="div_popup_custom">
                <p>Nom de la station: ${station.name}</p>
                <p>Addresse: ${station.address}</p>
                <p>Statut: ${station.status}</p>
                <p>Nombre de vélos disponibles: ${station.totalStands.availabilities.bikes}</p>
                <p>Nombre de docks disponibles: ${station.totalStands.availabilities.stands}</p>
                ${buttonOrMessage}
            </div>
        `;
        // On associe chaque popup au marqueur avec la méthode bindPopup de leaflet
        marker.bindPopup(popupContent);
    }
    // Fonction statique pour enregister les infos de station sur la map dans session storage et les afficher où on veut et les conserver
    // Même quand on recharge la page
static selectStation(buttonElement = null) { 
    // Variable station
    let station;
    // Si un bouton est fourni, j'utilise ses données pour définir la 'station' et stocker ses éléments dans sessionStorage
    if (buttonElement) {
        station = JSON.parse(buttonElement.getAttribute('data-station')); //Je convertis mon JSON string en objet que je stocke dans station
        // Je stocke les différents éléments dans session storage
        sessionStorage.setItem('nomStation', station.name);
        sessionStorage.setItem('adresseStation', station.address);
        sessionStorage.setItem('nbVelosDispo', station.totalStands.availabilities.bikes);
        sessionStorage.setItem('nbPlacesDispo', station.totalStands.availabilities.stands);
    } 
    // Sinon si aucune donnée n'est fournie mais que des données sont déjà stockées dans session storage:
    else if (sessionStorage.getItem('nomStation')) {
        // Je les utilise pour remplir les informations
        station = {
            name: sessionStorage.getItem('nomStation'),
            address: sessionStorage.getItem('adresseStation'),
            totalStands: {
                availabilities: {
                    bikes: sessionStorage.getItem('nbVelosDispo'),
                    stands: sessionStorage.getItem('nbPlacesDispo')
                }
            }
        };
    }

    // Je met à jour les éléments d'affichage
    if (station && station.name) {
        document.getElementById("nom_station").textContent = station.name;
        document.getElementById("nom_station2").textContent = station.name;
        document.getElementById("adresse_station").textContent = station.address;
        document.getElementById("adresse_station2").textContent = station.address;
        document.getElementById("nb_velos_dispo").textContent = station.totalStands.availabilities.bikes;
        document.getElementById("nb_velos_dispo2").textContent = station.totalStands.availabilities.bikes;
        document.getElementById("nb_places_dispo").textContent = station.totalStands.availabilities.stands;
        document.getElementById("nb_places_dispo2").textContent = station.totalStands.availabilities.stands;
        // Je change le css pour afficher mon formulaire et cacher mon message par défaut.
        var form = document.getElementById('reservation-form');
        var messageSelect = document.getElementById('message-select');
        form.style.display = 'flex';
        messageSelect.style.display = 'none';
    }
}


}
//Je crée une nouvelle instance de classe quand le document à été chargé complétement.
document.addEventListener("DOMContentLoaded", () => {
    new MapApp();
}); 
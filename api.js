/**
 * https://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
 * 
 * {zip code} = code postal (ex : 38000)
 * {country code} = code pays (ex : fr)
 * {API key} = clé API se trouvant dans "https://home.openweathermap.org/api_keys"
 * units=metric = unité de mesure => °C
 */

// Sélection des éléments HTML
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');




// Fonction pour obtenir la météo par code postal
function getWeatherByZipcode() {
    const APIKey = '155071051537a975557b8ad4d1e37d87';
    const fr = 'fr';
    const codePostal = document.querySelector('input').value;

    if (codePostal === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${codePostal},${fr}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            displayWeather(json);
        });
}



// Fonction pour obtenir la météo par géolocalisation
function getWeatherByCoordinates(latitude, longitude) {
    const APIKey = '155071051537a975557b8ad4d1e37d87';

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            displayWeather(json);
        });
}



// Fonction pour afficher les données météorologiques
function displayWeather(json) {
    const name = document.querySelector('.weather-box .name');
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    // Pour chaque cas, on insère une image en fonction de la donnée json.weather[0].main
    switch (json.weather[0].main) {
        case 'Clear':
            image.src = 'images/clear.png';
            break;
        case 'Rain':
            image.src = 'images/rain.png';
            break;
        case 'Snow':
            image.src = 'images/snow.png';
            break;
        case 'Clouds':
            image.src = 'images/cloud.png';
            break;
        case 'Haze':
            image.src = 'images/mist.png';
            break;
        default:
            image.src = '';
    }

    // Mise à jour des données dans les éléments HTML
    name.innerHTML = `${json.name}`;
    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

    // Gestion de la mise en page de weatherBox, de weatherDetails et du container
    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '650px';
}



// Écouteur d'événement pour le bouton de géolocalisation
function getLocationAndWeather() {
    // On vérifie si le navigateur prend en charge la géolocalisation
    if (navigator.geolocation) {
        /** 
         * Cette fonction "navigator.geolocation.getCurrentPosition" 
         * demande au navigateur de fournir la position géographique actuelle de l'utilisateur
         */
        /** 
         * La méthode "getCurrentPosition()" prend deux arguments :
         * une fonction de succès (ici définie comme une fonction fléchée)
         * et une fonction d'erreur (également définie comme une fonction fléchée)
         * 
         * La fonction de succès est exécutée lorsque la géolocalisation est obtenue avec succès. 
         * Elle reçoit un objet position contenant les données de géolocalisation, notamment les coordonnées de latitude et de longitude.
         * 
         * La fonction d'erreur est exécutée en cas d'échec de la géolocalisation. 
         * Elle reçoit un objet error qui contient des informations sur l'erreur.
         */ 

        navigator.geolocation.getCurrentPosition(position => {
            /**
             * Dans la fonction de succès, 
             * les coordonnées de latitude et de longitude sont extraites de l'objet position
             * à l'aide de position.coords.latitude et position.coords.longitude.
             */
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            /**
             * Ensuite, ces coordonnées sont utilisées comme arguments 
             * pour appeler la fonction getWeatherByCoordinates(latitude, longitude)
             */
            console.log(latitude, longitude, position.coords.accuracy);
            getWeatherByCoordinates(latitude, longitude);
        }, error => {
            /**
             * Si la géolocalisation est prise en charge mais échoue pour une raison quelconque, 
             * la fonction d'erreur est exécutée. Elle affiche un message d'erreur dans la console en utilisant console.error et inclut des informations sur l'erreur error.
             */
            console.error('Erreur de géolocalisation :', error);
        });
    } else {
        /**
         * Enfin, si la géolocalisation n'est pas prise en charge par le navigateur, 
         * un message d'alerte s'affiche pour informer l'utilisateur que la géolocalisation n'est pas disponible dans son navigateur.
         */
        alert('La géolocalisation n\'est pas prise en charge par votre navigateur.');
    }
}

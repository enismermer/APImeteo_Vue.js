/**
 * 
 * PRÉSENTATION DE L'API MÉTÉO
 * 
 * 
 * https://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
 * 
 * {zip code} = code postal (ex : 38000)
 * {country code} = code pays (ex : fr)
 * {API key} = clé API se trouvant dans "https://home.openweathermap.org/api_keys"
 * units=metric = unité de mesure => °C
 * 
 */

// const container = document.querySelector('.container');
// const search = document.querySelector('.search-box button');
// const weatherBox = document.querySelector('.weather-box');
// const weatherDetails = document.querySelector('.weather-details');

// const name = document.querySelector('.weather-box .name');
// const image = document.querySelector('.weather-box img');
// const temperature = document.querySelector('.weather-box .temperature');
// const description = document.querySelector('.weather-box .description');
// const humidity = document.querySelector('.weather-details .humidity span');
// const windSpeed = document.querySelector('.weather-details .wind-speed span');

/**
 * Je vais ajouter l'instance Vue qui contiendra :
 * les données (data) et les méthodes (methods)
 * ET
 * qui sera connectée à la balise <div id="app"> 
 * avec => app.mount('#app')
 */
const app = Vue.createApp({
    data() {
        return {
            codePostal: '',
            weather: {
                name: '',
                iconUrl: '',
                temperature: '',
                description: '',
                humidity: '',
                windSpeed: ''
            }
        };
    },
    methods: {
    	// Fonction pour obtenir la météo par code postal
        getWeatherByZipcode() {
            const APIKey = '155071051537a975557b8ad4d1e37d87';
            const france = 'fr';

            // Si on tape rien dans la saisie du code postal, il ne s'affichera rien
            // en évitant l'erreur => throw new Error('Code postal non existant');
            if (this.codePostal === '')
                return;

            fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${this.codePostal},${france}&appid=${APIKey}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        // Lance une erreur personnalisée si la réponse n'est pas OK (statut différent de 200 OK)
                        throw new Error('Code postal non existant');
                    }
                    return response.json();
                })
                .then(json => {
                    console.log(json); // J'affiche toutes les données de l'API météo en JSON selon le CODE POSTAL dans la console
                    this.displayWeather(json); // J'appelle la méthode : displayWeather()
                })
                .catch(error => {
                    // Affiche un message d'erreur à l'utilisateur => "throw new Error('Code postal non existant')"
                    console.error(error);
                });
        },

        // Fonction pour obtenir la météo par géolocalisation
        getWeatherByCoordinates(latitude, longitude) {
            const APIKey = '155071051537a975557b8ad4d1e37d87';

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`)
                .then(response => response.json())
                .then(json => {
                    console.log(json); // J'affiche toutes les données de l'API météo en JSON selon la LOCALISATION dans la console
                    this.displayWeather(json); // J'appelle la méthode : displayWeather()
                });
        },
        
        // Fonction pour afficher les données météorologiques
        displayWeather(json) {
            this.weather.name = json.name;
            this.weather.iconUrl = this.getWeatherIconUrl(json.weather[0].main);
            this.weather.temperature = parseInt(json.main.temp);
            this.weather.description = this.getWeatherDescriptionInFrench(json.weather[0].description) ;
            this.weather.humidity = json.main.humidity;
            this.weather.windSpeed = parseInt(json.wind.speed);
            
            // Gestion de la mise en page
            this.showWeatherDetails(); // J'appelle la méthode : showWeatherDetails()
        },

        // Fonction pour afficher les images pour chaque type de météo en cas de ...
        getWeatherIconUrl(weatherType) {
            switch (weatherType) {
                // en cas de 'Clear'
                case 'Clear':
                    return 'images/clear.png';
                // en cas de 'Rain'
                case 'Rain':
                    return 'images/rain.png';
                // en cas de 'Snow'
                case 'Snow':
                    return 'images/snow.png';
                // en cas de 'Clouds'
                case 'Clouds':
                    return 'images/cloud.png';
                // en cas de 'Haze'
                case 'Haze':
                    return 'images/mist.png';
                // par défault
                default:
                    return '';
            }
        },

        // Fonction pour afficher la description de la météo en FRANÇAIS
        getWeatherDescriptionInFrench(WeatherDescriptionFrench) {
            switch (WeatherDescriptionFrench) {
                // en cas de 'clear sky'
                case 'clear sky':
                    return 'ciel dégagé';
                // en cas de 'few clouds'
                case 'few clouds':
                    return 'quelques nuages';
                // en cas de 'scattered clouds'
                case 'scattered clouds':
                    return 'nuages épars';
                // en cas de 'broken clouds'
                case 'broken clouds':
                    return 'nuages fragmentés';
                // en cas de 'shower rain'
                case 'shower rain':
                    return 'averses de pluie';
                // en cas de 'rain'
                case 'rain':
                    return 'pluie';
                // en cas de 'thumderstorm'
                case 'thunderstorm':
                    return 'orage';
                // en cas de 'snow'
                case 'snow':
                    return 'neige';
                // en cas de 'mist'
                case 'mist':
                    return 'brouillard';
                // par défault
                default:
                    return '';
            }
        },

        // Fonction pour afficher la gestion de la mise en page
        showWeatherDetails() {
            // <div id="app" class="container">
            const container = document.querySelector('.container');
            // <div class="weather-box" id="weatherBox">
            const weatherBox = document.getElementById('weatherBox');
            // <div class="weather-details" id="weatherDetails">
            const weatherDetails = document.getElementById('weatherDetails');
    
            // Gestion de la mise en page de weatherBox, de weatherDetails et du container
            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '650px';
        },

        // Écouteur d'événement pour le bouton de géolocalisation
        getLocationAndWeather() {
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
                 * Elle reçoit un objet "position" contenant les données de géolocalisation, notamment les coordonnées de latitude et de longitude.
                 * 
                 * La fonction d'erreur est exécutée en cas d'échec de la géolocalisation. 
                 * Elle reçoit un objet "error" qui contient des informations sur l'erreur.
                 */
                navigator.geolocation.getCurrentPosition(position => {
                    /**
                     * Dans la fonction de succès, 
                     * les coordonnées de latitude et de longitude sont extraites de l'objet "position"
                     * à l'aide de "position.coords.latitude" et "position.coords.longitude".
                     */
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    /**
                     * Ensuite, ces coordonnées sont utilisées comme arguments 
                     * pour appeler la fonction getWeatherByCoordinates(latitude, longitude)
                     */
                    console.log(latitude, longitude);
                    this.getWeatherByCoordinates(latitude, longitude);
                }, error => {
                    /**
                     * Si la géolocalisation est prise en charge mais échoue pour une raison quelconque, 
                     * la fonction d'erreur est exécutée. Elle affiche un message d'erreur dans la console en utilisant "console.error" et inclut des informations sur l'erreur "error".
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
    }
});

app.mount('#app');
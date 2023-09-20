/**
 * https://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
 * 
 * {zip code} = code postal (ex : 38000)
 * {country code} = code pays (ex : fr)
 * {API key} = clé API se trouvant dans "https://home.openweathermap.org/api_keys"
 * units=metric = unité de mesure => °C
 */

// Je sélectionne chacun des éléments
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');

// Quand on clique sur le bouton
search.addEventListener('click', () => {

    // Je définis la clé API, la langue et je sélectionne le input
    const APIKey = '155071051537a975557b8ad4d1e37d87';
    const fr = 'fr';
    const codePostal = document.querySelector('input').value;

    if (codePostal === '')
        return;

    // Je connecte l'API en important les variables comme paramètres = codePostal, fr et APIKey
    // puis je convertis la réponse en json
    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${codePostal},${fr}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {
            console.log(json);

            // Je sélectionne chacun des éléments
            const name = document.querySelector('.weather-box .name')
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

            // J'importe les données dans les éléments
            name.innerHTML = `${json.name}`;
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            // Je gère la mise en page de weatherBox, de weatherDetails et du container
            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '650px';
        })



});
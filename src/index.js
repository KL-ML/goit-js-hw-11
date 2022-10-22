import axios from "axios";
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
gallery.style.cssText += 'list-style-type:none;display:flex;flex-wrap:wrap;gap:40px;';
console.log(searchForm);
searchForm.addEventListener('submit', onSubmitForm);

const axios = require('axios').default;
const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `30636701-b7bfaf1719dc5d89c8acde7b5`;

const fetchImages = async (name) => {
    const searchParams = new URLSearchParams({
        key: API_KEY,
        q: name,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40,
    });
    const url = `${BASE_URL}?${searchParams}`;
    try {
        const response = await axios.get(url);
        const images = response.data;
        console.log(images);
        if (!images.ok) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        return images;
    } catch (errors) {
        console.error(errors);
    }
}

function onSubmitForm(event) {
    event.preventDefault();
    const inputValue = event.target.elements[0].value.trim();
    console.log(inputValue);
    if (inputValue !== '') {
        fetchImages(inputValue)
        .then(renderGallery)
        .catch((error) => console.log(error));
    }
    gallery.innerHTML = "";
}
function renderGallery(images) {
    gallery.innerHTML = "";
    const markup = images.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
                        <img src="${webformatURL}" alt="${tags}" height=200px; loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>${downloads}
                            </p>
                        </div>
                    </div>`;
        })
        .join("");
    gallery.insertAdjacentHTML('beforeend', markup);
}




// import debounce from 'lodash.debounce';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import './css/styles.css';
// import API from './fetchCountries';

// const DEBOUNCE_DELAY = 300;
// const searchBox = document.querySelector('#search-box');
// const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');
// countryList.style.cssText += 'list-style-type:none;';

// searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

// function onInputSearch(event) {

//     const inputValue = event.target.value.trim();
//     if (inputValue !== '') {
//         API.fetchCountries(inputValue)
//         .then(renderCountriesList)
//         .catch((error) => console.log(error));
//     }
//     countryList.innerHTML = "";
//     countryInfo.innerHTML = "";
// };

// function renderCountriesList(countries) {

//     if (countries.length > 10) {
//         Notify.info("Too many matches found. Please enter a more specific name.");

//     } else if (countries.length <= 10 && countries.length >= 2) {
//         countryInfo.innerHTML = "";
//         const markup = countries
//         .map(({ name, flags }) => {
//             return `<li>
//             <p><img alt="Flag of ${name}" src=${flags.svg} width="25">   ${name}</p>
//             </li>`;
//         })
//         .join("");
//         countryList.insertAdjacentHTML('beforeend', markup);

//     } else if (countries.length === 1) {
//         countryList.innerHTML = "";
//         const markup = countries
//         .map(({ name, capital, population, flags, languages }) => {
//             const languagesList = [];
//             languages.map(({ name }) => {
//                 languagesList.push(name);
//             });
//         return `
//             <div>
//                 <h2 class="country-title">
//                     <img alt="Flag of ${name}" src=${flags.svg} width="25">
//                     ${name}</h2>
//             </div>
//             <p><b>Capital:</b> ${capital}</p>
//             <p><b>Population:</b> ${population}</p>
//             <p><b>Languages:</b> ${languagesList}</p>
//         `;
//         })
//         .join("");
//         countryInfo.insertAdjacentHTML('beforeend', markup);
//     } else {
//         countryList.innerHTML = "";
//         countryInfo.innerHTML = "";
//     }
// }

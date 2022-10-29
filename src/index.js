import axios from "axios";
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './images-seach';
import LoadMoreBtn from "./load-more-btn";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

searchForm.addEventListener('submit', onSubmitForm);
loadMoreBtn.refs.button.addEventListener('click', onClickFetch);

function onSubmitForm(event) {
    event.preventDefault();
    imagesApiService.query = event.target.elements[0].value.trim();
    if (imagesApiService.query === '') { 
        Notify.failure("Please enter search query.");
    } else {
        loadMoreBtn.hide();
        imagesApiService.reserPage();
        clearGalleryContainer();
        onClickFetch();
    }
}
function onClickFetch() {
    loadMoreBtn.disabled();
    imagesApiService.fetchImages(imagesApiService.searchImgQuery)
        .then(images => {
            renderGallery(images);
            if (imagesApiService.pageNumber - 1 === Math.ceil(images.totalHits / 40)) {
                Notify.info("We're sorry, but you've reached the end of search results.");
                loadMoreBtn.hide();
            } else if (images.total === 0) {
                Notify.info("Sorry, there are no images matching your search query. Please try again.");
                loadMoreBtn.hide();
            } else {
            Notify.success(`Hooray! We found ${images.totalHits} images.`);
            loadMoreBtn.show();
            loadMoreBtn.enable();}
        })
        .catch((errore) => console.log(errore));
}
function renderGallery(images) {
    const markup = images.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
                        <a class="img-link">
                            <img src="${webformatURL}" alt="${tags}" height=200px; loading="lazy" />
                        </a>
                        <div class="info">
                            <p class="info-item">
                                <b>Likes </b>${likes}
                            </p>
                            <p class="info-item">
                                <b>Views </b>${views}
                            </p>
                            <p class="info-item">
                                <b>Comments </b>${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads </b>${downloads}
                            </p>
                        </div>
                    </div>`;
        })
        .join("");
    gallery.insertAdjacentHTML('beforeend', markup);
    }
function clearGalleryContainer() {
    gallery.innerHTML = "";
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

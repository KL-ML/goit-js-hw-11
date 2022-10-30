import axios from "axios";
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './images-seach';
import LoadMoreBtn from "./load-more-btn";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const gallerySimpleLightbox = new SimpleLightbox('div.gallery a');
gallerySimpleLightbox.refresh();
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
        Notify.info("Please enter search query.");
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
            const gallerySimpleLightbox = new SimpleLightbox('div.gallery a');
            gallerySimpleLightbox.refresh();
            if (imagesApiService.pageNumber - 1 === Math.ceil(images.totalHits / 40)) {
                Notify.info("We're sorry, but you've reached the end of search results.");
                loadMoreBtn.hide();
                scrollByPage();
            } else if (images.total === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                loadMoreBtn.hide();
            } else if (imagesApiService.pageNumber - 1 !== 1) { 
                scrollByPage();
                loadMoreBtn.show();
                loadMoreBtn.enable(); 
            } else {
            Notify.success(`Hooray! We found ${images.totalHits} images.`);
            loadMoreBtn.show();
            loadMoreBtn.enable();    
            }
        })
        .catch((errore) => console.log(errore));
}
function renderGallery(images) {
    const markup = images.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
                        <div class="photo-card">
                        <a href="${largeImageURL}" class="img-link">
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
                        </div>
                    `;
        })
        .join("");
    gallery.insertAdjacentHTML('beforeend', markup);
    }
function clearGalleryContainer() {
    gallery.innerHTML = "";
}
function scrollByPage() {
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

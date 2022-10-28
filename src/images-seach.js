import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";

const API_KEY = `30636701-b7bfaf1719dc5d89c8acde7b5`;
const BASE_URL = `https://pixabay.com/api/`;
        

export default class ImagesApiService {
    constructor() {
        this.searchImgQuery = '';
        this.pageNumber = 1;
    }

    async fetchImages() {
        console.log('до пошуку номер сторінки:', this.pageNumber);
        const searchParams = new URLSearchParams({
            key: API_KEY,
            q: this.searchImgQuery,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: this.pageNumber,
            per_page: 40,
        });
        const url = `${BASE_URL}?${searchParams}`;
        try {
            const response = await axios.get(url);
            const images = response.data;
            if (images.total === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
            this.incrementPage();
            console.log('після пошуку номер сторінки:', this.pageNumber);
            return images;

        } catch (errors) {
            console.error(errors);
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }     
    }

    incrementPage() {
        this.pageNumber += 1;
    }

    reserPage() {
        this.pageNumber = 1;
    }

    get query() {
        return this.searchImgQuery;
    }

    set query(newQuery) {
        this.searchImgQuery = newQuery;
    }

}
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";
import LoadMoreBtn from "./load-more-btn";

const API_KEY = `30636701-b7bfaf1719dc5d89c8acde7b5`;
const BASE_URL = `https://pixabay.com/api/`;
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});    

export default class ImagesApiService {
    constructor() {
        this.searchImgQuery = '';
        this.pageNumber = 1;
    }
    async fetchImages() {
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
            this.incrementPage();
            return images;

        } catch (errors) {
            Notify.failure("Sorry, something goes wrong. Please, check your internet-connection, or try again later.");
            loadMoreBtn.hide();
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
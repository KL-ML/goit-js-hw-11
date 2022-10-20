import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `30636701-b7bfaf1719dc5d89c8acde7b5`;
// const searchParams = new URLSearchParams({
//   key: 30636701 - b7bfaf1719dc5d89c8acde7b5,
//   q: ,
//   image_type: "photo",
//   orientation: "horizontal",
//   safesearch: true,
//   per_page: 40,
// });

function fetchImages(name) {
const searchParams = new URLSearchParams({
  key: API_KEY,
  q: name,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
  per_page: 40,
});
const url = `${BASE_URL}?${searchParams}`;
  return fetch(url).then(
    (response) => {
        if (!response.ok) {
            Notify.failure("Oops, there is no country with that name");
        }
        return response.json();
    }
  );
}

export default { fetchImages };
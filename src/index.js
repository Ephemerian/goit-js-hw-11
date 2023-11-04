import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchGalleryPhoto, Per_Page } from "./pixabay-api.js";
import { createMarkup } from "./templates/pixabay-markup.js";

const formEl = document.querySelector(".search-form");
const galleryEl = document.querySelector(".gallery");
const spanEl = document.querySelector(".js-span");
const target = document.querySelector(".js-guard");

let currentPage = 1;
let searchQuery = "";
let total = 0;
let isLoading = false;

formEl.addEventListener("submit", onSearch);
formEl.addEventListener("input", onInputChange);

function onInputChange(evt) {
  searchQuery = evt.target.value.trim(); 
};

function clearGallery() {
  galleryEl.innerHTML = "";
  total = 0;
  currentPage = 1;
  spanEl.textContent = "";
};

let options = {
  root: null,
  rootMargin: "200px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);
let lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
  captionPosition: "bottom"
});

function onSearch(evt) {
  evt.preventDefault();
  if (!searchQuery) {
    Notiflix.Report.warning("Please, enter the search word!");
    return;
  }
  clearGallery();
  observer.observe(target);
};

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !isLoading) {
      isLoading = true;
      getPhotoGallery().finally(() => {
        isLoading = false;
      });
    }
  });
};

async function getPhotoGallery() {
  if (total > 0 && currentPage > Math.ceil(total / Per_Page)) {
    observer.unobserve(target);
    spanEl.textContent = "We're sorry, but you've reached the end of search results.";
    return;
  }

  try {
    const data = await fetchGalleryPhoto(searchQuery, currentPage);
    total = data.data.totalHits;
    
    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }
    
    currentPage += 1;
    addMarkup(galleryEl, createMarkup(data.data.hits));
    lightbox.refresh();

    if (data.data.hits.length < Per_Page || currentPage > Math.ceil(total / Per_Page)) {
      observer.unobserve(target);
      spanEl.textContent = "We're sorry, but you've reached the end of search results.";
    }

  } catch (err) {
    Notiflix.Report.failure('Error', 'Sorry, there are no images matching your search query. Please try again', 'Ok');
  }
};

function addMarkup(element, markup) {
  element.insertAdjacentHTML("beforeend", markup);
};
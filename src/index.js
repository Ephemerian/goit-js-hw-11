import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchGalleryPhoto, Per_Page} from "./pixabay-api.js";
import { createMarkup } from "./templates/pixabay-markup.js";

const formEl=document.querySelector(".search-form");
const galleryEl = document.querySelector(".gallery");
const spanEl = document.querySelector(".js-span");
const target = document.querySelector(".js-guard");


let currentPage =1;
let searchQuery = "";
let total = 0;



formEl.addEventListener("submit", onSearch);
formEl.addEventListener("change", onChange);

function onChange() {
  
  return searchQuery = formEl.elements.searchQuery.value.trim(); 

};

function clearGallery() {
  galleryEl.innerHTML = "";
  total = 0;
  currentPage = 1;
  spanEl.textContent = "";
};

let options = {
  root : null,
  rootMargin : "200px",
  treshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);
let lightbox = new SimpleLightbox(".gallery a", { captionsData: "alt", captionDelay: 250, captionPosition: "bottom" });

function onSearch(evt) {
   
  evt.preventDefault();

  if (!searchQuery) {
 
    Notiflix.Report.warning("please, enter the search word!");
    return;
  }
  
  observer.observe(target);

  clearGallery();
};

function onLoad(enries, observer) {

   enries.forEach((entry) =>{
    if(entry.isIntersecting){         

      getPhotoGallery();  
     
    }
  });
 
};

async function getPhotoGallery() {  

    try {
      const data = await fetchGalleryPhoto(searchQuery, currentPage);
             
      
      if (currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
      }
      
      if (currentPage === Math.floor(data.data.totalHits / Per_Page) || (data.data.hits.length < 40)) {
               
        observer.unobserve(target);

        spanEl.textContent = "We're sorry, but you've reached the end of search results";
 
      }

      currentPage += 1;
        
      addMarkup(galleryEl, createMarkup(data.data.hits));
      lightbox.refresh();
       
    }

    catch (err) {
      Notiflix.Report.failure('Error', 'Sorry, there are no images matching your search query. Please try again', 'Ok')
    }
    
};  
   
 
function addMarkup(element, markup) {
  
  element.insertAdjacentHTML("beforeend", markup); 

};

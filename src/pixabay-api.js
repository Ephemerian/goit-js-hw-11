import axios from "axios";

const API_KEY = "40463622-d24ec175afc29e5d8ec0b90d2";
const BASE_URL = "https://pixabay.com/api/";
const Per_Page = 40;

 function fetchGalleryPhoto(searchQuery, page=1){
    const param = new URLSearchParams({
        key : API_KEY,
        q : searchQuery,
        image_type : "photo",
        orientation : "horizontal",
        safesearch : true,
        per_page: Per_Page,
        page : page,
    });

    return  axios.get(`${BASE_URL}?${param}`);
};

export{fetchGalleryPhoto, Per_Page};
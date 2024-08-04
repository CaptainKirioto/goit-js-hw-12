/* ----------- iziToast ----------- */

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

/* --------- Function import --------- */

import { getImage } from './js/pixabay-api';
import { createMarkup, lightboxImg } from './js/render-functions';

/* --------- DOM-elements Search --------- */

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMore = document.querySelector('.load-btn');

/* --------- Loader & Loader Button --------- */

function showLoader() {
  loader.style.visibility = 'visible';
}
function hideLoader() {
  loader.style.display = 'none';
}

function showLoadMore() {
  loadMore.style.visibility = 'visible';
}

function hideLoadMore() {
  loadMore.style.visibility = 'hidden';
}

/* --------- Main Programm --------- */

hideLoader();
hideLoadMore();

form.addEventListener('submit', searchImg);

let page = 1;
let limit = 15;
let totalPages = null;
let query = null;

let rect = null;

function searchImg(event) {
  event.preventDefault();

  const newQuery = event.target.elements.search.value.trim();
  if (!newQuery) {
    return iziToast.show({
      message: "You can't do that here",
      position: 'topRight',
      backgroundColor: '#EF4040',
      messageColor: '#FFFFFF',
    });
  }
  if (newQuery.length > 100) {
    return iziToast.show({
      message: "It's too long, buddy",
      position: 'topRight',
      backgroundColor: '#EF4040',
      messageColor: '#FFFFFF',
    });
  }

  query = newQuery;
  gallery.innerHTML = '';
  page = 1;
  hideLoadMore();
  showLoader();

  getImage(page, query)
    .then(data => {
      if (data.hits.length != 0) {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        lightboxImg();
        totalPages = Math.ceil(data.totalHits / limit);
        if (page < totalPages) {
          showLoadMore();
        }

        if (!rect) {
          const galleryItem = document.querySelector('.gallery-item');
          rect = galleryItem.getBoundingClientRect();
        }
        event.target.elements.search.value = '';
      } else {
        iziToast.show({
          message:
            'Sorry, there are no images matching your</br> search query. Please try again!',
          maxWidth: '432px',
          position: 'topRight',
          backgroundColor: '#EF4040',
          messageColor: '#FFFFFF',
        });
      }
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader();
    });
}

loadMore.addEventListener('click', onLoadMore);

async function onLoadMore(event) {
  page += 1;
  try {
    const data = await getImage(page, query);
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    lightboxImg();
    window.scrollBy({
      top: rect.height * 2,
      left: 0,
      behavior: 'smooth',
    });
    if (page >= totalPages) {
      hideLoadMore();
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results.",
        maxWidth: '432px',
        position: 'topRight',
        backgroundColor: '#EF4040',
        messageColor: '#FFFFFF',
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

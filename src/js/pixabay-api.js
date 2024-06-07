// функції для HTTP-запитів

import axios from 'axios';
import '../css/styles.css';

export async function getImage(page = 1, requestedImg) {
  const BASE_URL = 'https://pixabay.com/api/';
  const response = await axios.get(BASE_URL, {
    params: {
      page,
      per_page: 15,
      key: '44178222-91171e7a1f266369aa2a731c5',
      q: requestedImg,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  return response.data;
}

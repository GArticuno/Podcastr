import axios from 'axios';

export const api = axios.create({
  baseURL:'https://garticuno-api-podcastr.herokuapp.com/'
})
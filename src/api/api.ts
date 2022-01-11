const API_KEY = "a7b66a23f8e15dc51216fcf3ba99234e";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetMovieResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetDetail {
  adult: boolean;
  backdrop_path: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  production_companies: [
    {
      id: number;
      logo_path?: string;
      origin_country: string;
      name: string;
    }
  ];
  release_date: string;
  runtime: number;
  overview: string;
  id: number;
  title: string;
  popularity: number;
  poster_path: string;
  status: string;
  vote_average: number;
  vote_count: number;
}

interface ITv {
  poster_path: string;
  popularity: number;
  id: number;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  name: string;
  original_name: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_results: number;
  total_pages: number;
}

interface ISearch {
  poster_path: string;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  media_type: string;
  first_air_date: string;
  name: string;
  adult: boolean;
}

export interface IGetSearch {
  page: number;
  results: ISearch[];
  total_results: number;
  total_pages: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
export function getMovieDetail(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=kr`
  ).then((response) => response.json());
}
export function getPopularMovie() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
export function getUpcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getAiringTv() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}
export function getPopularTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}
export function getTopTv() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}
export function getTvDetail(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=true&region=kr`
  ).then((response) => response.json());
}

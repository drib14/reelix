const formatBaseUrl = (url) => {
  const fallback = "https://reelix-api.onrender.com";
  let fullUrl = (url || fallback).trim();
  if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
    fullUrl = `https://${fullUrl}`;
  }
  // If internal service name was passed (e.g. 'https://reelix-api'), append .onrender.com
  if (!fullUrl.includes(".")) {
    fullUrl = `${fullUrl}.onrender.com`;
  }
  return fullUrl;
};

export const BASE_URL = formatBaseUrl(import.meta.env.VITE_BASE_URL);
export const USERS_URL = "/api/v1/users";
export const GENRE_URL = "/api/v1/genre";
export const MOVIE_URL = "/api/v1/movies";
export const UPLOAD_URL = "/api/v1/upload";

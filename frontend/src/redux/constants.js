const formatBaseUrl = (url) => {
  // Check development vs production dynamically
  const envUrl = url && url.trim() !== "" 
    ? url 
    : (import.meta.env.DEV ? "http://localhost:3000" : "https://reelix-api.onrender.com");

  let fullUrl = envUrl.trim();
  if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
    fullUrl = `https://${fullUrl}`;
  }

  // Only append .onrender.com if it's a render app handle (no dot and no localhost)
  if (!fullUrl.includes(".") && !fullUrl.includes("localhost")) {
    fullUrl = `${fullUrl}.onrender.com`;
  }

  return fullUrl.replace(/\/$/, "");
};

export const BASE_URL = formatBaseUrl(import.meta.env.VITE_BASE_URL);
export const USERS_URL = "/api/v1/users";
export const GENRE_URL = "/api/v1/genre";
export const MOVIE_URL = "/api/v1/movies";
export const UPLOAD_URL = "/api/v1/upload";

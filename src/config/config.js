const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL_PROD;

console.log("API_BASE_URL:", API_BASE_URL);
export default API_BASE_URL;

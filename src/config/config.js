const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_URL_PROD}/api`
    : `${process.env.REACT_APP_API_URL}/api`;

export default API_BASE_URL;

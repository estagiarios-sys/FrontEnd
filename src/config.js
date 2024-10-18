const urlOrigin = window.location.hostname;

const API_URL = process.env.REACT_APP_API_URL;

export const linkFinal = `http://${urlOrigin}:8082${API_URL}`;
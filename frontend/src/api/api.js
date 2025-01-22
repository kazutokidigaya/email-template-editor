import axios from "axios";

const api = axios.create({
  baseURL: "https://email-template-editor.onrender.com",
});

export default api;

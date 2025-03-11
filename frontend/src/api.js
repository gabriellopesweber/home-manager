import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5002", // URL do backend
});

export default api;

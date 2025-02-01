import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.00.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default instance;

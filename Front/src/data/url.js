import axios from "axios";

export const url = axios.create({
    baseURL: "http://127.0.0.1:3000",
    });
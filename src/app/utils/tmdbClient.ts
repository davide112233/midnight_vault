import axios from "axios";

const tmdbClient = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: {
        api_key: process.env.NEXT_PUBLIC_API_KEY,
    },
});

export default tmdbClient;
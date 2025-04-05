import { create } from "zustand";
import tmdbClient from "./tmdbClient";

// Interfaccia per i video (trailers, teasers, ecc.)
interface VideoResult {
    key: string;
    site: string;
    type: string;
}

// Movie aggiornato con videos opzionale
export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    video: boolean;
    videos?: {
        results: VideoResult[];
    };
}

interface GenreState {
    genreId: number;
    setGenreId: (id: number) => void;
    movies: Movie[];
    movie: Movie | null;
    loading: boolean;
    fetchMoviesByGenre: (genreId?: number) => Promise<void>;
    fetchMovieById: (id: number) => Promise<void>;
}

export const useGenreStore = create<GenreState>((set, get) => ({
    genreId: 27,
    setGenreId: (id) => set({ genreId: id }),
    movies: [],
    movie: null,
    loading: false,

    fetchMoviesByGenre: async (genreId = get().genreId) => {
        try {
            const allMovies: Record<number, Movie> = {};
            const allMoviesLength = 40; // Reduce pages for performance, you can increase if needed
            set({ loading: true });

            for (let page = 1; page <= allMoviesLength; page++) {
                const response = await tmdbClient.get("/discover/movie", {
                    params: {
                        with_genres: genreId,
                        sort_by: "release_date.desc",
                        "release_date.lte": new Date().toISOString().split("T")[0],
                        language: "en-US",
                        region: "US",
                        page,
                    },
                });

                const result: Movie[] = response.data.results;

                const filtered = result.filter((movie) => movie.poster_path);

                for (const movie of filtered) {
                    try {
                        const videoResponse = await tmdbClient.get(`/movie/${movie.id}`, {
                            params: {
                                language: "en-US",
                                append_to_response: "videos",
                            },
                        });

                        const videos: VideoResult[] = videoResponse.data.videos?.results || [];
                        const hasTrailer = videos.some(
                            (v) => v.site === "YouTube" && v.type.toLowerCase() === "trailer"
                        );

                        if (hasTrailer) {
                            allMovies[movie.id] = {
                                ...movie,
                                videos: videoResponse.data.videos,
                            };
                        }
                    } catch (error) {
                        console.warn(`Failed to fetch videos for movie ID ${movie.id}`, error);
                    }
                }
            }

            set({ movies: Object.values(allMovies), loading: false });
        } catch (error) {
            console.error("An error occurred while fetching movies", error);
            set({ loading: false });
        }
    },

    fetchMovieById: async (id: number) => {
        try {
            set({ loading: true });

            console.log("Fetching movie with ID:", id); // Add logging here
            const response = await tmdbClient.get(`/movie/${id}`, {
                params: {
                    language: "en-US",
                    append_to_response: "videos",
                },
            });

            const movie: Movie = response.data;
            console.log("Fetched movie:", movie); // Log the fetched movie

            const isHorror = response.data.genres?.some((g: any) => g.id === 27);
            if (!isHorror) {
                console.warn("The movie isn't a horror movie.");
            }

            set({ movie, loading: false });
        } catch (error) {
            console.error("An error occurred while fetching the horror movie by id:", error);
            set({ loading: false });
        }
    },
}));

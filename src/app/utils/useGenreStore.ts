import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import tmdbClient from "./tmdbClient";

// Interface for video results (trailers, teasers, etc.)
interface VideoResult {
    key: string;
    site: string;
    type: string;
}

// Movie interface with optional videos
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

// Zustand store interface
interface GenreState {
    genreId: number;
    setGenreId: (id: number) => void;

    searchTerm: string;
    setSearchTerm: (term: string) => void;

    movie: Movie | null;
    loading: boolean;
    fetchMovieById: (id: number) => Promise<void>;

    fetchFranchiseMovies: (franchiseName: string, searchTerm: string) => Promise<Movie[]>;
}

// Zustand store definition
export const useGenreStore = create<GenreState>((set) => ({
    genreId: 27, // default to horror
    setGenreId: (id) => set({ genreId: id }),

    searchTerm: "",
    setSearchTerm: (term) => set({ searchTerm: term }),

    movie: null,
    loading: false,

    fetchMovieById: async (id: number) => {
        set({ loading: true });
        try {
            const response = await tmdbClient.get(`/movie/${id}`, {
                params: {
                    language: "en-US",
                    append_to_response: "videos",
                },
            });

            set({ movie: response.data });
        } catch (error) {
            console.error("Error fetching movie by ID:", error);
        } finally {
            set({ loading: false });
        }
    },

    // Modified fetchFranchiseMovies function to exclude unrelated movies
    fetchFranchiseMovies: async (franchiseName: string, searchTerm: string): Promise<Movie[]> => {
        const allMovies: Record<number, Movie> = {};
        const totalPages = 10; // Adjust the number of pages as necessary

        // Get genreId from Zustand store state
        const genreId = useGenreStore.getState().genreId;

        // Fetch movies related to the franchise while respecting genre filter
        for (let page = 1; page <= totalPages; page++) {
            const response = await tmdbClient.get("/search/movie", {
                params: {
                    query: franchiseName, // Franchise name like "Saw" or "Insidious"
                    with_genres: genreId, // Ensure the genre filter is applied
                    language: "en-US",
                    page,
                },
            });

            let movies: Movie[] = response.data.results.filter((m: Movie) => m.poster_path);

            // Optional: filter by searchTerm if provided
            if (searchTerm) {
                const lowerSearch = searchTerm.toLowerCase();
                movies = movies.filter((movie) => movie.title.toLowerCase().includes(lowerSearch));
            }

            // Filter out unrelated movies by ensuring franchiseName is in the title
            movies = movies.filter((movie) => movie.title.toLowerCase().includes(franchiseName.toLowerCase()));

            // Fetch trailers for each movie in parallel
            const trailerFetches = await Promise.all(
                movies.map(async (movie) => {
                    try {
                        const videoRes = await tmdbClient.get(`/movie/${movie.id}`, {
                            params: {
                                language: "en-US",
                                append_to_response: "videos",
                            },
                        });

                        const videos: VideoResult[] = videoRes.data.videos?.results || [];
                        const hasTrailer = videos.some(
                            (v) => v.site === "YouTube" && v.type.toLowerCase() === "trailer"
                        );

                        if (hasTrailer) {
                            return {
                                ...movie,
                                videos: videoRes.data.videos,
                            };
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch videos for movie ID ${movie.id}`, e);
                    }
                    return null;
                })
            );

            for (const m of trailerFetches.filter(Boolean) as Movie[]) {
                allMovies[m.id] = m;
            }
        }

        return Object.values(allMovies);
    },
}));

// Fetch all movies by genre (used in homepage or listing)
const fetchMoviesByGenre = async (genreId: number, searchTerm: string): Promise<Movie[]> => {
    const allMovies: Record<number, Movie> = {};
    const totalPages = 40;

    for (let page = 1; page <= totalPages; page++) {
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

        let movies: Movie[] = response.data.results.filter((m: Movie) => m.poster_path);

        // Optional: filter by searchTerm
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            movies = movies.filter((movie) => movie.title.toLowerCase().includes(lowerSearch));
        }

        // Fetch trailers for each movie in parallel
        const trailerFetches = await Promise.all(
            movies.map(async (movie) => {
                try {
                    const videoRes = await tmdbClient.get(`/movie/${movie.id}`, {
                        params: {
                            language: "en-US",
                            append_to_response: "videos",
                        },
                    });

                    const videos: VideoResult[] = videoRes.data.videos?.results || [];
                    const hasTrailer = videos.some(
                        (v) => v.site === "YouTube" && v.type.toLowerCase() === "trailer"
                    );

                    if (hasTrailer) {
                        return {
                            ...movie,
                            videos: videoRes.data.videos,
                        };
                    }
                } catch (e) {
                    console.warn(`Failed to fetch videos for movie ID ${movie.id}`, e);
                }
                return null;
            })
        );

        for (const m of trailerFetches.filter(Boolean) as Movie[]) {
            allMovies[m.id] = m;
        }
    }

    return Object.values(allMovies);
};

// Hook to use React Query with Zustand genreId and searchTerm
export const useMovies = () => {
    const genreId = useGenreStore((state) => state.genreId);
    const searchTerm = useGenreStore((state) => state.searchTerm);

    return useQuery({
        queryKey: ["movies", genreId, searchTerm],
        queryFn: () => fetchMoviesByGenre(genreId, searchTerm),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Updated hook to support both a single franchise or multiple franchises
export const useFranchiseMovies = (franchiseNames: string | string[]) => {
    const searchTerm = useGenreStore((state) => state.searchTerm);

    // Ensure franchiseNames is always an array
    const franchiseNamesArray = Array.isArray(franchiseNames) ? franchiseNames : [franchiseNames];

    return useQuery({
        queryKey: ["franchiseMovies", franchiseNamesArray, searchTerm],
        queryFn: async () => {
            const allFranchiseMovies: Movie[] = [];

            // Fetch movies for each franchise in parallel
            await Promise.all(
                franchiseNamesArray.map(async (franchiseName) => {
                    const movies = await useGenreStore.getState().fetchFranchiseMovies(
                        franchiseName,
                        searchTerm
                    );
                    allFranchiseMovies.push(...movies); // Merge the results
                })
            );

            return allFranchiseMovies; // Return the combined results
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

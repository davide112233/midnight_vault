// store/genreStore.ts
import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import tmdbClient from "../utils/tmdbClient";
import { Movie } from "./Movie";
import { VideoResult } from "./VideoResult";

export interface GenreStore {
  genreId: number;
  setGenreId: (id: number) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  selectedFranchise: string;
  setSelectedFranchise: (franchise: string) => void;

  movie: Movie | null;
  loading: boolean;
  fetchMovieById: (id: number) => Promise<void>;

  fetchFranchiseMovies: (franchiseName: string, searchTerm: string) => Promise<Movie[]>;

  page: number;
  setPage: (page: number) => void; // New method to set the page
}

export const useGenreStore = create<GenreStore>((set) => ({
  genreId: 27,
  setGenreId: (id) => set({ genreId: id }),

  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),

  movie: null,
  loading: false,

  selectedFranchise: "insidious",
  setSelectedFranchise: (franchise) => set({ selectedFranchise: franchise }),

  page: 1, // Initial page state
  setPage: (page) => set({ page }), // Set page function

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
  fetchFranchiseMovies: async (franchiseName: string, searchTerm: string): Promise<Movie[]> => {
    try {
      // Special case for Saw: use collection ID 656
      let collectionId: number | null = null;

      if (franchiseName.toLowerCase() === "saw") {
        collectionId = 656;
      } else {
        const collectionSearch = await tmdbClient.get("/search/collection", {
          params: {
            query: franchiseName,
            language: "en-US",
          },
        });

        const collections = collectionSearch.data.results;

        const matchedCollection = collections.find(
          (c: any) => c.name.toLowerCase() === franchiseName.toLowerCase()
        ) || collections[0];

        if (!matchedCollection) {
          console.warn(`No matching collection found for: ${franchiseName}`);
          return [];
        }

        collectionId = matchedCollection.id;
      }

      const collectionDetails = await tmdbClient.get(`/collection/${collectionId}`, {
        params: { language: "en-US" },
      });

      let movies: Movie[] = collectionDetails.data.parts.filter((m: Movie) => m.poster_path);

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        movies = movies.filter((movie) =>
          movie.title.toLowerCase().includes(lowerSearch)
        );
      }

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

      return trailerFetches.filter(Boolean) as Movie[];
    } catch (error) {
      console.error("Error fetching franchise movies:", error);
      return [];
    }
  }
}));

const fetchMoviesByGenre = async (genreId: number, searchTerm: string, page: number): Promise<{ movies: Movie[]; totalPages: number }> => {
  const response = await tmdbClient.get("/discover/movie", {
    params: {
      with_genres: genreId,
      sort_by: "release_date.desc",
      "release_date.lte": new Date().toISOString().split("T")[0],
      language: "en-US",
      region: "US",
      page: page, // Use current page
      "per_page": 10, // Limit the number of movies per page
    },
  });

  let movies: Movie[] = response.data.results.filter((m: Movie) => m.poster_path);

  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    movies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(lowerSearch)
    );
  }

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

  return {
    movies: trailerFetches.filter(Boolean) as Movie[], // Return the filtered movies
    totalPages: 40,
    //totalPages: response.data.total_pages, // Return the total pages from the TMDB API
  };
};

export const useGenreMovies = () => {
  const genreId = useGenreStore((state) => state.genreId);
  const searchTerm = useGenreStore((state) => state.searchTerm);
  const currentPage = useGenreStore((state) => state.page);

  return useQuery({
    queryKey: ["movies", genreId, searchTerm, currentPage],
    queryFn: () => fetchMoviesByGenre(genreId, searchTerm, currentPage),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFranchiseMovies = (franchiseNames: string | string[]) => {
  const searchTerm = useGenreStore((state) => state.searchTerm);
  const franchiseNamesArray = Array.isArray(franchiseNames) ? franchiseNames : [franchiseNames];

  return useQuery({
    queryKey: ["franchiseMovies", franchiseNamesArray, searchTerm],
    queryFn: async () => {
      const allFranchiseMovies: Movie[] = [];

      await Promise.all(
        franchiseNamesArray.map(async (franchiseName) => {
          const movies = await useGenreStore.getState().fetchFranchiseMovies(
            franchiseName,
            searchTerm
          );
          allFranchiseMovies.push(...movies);
        })
      );

      return allFranchiseMovies;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const fetchMoviesByNames = async (movieNames: string[]): Promise<Movie[]> => {
  const movies: Movie[] = [];

  for (const name of movieNames) {
    try {
      const response = await tmdbClient.get("/search/movie", {
        params: {
          query: name,
          language: "en-US",
        },
      });

      const results: Movie[] = response.data.results;
      const movie = results.find((m) => m.poster_path); // get first with a poster

      if (movie) {
        movies.push(movie);
      }
    } catch (error) {
      console.warn(`Failed to fetch movie: ${name}`, error);
    }
  }

  return movies;
};

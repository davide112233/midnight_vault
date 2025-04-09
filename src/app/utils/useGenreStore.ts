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
  setPage: (page: number) => void;
}

export const useGenreStore = create<GenreStore>((set) => ({
  genreId: 27,
  setGenreId: (id) => set({ genreId: id }),

  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),

  selectedFranchise: "insidious",
  setSelectedFranchise: (franchise) => set({ selectedFranchise: franchise }),

  movie: null,
  loading: false,

  page: 1,
  setPage: (page) => set({ page }),

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
      const response = await tmdbClient.get("/search/collection", {
        params: {
          query: franchiseName,
          language: "en-US",
        },
      });

      const collections = response.data.results;
      const matchingCollection = collections.find((c: any) =>
        c.name.toLowerCase().includes(franchiseName.toLowerCase())
      );

      if (!matchingCollection) return [];

      const collectionResponse = await tmdbClient.get(
        `/collection/${matchingCollection.id}`,
        { params: { language: "en-US" } }
      );

      let movies = collectionResponse.data.parts || [];

      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        movies = movies.filter((movie: Movie) =>
          movie.title.toLowerCase().includes(lowerSearch)
        );
      }

      return movies;
    } catch (error) {
      console.error("Error fetching franchise movies:", error);
      return [];
    }
  },
}));

const fetchMoviesByGenre = async (
  genreId: number,
  searchTerm: string,
  page: number
): Promise<{ movies: Movie[]; totalPages: number }> => {
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
          params: { language: "en-US", append_to_response: "videos" },
        });

        const videos: VideoResult[] = videoRes.data.videos?.results || [];
        const hasTrailer = videos.some(
          (v) => v.site === "YouTube" && v.type.toLowerCase() === "trailer"
        );

        if (hasTrailer) {
          return { ...movie, videos: videoRes.data.videos };
        }
      } catch (e) {
        console.warn(`Failed to fetch videos for movie ID ${movie.id}`, e);
      }
      return null;
    })
  );

  const filteredMovies = trailerFetches.filter(Boolean) as Movie[];

  return {
    movies: filteredMovies,
    totalPages: response.data.total_pages,
  };
};

export const useGenreMovies = () => {
  const genreId = useGenreStore((state) => state.genreId);
  const searchTerm = useGenreStore((state) => state.searchTerm);
  const page = useGenreStore((state) => state.page);

  return useQuery({
    queryKey: ["movies", genreId, searchTerm, page],
    queryFn: () => fetchMoviesByGenre(genreId, searchTerm, page),
    staleTime: 1000 * 60 * 5,
    select: (data) => data,
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


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

  movie: Movie | null;
  loading: boolean;
  fetchMovieById: (id: number) => Promise<void>;

  fetchFranchiseMovies: (franchiseName: string, searchTerm: string) => Promise<Movie[]>;
}

export const useGenreStore = create<GenreStore>((set) => ({
  genreId: 27,
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

    for (const m of trailerFetches.filter(Boolean) as Movie[]) {
      allMovies[m.id] = m;
    }
  }

  return Object.values(allMovies);
};

export const useGenreMovies = () => {
  const genreId = useGenreStore((state) => state.genreId);
  const searchTerm = useGenreStore((state) => state.searchTerm);

  return useQuery({
    queryKey: ["movies", genreId, searchTerm],
    queryFn: () => fetchMoviesByGenre(genreId, searchTerm),
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

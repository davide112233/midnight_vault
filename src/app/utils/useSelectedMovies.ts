import { useQuery } from "@tanstack/react-query";
import { fetchMoviesByNames } from "./useGenreStore";
import { Movie } from "./Movie";

export const useSelectedMovies = (movieNames: string[]) => {
    return useQuery<Movie[]>({
        queryKey: ["selectedMovies", movieNames],
        queryFn: () => fetchMoviesByNames(movieNames),
        staleTime: 1000 * 60 * 5,
    });
};

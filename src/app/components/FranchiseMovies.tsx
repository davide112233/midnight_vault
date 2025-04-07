"use client";

import { useFranchiseMovies } from "../utils/useGenreStore";

const FranchiseMovies = () => {
    const { data, isLoading, error } = useFranchiseMovies(["Insidious", "The conjuring", "Friday the 13th"]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching franchise movies</div>;

    return (
        <div>
            <h2>Franchise Movies</h2>
            <div>
                {data?.map((movie) => (
                    <div key={movie.id}>
                        <h3>{movie.title}</h3>
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FranchiseMovies;

/*
quando metto un franchise generico come saw si incasina
*/
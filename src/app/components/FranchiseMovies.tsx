"use client";

import { useEffect, useState } from "react";
import { Card, CardActionArea, CardMedia } from "@mui/material";
import { useFranchiseMovies } from "../utils/useGenreStore";
import { useRouter } from "next/navigation";

const FranchiseMovies = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { data, isLoading, error } = useFranchiseMovies(["hellraiser", "insidious", "resident evil", "saw", "the conjuring", "paranormal activity"]);

    // Ensure the component is mounted before using useRouter
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // Don't render until mounted
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching franchise movies</div>;

    return (
        <div>
            <h2>Franchise Movies</h2>
            <div>
                {data?.map((movie) => (
                    <Card key={movie.id}>
                        <CardActionArea onClick={() => router.push(`movieDetails/${movie.id}`)}>
                            <CardMedia
                                component="img"
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                sx={{ height: { xl: "25rem", xs: "100%", sm: "25rem" } }}
                            />
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FranchiseMovies;

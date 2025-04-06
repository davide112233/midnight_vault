"use client";

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardMedia,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useGenreStore } from "@/app/utils/useGenreStore";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { theme } from "@/app/utils/theme";

export default function MovieDetails() {
    const { movie, fetchMovieById, loading } = useGenreStore();
    const { id } = useParams();
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true after the component mounts
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (id) {
            fetchMovieById(Number(id));
        }
    }, [id]);

    if (!isClient || loading || !movie) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const trailer = movie.videos?.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    return (
        <Box sx={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "5rem", minHeight: "100vh" }}>
            <Grid sx={{ display: "flex", flexDirection: { xl: "row", md: "row", sm: "row", xs: "column" }, justifyContent: { xl: "space-between", md: "center", xs: "center" }, gap: "1rem" }}>
                <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: { xl: "22.5rem", sm: "18rem", md: "25rem" }, height: { xl: "33rem" }, borderWidth: "3px", borderStyle: "solid", borderRadius: "0rem", padding: "0.25rem", backgroundColor: theme.palette.primary.main, borderColor: theme.palette.primary.main }}>
                    <CardMedia component="img" image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} sx={{ objectFit: "cover", height: "100%" }} />
                </Card>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary, textAlign: { xl: "start", md: "start", sm: "start", xs: "center" }, fontSize: "large" }}>
                    {DOMPurify.sanitize(movie.overview)}
                </Typography>
            </Grid>
            <Grid sx={{ display: "flex", justifyContent: "center" }}>
                {trailer ? (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            allowFullScreen
                            title="Trailer"
                            style={{ width: "40rem", height: "25rem", objectFit: "cover" }}
                        ></iframe>
                    </Box>
                ) : (
                    <CircularProgress />
                )}
            </Grid>
        </Box>
    );
}


/*
<Box padding={4} display="flex" flexDirection="column" gap={4}>
            <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ width: { xs: "100%", md: 300 }, height: "auto", objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h4" gutterBottom>{movie.title}</Typography>
                    <Typography variant="body1" gutterBottom>{movie.overview}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Release date: {movie.release_date}
                    </Typography>
                </CardContent>
            </Card>
            {trailer ? (
                <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        frameBorder="0"
                        allowFullScreen
                        title="Trailer"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}
                    ></iframe>
                </Box>
            ) : (
                <Typography>No trailer available.</Typography>
            )}
        </Box>
*/
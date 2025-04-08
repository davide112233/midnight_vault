"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useSelectedMovies } from '../utils/useSelectedMovies';
import { Box, CircularProgress } from '@mui/material';
import DOMPurify from "isomorphic-dompurify";
import { theme } from '../utils/theme';

export default function LandingMovies() {
    const movieNames = ["the soul eater", "insidious"]; // scegliere i film horror da visualizzare

    const { data: movies, isLoading, error } = useSelectedMovies(movieNames);

    if (isLoading) return <CircularProgress />
    if (error) return <Typography variant="body1">{DOMPurify.sanitize("An error occured while trying fetching the selected movies")}</Typography>;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "0.7rem", gap: "0.8rem", width: { xl: "48rem" } }}>
            {movies?.map((movie) => (
                <Card key={movie.id} sx={{
                    width: { xl: "15rem", md: "16.7rem", sm: "18rem", xs: "100%" },
                    minHeight: "fit-content",
                    borderWidth: "3px",
                    borderStyle: "solid",
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "0rem",
                    padding: "0.25rem",
                    boxShadow: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            sx={{ minHeight: "100%", objectFit: "cover" }}
                        />
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}

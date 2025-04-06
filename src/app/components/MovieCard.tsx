"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import { CircularProgress, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { useMovies } from "../utils/useGenreStore";
import { theme } from "../utils/theme";

export default function MovieCard() {
  const router = useRouter();
  const { data: movies, isLoading, isError } = useMovies();

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (isError || !movies || movies.length === 0)
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        {DOMPurify.sanitize("The vault is empty")}
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mt: 2,
      }}
    >
      {movies.map((movie) => (
        <Card
          key={movie.id}
          sx={{
            width: "100%",
            minHeight: "100%",
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
          }}
        >
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
    </Box>
  );
}

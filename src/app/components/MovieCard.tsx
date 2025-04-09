"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import { CircularProgress, Typography, Box, Pagination } from "@mui/material";
import { useRouter } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { useGenreMovies } from "../utils/useGenreStore";
import { useGenreStore } from "../utils/useGenreStore";
import { theme } from "../utils/theme";

export default function MovieCard() {
  const router = useRouter();
  const { data, isLoading, isError } = useGenreMovies();
  const setPage = useGenreStore((state) => state.setPage);
  const currentPage = useGenreStore((state) => state.page);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (isError || !data?.movies || data.movies.length === 0)
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        {DOMPurify.sanitize("The vault is empty")}
      </Typography>
    );

  return (
    <Box sx={{ mt: 2 }}>
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
        }}
      >
        {data.movies.map((movie) => (
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={Math.min(data.totalPages, 40)} // TMDB only allows up to page 500
          page={currentPage}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

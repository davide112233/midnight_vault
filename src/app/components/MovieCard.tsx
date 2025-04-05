"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { useGenreStore } from '../utils/useGenreStore';
import { CircularProgress, Typography } from '@mui/material';
import { theme } from '../utils/theme';
import { useRouter } from 'next/navigation';
import DOMPurify from "isomorphic-dompurify";

export default function MovieCard() {
  const { movies, fetchMoviesByGenre, loading } = useGenreStore();

  const router = useRouter();

  React.useEffect(() => {
    if(typeof window !== "undefined") {
      fetchMoviesByGenre(); 
    }
  }, []);  

  if(loading) return <CircularProgress />;

  if(!movies || movies.length === 0) return <Typography variant='body1'>{DOMPurify.sanitize("The vault is empty")}</Typography>

  return (
    <>
        {movies.map((movie) => (
            <Card sx={{ width: { xl: "18rem", xs: "100%", sm: "16.2rem" }, minHeight: "100%", borderWidth: "3px", borderStyle: "solid", borderColor: theme.palette.primary.main, backgroundColor: theme.palette.primary.main, borderRadius: "0rem", padding: "0.25rem", boxShadow: "none", display: "flex", flexDirection: "column", justifyContent: "center" }} key={movie.id}>
              <CardActionArea onClick={() => router.push(`movieDetails/${movie.id}`)}>
                <CardMedia component="img" image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} sx={{ height: { xl: "25rem", xs: "100%", sm: "25rem" } }} />
              </CardActionArea>
            </Card>
        ))}
    </>
  );
}
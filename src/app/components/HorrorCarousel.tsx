"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Box, Typography, Card, CardMedia } from "@mui/material";
import { theme } from "../utils/theme";
import { useSelectedMovies } from "../utils/useSelectedMovies";

const HorrorCarousel: React.FC = () => {
  const movieNames = ["Insidious", "The Conjuring", "Saw x", "Hereditary", "The Nun"]; // scegliere i film horror da visualizzare

  const { data: movies, isLoading, error } = useSelectedMovies(movieNames);

  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  if (isLoading) return <Typography>Loading selected horror movies...</Typography>;
  if (error) return <Typography>Failed to load selected movies</Typography>;

  return (
    <Box ref={emblaRef} sx={{ overflow: "hidden", marginTop: "4.6rem" }}>
      <Box sx={{ display: "flex" }}>
        {movies?.map((movie) => (
          <Box key={movie.id} sx={{ flex: "0 0 100%" }}>
            <Card
              sx={{
                width: "100%",
                height: "30rem",
                margin: "0 auto",
                borderRadius: 0,
                backgroundColor: theme.palette.primary.main,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.3rem",
              }}
            >
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{
                  width: { xl: "40rem" },
                  height: "100%",
                  objectFit: "cover",
                  backgroundSize: "cover",
                  borderRadius: 0,
                  borderWidth: "5px",
                  borderStyle: "solid",
                  borderColor: theme.palette.text.primary,
                }}
              />
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HorrorCarousel;

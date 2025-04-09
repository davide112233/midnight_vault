"use client";

import { useEffect } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFranchiseMovies } from "../utils/useGenreStore";
import { useRouter } from "next/navigation";
import { theme } from "../utils/theme";
import { useMountedStore } from "../utils/useMountedStore";
import DOMPurify from "isomorphic-dompurify";
import FranchiseFilter from "../components/FranchiseFilter";
import { useGenreStore } from "../utils/useGenreStore";
import { motion } from "framer-motion";

const FranchiseMovies = () => {
  const { isMounted, setMounted } = useMountedStore();
  const router = useRouter();
  const selectedFranchise = useGenreStore((state) => state.selectedFranchise);

  const franchises =
    selectedFranchise === "all"
      ? ["hellraiser", "insidious", "resident evil", "saw", "the conjuring", "paranormal activity"] // riordinare i franchise qui, non c'entra con l'ordinamento nell'app
      : [selectedFranchise];

  const { data, isLoading, error } = useFranchiseMovies(franchises);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) return null;
  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Typography>{DOMPurify.sanitize("Something went wrong loading the vault.")}</Typography>
    );

  return (
    <>
      <FranchiseFilter />

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
        {data?.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, duration: 0.35, damping: 10, delay: index * 1 }}
          >
            <Card
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
          </motion.div>
        ))}
      </Box>
    </>
  );
};

export default FranchiseMovies;

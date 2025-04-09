import { Box, CircularProgress, Typography, Pagination, Card, CardActionArea, CardMedia } from "@mui/material";
import { useRouter } from "next/navigation";
import { theme } from "../utils/theme";
import { useGenreMovies, useGenreStore } from "../utils/useGenreStore";
import { useMountedStore } from "../utils/useMountedStore"; // Import your store

export default function MovieCard() {
  const { isMounted, setMounted } = useMountedStore();
  const router = useRouter();
  const { data, isLoading, isError } = useGenreMovies();
  const setPage = useGenreStore((state) => state.setPage);
  const currentPage = useGenreStore((state) => state.page);

  // Check if the component is mounted on the client side
  if (!isMounted) {
    // Set mounted to true once the component is mounted
    setMounted(true);
    return null; // Return nothing initially on the server
  }

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (isError || !data || data.movies.length === 0)
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        {"The vault is empty"}
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
          count={data.totalPages} // Use totalPages from the API response
          page={currentPage}
          onChange={(event, value) => setPage(value)} // Set page correctly
          color="primary"
        />
      </Box>
    </Box>
  );
}

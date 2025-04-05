import { Box } from "@mui/material";
import DrawerAppBar from "./components/DrawerAppbar";
import MovieCard from "./components/MovieCard";

export default function Home() {
  return (
    <>
      <DrawerAppBar />
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.2rem", padding: "2rem", marginTop: "6rem" }}>
        <MovieCard />
      </Box>
    </>
  );
}
import { Box } from "@mui/material";
import DrawerAppBar from "./components/DrawerAppbar";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar"; // ✅ Import SearchBar component

export default function Home() {
  return (
    <>
      <DrawerAppBar />
      <Box sx={{ marginTop: "6.5rem", display: "flex", justifyContent: "center" }}>
        <SearchBar />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.2rem", padding: "2rem" }}>
        <MovieCard />
      </Box>
    </>
  );
}

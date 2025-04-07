import { Box } from "@mui/material";
import DrawerAppBar from "../components/DrawerAppbar";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";

export default function Recents() {
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

import { Box } from "@mui/material";
import DrawerAppBar from "../components/DrawerAppbar";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import DOMPurify from "isomorphic-dompurify";

export default function Recents() {
    const customPlaceholder = "The most recents...";

    return (
        <>
            <DrawerAppBar />
            <Box sx={{ marginTop: "6.5rem", display: "flex", justifyContent: "center" }}>
                <SearchBar placeholder={DOMPurify.sanitize(customPlaceholder)} />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.2rem", padding: "2rem" }}>
                <MovieCard />
            </Box>
        </>
    );
}

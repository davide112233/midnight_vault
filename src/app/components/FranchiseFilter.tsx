"use client";

import { Box, Button } from "@mui/material";
import { useGenreStore } from "../utils/useGenreStore";
import { theme } from "../utils/theme";
import DOMPurify from "isomorphic-dompurify";

const franchiseOptions = [
    "insidious",
    "resident evil",
    "saw",
    "the conjuring",
    "paranormal activity",
    "hellraiser"
];

const FranchiseFilter = () => {
    const { selectedFranchise, setSelectedFranchise } = useGenreStore();

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.2rem" }}>
            {franchiseOptions.map((franchise) => (
                <Button key={franchise} onClick={() => setSelectedFranchise(franchise)} variant="contained" size="large" sx={{ backgroundColor: selectedFranchise === franchise ? theme.palette.text.primary : theme.palette.primary.main, color: selectedFranchise === franchise ? theme.palette.background.paper : theme.palette.text.primary, fontSize: "larger", width: { xl: "13rem", sm: "13rem", xs: "100%" }, textAlign: "center" }}>{DOMPurify.sanitize(franchise.charAt(0).toUpperCase() + franchise.slice(1))}</Button>
            ))}
        </Box>
    );
}

export default FranchiseFilter;
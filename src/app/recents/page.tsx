"use client";

import { Box } from "@mui/material";
import DrawerAppBar from "../components/DrawerAppbar";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import DOMPurify from "isomorphic-dompurify";
import { motion } from "framer-motion";

export default function Recents() {
    const customPlaceholder = "search on this page...";

    const pageVariants = {
        initial: {
            opacity: 0,
            x: -100,
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            x: 100,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            key="recents-page"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
        >
            <DrawerAppBar />
            <Box sx={{ marginTop: "6.5rem", display: "flex", justifyContent: "center" }}>
                <SearchBar placeholder={DOMPurify.sanitize(customPlaceholder)} />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.2rem", padding: "2rem" }}>
                <MovieCard />
            </Box>
        </motion.div>
    );
}

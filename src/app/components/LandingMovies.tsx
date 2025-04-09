"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useSelectedMovies } from '../utils/useSelectedMovies';
import { Box, CircularProgress } from '@mui/material';
import DOMPurify from "isomorphic-dompurify";
import { theme } from '../utils/theme';
import { useRouter } from 'next/navigation';
import { useMountedStore } from '../utils/useMountedStore';
import { motion } from 'framer-motion';

export default function LandingMovies() {
    const { isMounted, setMounted } = useMountedStore();

    const movieNames = ["insidious 2", "resident evil vendetta", "saw iii", "the conjuring 2", "paranormal activity the ghost dimension", "hellraiser revelations"];

    const { data: movies, isLoading, error } = useSelectedMovies(movieNames);

    const router = useRouter();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!isMounted) return null;
    if (isLoading) return <CircularProgress />
    if (error) return <Typography variant="body1">{DOMPurify.sanitize("An error occured while trying fetching the selected movies")}</Typography>;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: { xl: "start", md: "start", xs: "center" }, alignItems: "center", gap: "1.3rem", width: { xl: "48rem" }, marginBottom: "1rem", marginTop: { xs: "1rem" } }}>
            {movies?.map((movie, index) => (
                <motion.div
                    key={movie.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, duration: 2, damping: 10, delay: index * 1 }}
                >
                    <Card sx={{
                        width: { xl: "15rem", md: "16.7rem", sm: "18.7rem", xs: "15rem" },
                        minHeight: "fit-content",
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
                    }}>
                        <CardActionArea onClick={() => router.push(`movieDetails/${movie.id}`)}>
                            <CardMedia
                                component="img"
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                sx={{ minHeight: "100%", objectFit: "cover" }}
                            />
                        </CardActionArea>
                    </Card>
                </motion.div>
            ))}
        </Box>
    );
}

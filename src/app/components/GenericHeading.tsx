"use client";

import { Box, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { theme } from "../utils/theme";
import { Typewriter } from "react-simple-typewriter";
import { useEffect } from "react";
import { useTypingStore } from "../utils/typingStore";

export default function GenericHeading() {
    const headingTitle = "the best movies of the franchises";
    const setHasFinishedTypingTitle = useTypingStore((state) => state.setHasFinishedTypingTitle);

    useEffect(() => {
        const titleLength = headingTitle.length;
        const typeSpeed = 15;
        const delaySpeed = 500;
        const totalTypingTime = titleLength * typeSpeed + delaySpeed;
        const timer = setTimeout(() => {
            setHasFinishedTypingTitle(true);
        }, totalTypingTime);
        return () => clearTimeout(timer);
    }, [setHasFinishedTypingTitle]);

    return (
        <Box sx={{ marginTop: "2rem", marginBottom: "1.3rem" }}>
            <Typography variant="h3" sx={{ color: theme.palette.text.primary, textAlign: { xl: "start", lg: "start", md: "center", sm: "center", xs: "center" } }}>
                <Typewriter
                    words={[DOMPurify.sanitize(headingTitle)]}
                    typeSpeed={15}
                    deleteSpeed={0}
                    delaySpeed={500}
                />
            </Typography>
        </Box>
    );
}
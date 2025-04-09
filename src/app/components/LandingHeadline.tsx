"use client";

import { Box, Grid, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { theme } from "../utils/theme";
import LandingMovies from "./LandingMovies";
import GenericHeading from "./GenericHeading";
import { Typewriter } from "react-simple-typewriter";
import { useTypingStore } from "../utils/typingStore";

export default function LandingHeadline() {

    const landingDescription = "you're entering a creepy atmosphere, beware of what you're watching... Dangers attends you, discover them by exploring this stack of horror movies, from the recent to the best movies of famous franchises like insidious or saw";

    const hasFinishedTypingTitle = useTypingStore((state) => state.hasFinishedTypingTitle);

    return (
        <Box sx={{ marginTop: "5rem", display: "flex", flexDirection: "column" }}>
            <Grid>
                <GenericHeading />
            </Grid>
            <Grid sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: { sm: "1rem", xs: "1rem", md: "1rem" }, marginTop: "0.8rem" }}>
                {hasFinishedTypingTitle && (
                    <Typography variant="body1" sx={{ width: { xl: "38rem" }, textAlign: { xs: "center", xl: "start" }, fontSize: "large" }} color={theme.palette.text.primary}>
                        <Typewriter
                            words={[DOMPurify.sanitize(landingDescription)]}
                            typeSpeed={15}
                            deleteSpeed={0}
                            delaySpeed={500}
                        />
                    </Typography>
                )}
                <LandingMovies />
            </Grid>
        </Box>
    );
}

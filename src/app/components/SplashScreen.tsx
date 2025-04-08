// components/SplashScreen.tsx
"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useSplashStore } from "../utils/useSplashStore";
import DOMPurify from "isomorphic-dompurify";
import { theme } from "../utils/theme";

const SplashScreen: React.FC = () => {
    const { isVisible, hide } = useSplashStore();

    const splashScreenHeadline = "Getting you inside the vault";

    useEffect(() => {
        const timer = setTimeout(() => {
            hide();
        }, 3840); // Adjust duration as needed
        return () => clearTimeout(timer);
    }, [hide]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        position: "fixed",
                        zIndex: 1300,
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fff",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1.5rem" }}>
                        <Typography variant="h4" fontFamily="Creepster" sx={{ textAlign: "center" }}>
                            {DOMPurify.sanitize(splashScreenHeadline)}
                        </Typography>
                        <CircularProgress sx={{ color: theme.palette.primary.main }} thickness={2.7} size={140} />
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;

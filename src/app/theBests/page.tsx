"use client";

import { Box } from "@mui/material";
import DrawerAppBar from "../components/DrawerAppbar";
import FranchiseMovies from "../components/FranchiseMovies";
import { motion } from "framer-motion";

export default function TheBests() {
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
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.2rem", padding: "2rem", marginTop: "4.3rem" }}>
        <FranchiseMovies />
      </Box>
    </motion.div>
  );
}

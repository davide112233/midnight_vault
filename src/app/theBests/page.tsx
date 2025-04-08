import { Box } from "@mui/material";
import DrawerAppBar from "../components/DrawerAppbar";
import FranchiseMovies from "../components/FranchiseMovies";

export default function TheBests() {
  return (
    <>
      <DrawerAppBar />
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.2rem", padding: "2rem", marginTop: "4.3rem" }}>
        <FranchiseMovies />
      </Box>
    </>
  );
}

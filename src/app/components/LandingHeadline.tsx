import { Box, Grid, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { theme } from "../utils/theme";
import LandingMovies from "./LandingMovies";
import GenericHeading from "./GenericHeading";

export default function LandingHeadline() {

    const landingDescription = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga vitae ea neque perspiciatis est cumque ad. Quasi consectetur velit inventore, odio natus rerum dicta hic quis dolores quia necessitatibus ut.Libero vel sit totam adipisci nam hic tenetur ut accusantium, quos quo laboriosam modi non quae autem quisquam laudantium, veritatis nemo dolor? Culpa minima sit delectus? Earum voluptas enim quaerat.Modi tempora iste itaque quasi eum, excepturi placeat id, vel laborum nam alias officiis esse nesciunt? Placeat minima dolor nobis quibusdam! Aut, mollitia minus ipsam nesciunt necessitatibus sapiente dolorum deserunt?";

    return (
        <Box sx={{ marginTop: "5rem", display: "flex", flexDirection: "column" }}>
            <Grid>
                <GenericHeading />
            </Grid>
            <Grid sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: { sm: "1rem", xs: "1rem", md: "1rem" }, marginTop: "0.8rem" }}>
                <Typography variant="body1" sx={{ width: { xl: "38rem" }, textAlign: { xs: "center", xl: "start" } }} color={theme.palette.text.primary}>{DOMPurify.sanitize(landingDescription)}</Typography>
                <LandingMovies />
            </Grid>
        </Box>
    );
}

import { Box, Typography } from "@mui/material";
import DOMPurify from "isomorphic-dompurify";
import { theme } from "../utils/theme";

export default function GenericHeading() {
    const headingTitle = "the best movies of the franchises";

    return (
        <Box sx={{ marginTop: "2rem", marginBottom: "1.3rem" }}>
            <Typography variant="h3" sx={{ color: theme.palette.text.primary, textAlign: { xl: "start", lg: "start", md: "center", sm: "center", xs: "center" } }}>{DOMPurify.sanitize(headingTitle)}</Typography>
        </Box>
    );
}
// RootLayout.tsx (or .js)
"use client";

import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import { creepster, theme } from "./utils/theme";
import { metadata } from "./utils/metaData";
import DOMPurify from "isomorphic-dompurify";
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>{DOMPurify.sanitize(metadata.title)}</title>
      <meta name={DOMPurify.sanitize(metadata.description)}></meta>
      <meta name={DOMPurify.sanitize(metadata.keywords)}></meta>
      <meta name={DOMPurify.sanitize(metadata.author)}></meta>
      <meta name={DOMPurify.sanitize(metadata.robots)}></meta>
      <meta name={DOMPurify.sanitize(metadata.viewport)}></meta>
      <meta name={DOMPurify.sanitize(metadata.type)}></meta>
      <body className={creepster.className}>
        {/* Wrap the body content with ThemeProvider to apply the custom theme globally */}
        <ThemeProvider theme={theme}>
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}

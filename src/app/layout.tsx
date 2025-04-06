// app/layout.tsx
"use client";

import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles"; 
import { creepster, theme } from "./utils/theme";
import { metadata } from "./utils/metaData";
import DOMPurify from "isomorphic-dompurify";
import Providers from "./utils/providers";
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>{DOMPurify.sanitize(metadata.title)}</title>
      <meta name={DOMPurify.sanitize(metadata.description)} />
      <meta name={DOMPurify.sanitize(metadata.keywords)} />
      <meta name={DOMPurify.sanitize(metadata.author)} />
      <meta name={DOMPurify.sanitize(metadata.robots)} />
      <meta name={DOMPurify.sanitize(metadata.viewport)} />
      <meta name={DOMPurify.sanitize(metadata.type)} />
      <body className={creepster.className}>
        <Providers> {/* ✅ React Query Provider */}
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
        </Providers>
      </body>
    </html>
  );
}

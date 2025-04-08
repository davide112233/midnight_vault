// app/layout.tsx
"use client";

import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { creepster, theme } from "./utils/theme";
import { metadata } from "./utils/metaData";
import DOMPurify from "isomorphic-dompurify";
import Providers from "./utils/providers";
import SplashScreen from "./components/SplashScreen";
import { useSplashStore } from "./utils/useSplashStore";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSplashVisible = useSplashStore((state) => state.isVisible); // ✅ reactive state

  return (
    <html lang="en">
      <head>
        <title>{DOMPurify.sanitize(metadata.title)}</title>
        <meta name="description" content={DOMPurify.sanitize(metadata.description)} />
        <meta name="keywords" content={DOMPurify.sanitize(metadata.keywords)} />
        <meta name="author" content={DOMPurify.sanitize(metadata.author)} />
        <meta name="robots" content={DOMPurify.sanitize(metadata.robots)} />
        <meta name="viewport" content={DOMPurify.sanitize(metadata.viewport)} />
        <meta name="type" content={DOMPurify.sanitize(metadata.type)} />
      </head>
      <body className={creepster.className}>
        <SplashScreen />
        <Providers>
          <ThemeProvider theme={theme}>
            <Container
              maxWidth="xl"
              sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                minHeight: "100vh",
                flexGrow: 1,
              }}
            >
              {!isSplashVisible && children}
            </Container>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

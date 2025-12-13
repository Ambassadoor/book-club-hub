import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { GlobalStyles, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { DarkModeManager } from "./styles/DarkModeThemeProvider";
import {theme} from "../theme"
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
        <ThemeProvider theme={theme}>
          <DarkModeManager>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </DarkModeManager>
        </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
);

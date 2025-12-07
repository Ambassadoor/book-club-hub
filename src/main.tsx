import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import ToggleColorMode from "./App";
import { GlobalStyles, StyledEngineProvider } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <BrowserRouter>
        <ToggleColorMode />
      </BrowserRouter>
    </StyledEngineProvider>
  </StrictMode>,
);

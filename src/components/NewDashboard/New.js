
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import NewDashBoard from "./scenes/dashboard/NewDashBoard";
import NewVoters from "./scenes/voters/NewVoters";
import NewCandidates from "./scenes/candidates/NewCandidates"; 
import "./New.css";

function New() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="appNew">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<NewDashBoard />} />
              <Route path="/voters" element={<NewVoters />} />
              <Route path="/candidates" element={<NewCandidates />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default New;


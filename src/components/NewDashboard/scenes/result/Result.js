import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import BarChart from "../../newComponents/BarChart";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";

const Result = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <main
            className="content"
            style={{
              flexGrow: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Topbar />
            <Box m="20px">
              <Header title="RESULTS" subtitle="Election Result" />
              <Box height="75vh">
                <BarChart />
              </Box>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Result;

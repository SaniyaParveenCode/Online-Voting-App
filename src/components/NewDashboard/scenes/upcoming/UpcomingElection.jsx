import { useState, useEffect } from "react";
import { Box, Button, CssBaseline, ThemeProvider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ColorModeContext, useMode } from "../../theme";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";

const UpcomingElection = () => {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

  const [elections, setElections] = useState([]);

  // ✅ Fetch candidates/elections from backend
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/candidates");
        const data = await res.json();

        // Ensure status field exists
        const updated = data.map((e) => ({
          ...e,
          status: e.status || "upcoming",
        }));

        setElections(updated);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchElections();
  }, []);

  // ✅ Start/Stop election (updates backend)
  const handleStartStop = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "started" ? "stopped" : "started";

      const res = await fetch(`http://localhost:8080/api/candidates/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setElections((prev) =>
          prev.map((election) =>
            election._id === id ? { ...election, status: newStatus } : election
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ✅ DataGrid Columns
  const columns = [
    { field: "name", headerName: "CANDIDATE NAME", flex: 1 },
    { field: "party", headerName: "PARTY", flex: 1 },
    { field: "age", headerName: "AGE", flex: 1 },
    { field: "symbol", headerName: "SYMBOL", flex: 1 },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      headerName: "ACTION",
      flex: 1,
      sortable: false,
      renderCell: ({ row: { _id, status } }) => (
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor:
                status === "started"
                  ? colors.redAccent[600]
                  : colors.greenAccent[600],
              color: "white",
              textTransform: "none",
              padding: "6px 16px",
              fontWeight: "bold",
            }}
            onClick={() => handleStartStop(_id, status)}
          >
            {status === "started" ? "Stop" : "Start"}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="appNew">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Box m="0px 20px">
              <Header
                title="UPCOMING ELECTIONS / CURRENT ELECTIONS"
                subtitle="Manage and Monitor Election Status"
              />
              <Box
                m="20px 0 0 0"
                height="70vh"
                sx={{
                  "& .MuiDataGrid-root": { border: "none" },
                  "& .MuiDataGrid-cell": { borderBottom: "none" },
                  "& .name-column--cell": { color: colors.greenAccent[300] },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700],
                  },
                  "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`,
                  },
                }}
              >
                <DataGrid
                  rows={elections}
                  columns={columns}
                  getRowId={(row) => row._id}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                />
              </Box>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default UpcomingElection;

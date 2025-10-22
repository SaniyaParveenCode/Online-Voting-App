import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens, useMode, ColorModeContext } from "../../theme";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import axios from "axios";
import { BASE_URL } from "../../../../helper";

const NewCandidates = () => {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all candidates from MongoDB
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/candidates`);
        if (res.data && Array.isArray(res.data.candidates)) {
          setCandidates(res.data.candidates);
        } else {
          console.error("Invalid response format:", res.data);
        }
      } catch (error) {
        console.error(" Error fetching candidates:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Delete candidate
  const deleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/candidates/${id}`);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error(" Error deleting candidate:", error.message);
    }
  };

  const editCandidate = (id) => {
    window.location.href = `/edit-candidate/${id}`;
  };

  const columns = [
    {
      field: "image",
      headerName: "Photo",
      width: 110,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%">
          <img
            src={row.image}
            alt={row.name || "candidate"}
            style={{
              width: 55,
              height: 55,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ccc",
            }}
          />
        </Box>
      ),
    },
    { field: "name", headerName: "Full Name", width: 180 },
    { field: "party", headerName: "Party", width: 180 },
    {
      field: "bio",
      headerName: "Bio",
      width: 380,
      renderCell: ({ row }) => (
        <Typography
          sx={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            color: "inherit",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          {row.bio || "No bio available"}
        </Typography>
      ),
      sortable: false,
    },
    {
      field: "symbol",
      headerName: "Symbol",
      width: 100,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" width="100%">
          <img
            src={row.symbol}
            alt={row.party}
            style={{
              width: 45,
              height: 45,
              objectFit: "contain",
            }}
          />
        </Box>
      ),
    },
    { field: "age", headerName: "Age", width: 80, type: "number" },
    {
      headerName: "Action",
      width: 180,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[600],
              color: "white",
            }}
            onClick={() => editCandidate(row._id)}
          >
            EDIT
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.redAccent[600],
              color: "white",
            }}
            onClick={() => deleteCandidate(row._id)}
          >
            DELETE
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
            <Box m="20px">
              <Header
                title="Candidates"
                // subtitle="Manage and view all registered candidates"
              />

              <Box display="flex" justifyContent="flex-start" mb={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    fontWeight: "bold",
                    px: 3,
                    py: 1,
                    boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                    "&:hover": { backgroundColor: "#0b7a32" },
                  }}
                  onClick={() => (window.location.href = "/create-candidate")}
                >
                  CREATE NEW CANDIDATE
                </Button>
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" mt={10}>
                  <CircularProgress />
                </Box>
              ) : candidates.length === 0 ? (
                <Typography
                  variant="h6"
                  color={colors.grey[200]}
                  align="center"
                  mt={5}
                >
                  No candidates found.
                </Typography>
              ) : (
                <Box
                  m="20px 0 0 0"
                  height="70vh"
                  sx={{
                    "& .MuiDataGrid-root": { border: "none" },
                    "& .MuiDataGrid-cell": { borderBottom: "none" },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: colors.blueAccent[700],
                      borderBottom: "none",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                      backgroundColor: colors.blueAccent[700],
                    },
                  }}
                >
                  <DataGrid
                    rows={candidates}
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight={false}
                    getRowHeight={() => 'auto'}  // Flexible row height
                  />
                </Box>
              )}
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default NewCandidates;

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ColorModeContext, useMode } from "../../theme";
import Header from "../../newComponents/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import axios from "axios";
import { BASE_URL } from "../../../../helper";

const Team = () => {
  const [theme, colorMode] = useMode();
  const [voters, setVoters] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    voterId: "",
    email: "",
  });
  const colors = tokens(theme.palette.mode);

  //  Fetch voters
  const fetchVoters = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/voters`);
      setVoters(res.data.voters || []);
    } catch (err) {
      console.error("Error fetching voters:", err);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  //  Delete voter
  const deleteVoter = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/deleteVoter/${id}`);
      setVoters(voters.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  //  Open edit dialog with data
  const handleEditOpen = (voter) => {
    setEditData(voter);
    setOpen(true);
  };

  //  Update voter
  const handleEditSave = async () => {
    try {
      await axios.put(`${BASE_URL}/updateVoter/${editData._id}`, editData);
      setOpen(false);
      fetchVoters();
    } catch (err) {
      console.error("Error updating voter:", err);
    }
  };

  //  Restored working image display logic
  const columns = [
    {
      field: "image",
      headerName: "PHOTO",
      renderCell: ({ row: { image } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
        >
          <img
            src={image ? image : "https://via.placeholder.com/50"}
            alt="profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </Box>
      ),
    },
    { field: "firstName", headerName: "FIRST NAME", flex: 1 },
    { field: "lastName", headerName: "LAST NAME", flex: 1 },
    { field: "age", headerName: "AGE", type: "number", flex: 0.5 },
    { field: "phone", headerName: "PHONE NUMBER", flex: 1 },
    { field: "voterId", headerName: "VOTER ID", flex: 1 },
    { field: "email", headerName: "EMAIL", flex: 1 },
    {
      headerName: "ACTION",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[600],
              color: "white",
              mr: 1,
            }}
            onClick={() => handleEditOpen(row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: colors.redAccent[600], color: "white" }}
            onClick={() => deleteVoter(row._id)}
          >
            Delete
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
              <Header title="VOTERS" subtitle="Managing the Voters" />
              <Box
                m="20px 0 0 0"
                height="70vh"
                sx={{
                  "& .MuiDataGrid-root": { border: "none" },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.primary[400],
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: colors.blueAccent[700],
                    borderTop: "none",
                  },
                }}
              >
                <DataGrid
                  rows={voters}
                  columns={columns}
                  getRowId={(row) => row._id}
                />
              </Box>
            </Box>

            {/*  Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>Edit Voter</DialogTitle>
              <DialogContent>
                <TextField
                  label="First Name"
                  fullWidth
                  margin="dense"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  margin="dense"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                />
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                />
                <TextField
                  label="Phone"
                  fullWidth
                  margin="dense"
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="dense"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSave} variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Team;

import './Vote.css';
import UserNavbar from '../../../Navbar/UserNavbar';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ScrollReveal from "scrollreveal";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { BASE_URL } from '../../../../helper';
import Cookies from 'js-cookie';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'rgb(255, 255, 255)',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = [
  { id: 'fullname', label: 'Candidate Name', minWidth: 250, align: "left" },
  { id: 'party', label: 'Party', minWidth: 120 },
  { id: 'age', label: 'Age', minWidth: 180, align: "center" },
  { id: 'symbol', label: 'Symbol', minWidth: 100, align: "right" },
  { id: 'action', label: '', minWidth: 200 },
];

export default function CustomizedTables() {
  const revealRefBottom = useRef(null);
  const revealRefLeft = useRef(null);
  const revealRefTop = useRef(null);
  const revealRefRight = useRef(null);

  // Scroll animations
  useEffect(() => {
    const sr = ScrollReveal();
    sr.reveal(revealRefBottom.current, { duration: 1000, delay: 300, distance: '50px', origin: 'bottom', reset: true });
    sr.reveal(revealRefRight.current, { duration: 1000, delay: 300, distance: '50px', origin: 'right', reset: true });
    sr.reveal(revealRefLeft.current, { duration: 1000, delay: 300, distance: '50px', origin: 'left', reset: true });
    sr.reveal(revealRefTop.current, { duration: 1000, delay: 300, distance: '50px', origin: 'top', reset: true });
  }, []);

  const [candidates, setCandidates] = useState([]);
  const voterId = Cookies.get('myCookie');
  const [voter, setVoter] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch all candidates
  useEffect(() => {
    axios.get(`${BASE_URL}/api/candidates`)
      .then(response => {
        const candidatesArray = response.data?.candidates || [];
        const processedCandidates = candidatesArray.map(c => ({
          ...c,
          image: c.image && !c.image.startsWith("http") ? `${BASE_URL}/${c.image.replace(/^\/+/, "")}` : c.image,
          symbol: c.symbol && !c.symbol.startsWith("http") ? `${BASE_URL}/${c.symbol.replace(/^\/+/, "")}` : c.symbol,
        }));
        setCandidates(processedCandidates);
      })
      .catch(err => console.error(" Error fetching candidates:", err));
  }, []);

  // Fetch voter details
  useEffect(() => {
    if (!voterId) return;
    axios.get(`${BASE_URL}/api/voters/${voterId}`)
      .then(response => setVoter(response.data?.voter || null))
      .catch(err => console.error(" Error fetching voter:", err));
  }, [voterId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //  Corrected vote handler
  const handleVote = (candidateId) => {
    if (!voter) return alert("Voter not found");
    if (voter.voterStatus === "Voted") return alert("You have already voted!");

    axios.post(`${BASE_URL}/api/votes`, { voterId: voter._id, candidateId })
      .then(() => {
        setVoter({ ...voter, voterStatus: "Voted" });
        handleOpen();
      })
      .catch(err => {
        console.error(" Error voting:", err);
        alert("Error submitting vote!");
      });
  };

  return (
    <div className='Vote-Page'>
      <UserNavbar />
      <div className='candidate'>
        <h2 ref={revealRefLeft}>2025 India General Election</h2>
        <div className='Heading1' ref={revealRefRight}>
          <p><span>GIVE</span> Your Vote</p>
        </div>

        {/* Success Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={open}>
            <Box sx={style} className="MessageBox">
              <h2>Congratulations!</h2>
              <h5>You Have Successfully Voted</h5>
              <button onClick={handleClose}><a href="/User">Ok</a></button>
            </Box>
          </Fade>
        </Modal>

        {/* Candidate Table */}
        <TableContainer component={Paper} ref={revealRefBottom}>
          <Table sx={{ minWidth: 200 }} aria-label="customized table">
            <TableHead>
              <TableRow className='TableRow'>
                {columns.map((column) => (
                  <TableCell
                    className='table_row_heading'
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(candidates) && candidates.map((row) => (
                <StyledTableRow key={row._id}>
                  {/* Candidate Name + Image */}
                  <StyledTableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {row.image ? (
                        <img
                          src={row.image}
                          alt={row.name}
                          style={{ width: 45, height: 45, borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: 45, height: 45, borderRadius: "50%", background: "#ccc" }} />
                      )}
                      <span className="Name-Row text">{row.name}</span>
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>{row.party}</StyledTableCell>
                  <StyledTableCell align="center">{row.age}</StyledTableCell>

                  <StyledTableCell align="right" className='Symbol'>
                    {row.symbol ? (
                      <img src={row.symbol} alt={`${row.party} symbol`} style={{ width: 50, height: 50 }} />
                    ) : "No symbol"}
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => handleVote(row._id)}
                      disabled={voter?.voterStatus === "Voted"}
                    >
                      {voter?.voterStatus === "Voted" ? "Voted" : "Vote"}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

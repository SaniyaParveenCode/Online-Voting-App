import { Box, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "../../newComponents/Header";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import Result from "../../newComponents/BarChart";
import StatBox from "../../newComponents/StatBox";
import VoterbyAge from "../../newComponents/VoterbyAge";
import VoterbyState from "../../newComponents/VoterbyState";
import "../../New.css";
import axios from "axios";
import { BASE_URL } from "../../../../helper";

const NewDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [data, setData] = useState({
    voters: 0,
    candidates: 0,
    voted: 0,
    votesCast: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard stats
        const dashboardRes = await axios.get(`${BASE_URL}/api/dashboard`);
        const d = dashboardRes.data.dashboard || {};
        setData({
          voters: d.voterCount || 0,
          candidates: d.candidateCount || 0,
          voted: d.votersVoted || 0,
          votesCast: d.votesCast || 0,
        });

        // Fetch candidates
        const candidatesRes = await axios.get(`${BASE_URL}/api/candidates`);
        setCandidates(candidatesRes.data.candidates || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data: ", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div className="mainBox">
      <Box m="20px">
        {/* Header */}
        <Box display="flex" mb="10px" justifyContent="space-between" alignItems="center">
          <Header title="ADMIN DASHBOARD" subtitle="Welcome Administrator" />
        </Box>

        {/* Stats Row */}
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox title={data.voters} subtitle="Total Voters" icon={<GroupIcon sx={{ color: colors.greenAccent[600], fontSize: 35 }} />} />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox title={data.candidates} subtitle="Total Candidates" icon={<PersonIcon sx={{ color: colors.greenAccent[600], fontSize: 35 }} />} />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox title={data.voted} subtitle="Voters Who Voted" icon={<HowToVoteIcon sx={{ color: colors.greenAccent[600], fontSize: 35 }} />} />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox title={data.votesCast} subtitle="Total Votes Cast" icon={<HowToVoteIcon sx={{ color: colors.greenAccent[600], fontSize: 35 }} />} />
          </Box>
        </Box>

        {/* Election Result Chart */}
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="1fr" gap="20px" mt="20px">
          <Box gridColumn="span 8" backgroundColor={colors.primary[400]}>
            <Box mt="25px" px="30px" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
                Election Result
              </Typography>
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: 26, color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
            <Box height="250px" mt="-20px">
              <Result isDashboard={true} />
            </Box>
          </Box>

          {/* Current Leaders */}
          <Box gridColumn="span 4" backgroundColor={colors.primary[400]} overflow="auto">
            <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
              <Typography variant="h4" fontWeight="600" color={colors.grey[100]}>
                Current Leaders
              </Typography>
            </Box>
            {candidates.map((c, i) => (
              <Box key={`${c._id}-${i}`} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
                <Box>
                  <Typography variant="h5" fontWeight="600" color={colors.greenAccent[500]}>
                    {c.name}
                  </Typography>
                  <Typography color={colors.grey[100]}>{c.party}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Pie Charts Row */}
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mt="20px">
          <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
            <Header title="Voters According to Age Group" />
            <Box height="400px" mt="20px">
              <VoterbyAge />
            </Box>
          </Box>
          <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
            <Header title="Voters from Different States" />
            <Box height="400px" mt="20px">
              <VoterbyState />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default NewDashboard;

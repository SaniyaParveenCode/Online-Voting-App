import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../helper";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/candidates`)
      .then(res => setCandidates(res.data.candidates || []))
      .catch(err => console.error("Error fetching candidates:", err));
  }, []);

  const data = candidates.reduce((acc, c) => {
    if (!c.party) return acc;
    const index = acc.findIndex(item => item.party === c.party);
    if (index > -1) acc[index].votes += c.votes || 0;
    else acc.push({ party: c.party, votes: c.votes || 0 });
    return acc;
  }, []);

  // Calculate max votes to set y-axis
  const maxVotes = Math.max(...data.map(d => d.votes), 1);

  return (
    <ResponsiveBar
      data={data}
      keys={["votes"]}
      indexBy="party"
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
      padding={0.3}
      valueScale={{ type: "linear", min: 0, max: maxVotes }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "dark2" }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Party",
        legendPosition: "middle",
        legendOffset: 25,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: Array.from({ length: maxVotes + 1 }, (_, i) => i), // 0,1,2,...,maxVotes
        legend: isDashboard ? "" : "Votes",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableGridX={false}
      enableGridY={true}
      enableLabel={false}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          ticks: { line: { stroke: colors.grey[100] }, text: { fill: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
        },
        grid: { line: { stroke: colors.grey[800], strokeDasharray: "4 4" } },
      }}
    />
  );
};

export default BarChart;

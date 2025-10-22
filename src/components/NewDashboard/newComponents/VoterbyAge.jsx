import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../helper";

const VoterbyAge = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ageGroupData, setAgeGroupData] = useState([]);

  const groupVotersByAge = (voters) => {
    const ageGroups = {
      "18-25": 0,
      "26-35": 0,
      "36-45": 0,
      "46-55": 0,
      "56-65": 0,
      "66-75": 0,
      "76+": 0,
    };

    voters.forEach((voter) => {
      const age = Number(voter.age);
      if (age >= 18 && age <= 25) ageGroups["18-25"]++;
      else if (age >= 26 && age <= 35) ageGroups["26-35"]++;
      else if (age >= 36 && age <= 45) ageGroups["36-45"]++;
      else if (age >= 46 && age <= 55) ageGroups["46-55"]++;
      else if (age >= 56 && age <= 65) ageGroups["56-65"]++;
      else if (age >= 66 && age <= 75) ageGroups["66-75"]++;
      else if (age >= 76) ageGroups["76+"]++;
    });

    return Object.entries(ageGroups).map(([key, value]) => ({
      id: key,
      label: key,
      value,
    }));
  };

  useEffect(() => {
    const fetchVoterData = async () => {
      try {
const response = await axios.get(`${BASE_URL}/api/voters`);
        const voterData = response.data.voters || response.data || [];
        const groupedData = groupVotersByAge(voterData);
        setAgeGroupData(groupedData);
      } catch (err) {
        console.error("Error Fetching Data", err);
      }
    };

    fetchVoterData();
  }, []);

  if (!ageGroupData.length) return <div>Loading chart...</div>;

  return (
    <div style={{ height: "400px" }}>
      <ResponsivePie
        data={ageGroupData}
        theme={{
          legends: { text: { fill: colors.grey[100] } },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
      />
    </div>
  );
};

export default VoterbyAge;

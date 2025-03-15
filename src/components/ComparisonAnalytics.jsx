import React from "react";
import { Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

const ComparisonAnalytics = ({ data, title }) => {
  return (
    <div style={{ height: 300 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="scorePercentage" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Typography>No data available</Typography>
      )}
    </div>
  );
};

export default ComparisonAnalytics;

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StackedBarChart = ({ incidents }) => {
  // Process data to create stacked bar chart data
  const chartData = incidents
    .map(group => {
      const primaryIncident = group.primaryIncident;
      const duplicateCount = group.duplicates.length;
      const similarCount = group.similarIncidents.length;
      
      return {
        name: primaryIncident.incidentNumber,
        duplicates: duplicateCount,
        similar: similarCount
      };
    })
    .sort((a, b) => (a.duplicates + a.similar) - (b.duplicates + b.similar)) // Sort by total count
    .reverse(); // Highest to lowest

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 100,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="duplicates" stackId="a" fill="#f44336" name="Duplicates" />
          <Bar dataKey="similar" stackId="a" fill="#ff9800" name="Similar Incidents" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
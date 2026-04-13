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
import { IncidentGroup } from '@/lib/types';
import { ChartDataItem } from '@/lib/types';

const StackedBarChart = ({ incidents }) => {
  if (!incidents || incidents.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>No data available</span>
      </div>
    );
  }

  const chartData: ChartDataItem[] = incidents
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
    .sort((a, b) => (a.duplicates + a.similar) - (b.duplicates + b.similar))
    .reverse();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 40,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={80} />
        <Tooltip />
        <Legend />
        <Bar dataKey="duplicates" stackId="a" fill="#f44336" name="Duplicates" />
        <Bar dataKey="similar" stackId="a" fill="#ff9800" name="Similar Incidents" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBarChart;

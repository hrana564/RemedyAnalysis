import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  useTheme,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  QueryStats as QueryStatsIcon
} from '@mui/icons-material';
import StackedBarChart from '@/components/charts/StackedBarChart';
import { IncidentGroup } from '@/lib/types';

const loadIncidentsData = async () => {
  try {
    const response = await fetch('/transactions-data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading incidents data:', error);
    return [
      {
        primaryIncident: {
          incidentNumber: "INC-001",
          summary: "System downtime reported",
          detailedDescription: "Database server experiencing intermittent connectivity issues causing application slowdowns.",
          createdOn: "2023-05-15T09:30:00Z",
          assignedTo: "John Smith"
        },
        duplicates: [
          {
            incidentNumber: "INC-001-DUPLICATE-1",
            summary: "System downtime reported",
            detailedDescription: "Same issue as INC-001 but reported from different source",
            createdOn: "2023-05-15T14:15:00Z",
            assignedTo: "John Smith"
          }
        ],
        similarIncidents: [
          {
            incidentNumber: "INC-003",
            summary: "Performance degradation",
            detailedDescription: "Similar symptoms but different root cause",
            createdOn: "2023-05-17T11:20:00Z",
            assignedTo: "Robert Johnson"
          }
        ]
      },
      {
        primaryIncident: {
          incidentNumber: "INC-002",
          summary: "User authentication failure",
          detailedDescription: "Multiple users unable to log into the system. Error messages indicate LDAP connection timeout.",
          createdOn: "2023-05-16T10:45:00Z",
          assignedTo: "Jane Doe"
        },
        duplicates: [],
        similarIncidents: [
          {
            incidentNumber: "INC-005",
            summary: "API endpoint failure",
            detailedDescription: "Authentication-related API endpoint issue",
            createdOn: "2023-05-19T13:30:00Z",
            assignedTo: "Michael Wilson"
          }
        ]
      }
    ];
  }
};

interface DashboardPageProps {
  username: string;
}

const DashboardPage = ({ username }: DashboardPageProps) => {
  const [incidents, setIncidents] = useState<IncidentGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadIncidentsData();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const totalIncidents = incidents.length + incidents.reduce((count, group) => count + group.duplicates.length + group.similarIncidents.length, 0);
  const primaryIncidents = incidents.length;
  const duplicateIncidents = incidents.reduce((count, group) => count + group.duplicates.length, 0);
  const similarIncidents = incidents.reduce((count, group) => count + group.similarIncidents.length, 0);

  const filteredIncidents = incidents.filter(group => {
    const primaryMatch = 
      group.primaryIncident.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.primaryIncident.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.primaryIncident.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const duplicateMatches = group.duplicates.some(duplicate => 
      duplicate.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duplicate.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duplicate.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const similarMatches = group.similarIncidents.some(similar => 
      similar.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      similar.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      similar.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return primaryMatch || duplicateMatches || similarMatches;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <Typography variant="h6">Loading incident data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Incident Analysis Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {username}!
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flexGrow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                All Incidents
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                Primary + Duplicates + Similar
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {totalIncidents}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 200, flexGrow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Primary Incidents
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                {primaryIncidents} primary cases
              </Typography>
            }
            avatar={
              <AssignmentIcon sx={{ color: theme.palette.info.main }} />
            }
          />
          <CardContent>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
              {primaryIncidents}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 200, flexGrow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Duplicate Incidents
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                {duplicateIncidents} duplicates
              </Typography>
            }
            avatar={
              <WarningIcon sx={{ color: theme.palette.error.main }} />
            }
          />
          <CardContent>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
              {duplicateIncidents}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ minWidth: 200, flexGrow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Similar Incidents
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                {similarIncidents} similar cases
              </Typography>
            }
            avatar={
              <QueryStatsIcon sx={{ color: theme.palette.warning.main }} />
            }
          />
          <CardContent>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
              {similarIncidents}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Incident Relationships Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Distribution of duplicates and similar incidents per primary incident (sorted by total count)
        </Typography>
        <Card>
          <CardContent>
            <Box sx={{ height: 400 }}>
              <StackedBarChart incidents={filteredIncidents} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;

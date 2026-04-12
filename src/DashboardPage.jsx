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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  QueryStats as QueryStatsIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import StackedBarChart from './StackedBarChart';

// Load data from JSON file
const loadTransactionsData = async () => {
  try {
    // Try to load from public directory (static files)
    const response = await fetch('/transactions-data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading transactions data:', error);
    // Return default data if JSON file fails to load
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

const DashboardPage = ({ username }) => {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadTransactionsData();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Calculate statistics
  const totalIncidents = incidents.length;
  const duplicateIncidents = incidents.reduce((count, group) => count + group.duplicates.length, 0);
  const similarIncidents = incidents.reduce((count, group) => count + group.similarIncidents.length, 0);

  // Filter incidents based on search term
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

  const handleNodeClick = (incidentData) => {
    setSelectedIncident(incidentData);
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Incident Analysis Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {username}!
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flexGrow: 1 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Incidents
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
                Duplicate Incidents
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary">
                {duplicateIncidents} duplicates found
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

      {/* Search Bar */}
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

      {/* Stacked Bar Chart Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Incident Relationships Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Distribution of duplicates and similar incidents per primary incident (sorted by total count)
        </Typography>
        <Card>
          <CardContent>
            <StackedBarChart incidents={filteredIncidents} />
          </CardContent>
        </Card>
      </Box>


    </Box>
  );
};

export default DashboardPage;
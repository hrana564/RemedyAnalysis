import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  styled
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassBottom as HourglassBottomIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
  },
}));

const DashboardPage = ({ username }) => {
  // Sample dashboard data
  const [stats, setStats] = useState({
    totalIncidents: 0,
    openIncidents: 0,
    resolvedIncidents: 0,
    pendingAssignments: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        totalIncidents: 24,
        openIncidents: 8,
        resolvedIncidents: 16,
        pendingAssignments: 3
      });
      
      setRecentActivity([
        { id: 1, action: 'New incident created', item: 'INC-008', time: '2 hours ago' },
        { id: 2, action: 'Incident resolved', item: 'INC-007', time: '4 hours ago' },
        { id: 3, action: 'Assignment updated', item: 'INC-006', time: '1 day ago' },
        { id: 4, action: 'New comment added', item: 'INC-005', time: '1 day ago' }
      ]);
    }, 500);
  }, []);

  const StatCardComponent = ({ title, value, trend, icon: Icon, color }) => (
    <StatCard>
      <CardHeader
        avatar={<Icon sx={{ color, fontSize: 32 }} />}
        title={title}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {trend > 0 ? (
            <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
          ) : (
            <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
          )}
          <Typography variant="body2" color="text.secondary">
            {trend > 0 ? '+' : ''}{trend} from yesterday
          </Typography>
        </Box>
      </CardContent>
    </StatCard>
  );

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {username}!
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCardComponent
            title="Total Incidents"
            value={stats.totalIncidents}
            trend={2}
            icon={AssignmentIcon}
            color="#003366"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCardComponent
            title="Open Incidents"
            value={stats.openIncidents}
            trend={-1}
            icon={HourglassBottomIcon}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCardComponent
            title="Resolved Incidents"
            value={stats.resolvedIncidents}
            trend={5}
            icon={CheckCircleIcon}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCardComponent
            title="Pending Assignments"
            value={stats.pendingAssignments}
            trend={-1}
            icon={CalendarTodayIcon}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
              }
            />
            <CardContent>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem key={activity.id} sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {activity.action}
                      </Typography>
                    }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={activity.item} 
                            size="small" 
                            variant="outlined" 
                            color="primary" 
                          />
                          <Typography variant="caption" color="text.secondary" component="span">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                  />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
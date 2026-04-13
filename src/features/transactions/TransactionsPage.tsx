import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Tooltip,
  Collapse,
  Chip,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { Incident, IncidentGroup } from '@/lib/types';

const loadIncidentsData = async () => {
  try {
    const response = await fetch('/transactions-data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading transactions data:', error);
    return [
      {
        primaryIncident: {
          incidentNumber: "INC-001",
          summary: "System downtime reported",
          detailedDescription: "Database server experiencing intermittent connectivity issues causing application slowdowns.",
          createdOn: "2023-05-15",
          assignedTo: "John Smith"
        },
        duplicates: [
          {
            incidentNumber: "INC-001-DUPLICATE-1",
            summary: "System downtime reported",
            detailedDescription: "Same issue as INC-001 but reported from different source",
            createdOn: "2023-05-15",
            assignedTo: "John Smith"
          }
        ],
        similarIncidents: [
          {
            incidentNumber: "INC-003",
            summary: "Performance degradation",
            detailedDescription: "Similar symptoms but different root cause",
            createdOn: "2023-05-17",
            assignedTo: "Robert Johnson"
          }
        ]
      },
      {
        primaryIncident: {
          incidentNumber: "INC-002",
          summary: "User authentication failure",
          detailedDescription: "Multiple users unable to log into the system. Error messages indicate LDAP connection timeout.",
          createdOn: "2023-05-16",
          assignedTo: "Jane Doe"
        },
        duplicates: [],
        similarIncidents: [
          {
            incidentNumber: "INC-005",
            summary: "API endpoint failure",
            detailedDescription: "Authentication-related API endpoint issue",
            createdOn: "2023-05-19",
            assignedTo: "Michael Wilson"
          }
        ]
      }
    ];
  }
};

interface TransactionsPageProps {}

const TransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [groupedTransactions, setGroupedTransactions] = useState<IncidentGroup[]>([]);
  useTheme();

  useEffect(() => {
    loadIncidentsData().then(data => {
      setGroupedTransactions(data);
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
  };

  const toggleExpandGroup = (groupIndex: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupIndex)) {
      newExpanded.delete(groupIndex);
    } else {
      newExpanded.add(groupIndex);
    }
    setExpandedGroups(newExpanded);
  };

  const getFilteredTransactions = (): IncidentGroup[] => {
    if (!searchTerm) return groupedTransactions;
    
    return groupedTransactions.filter(group => {
      const primaryMatch = 
        group.primaryIncident.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.primaryIncident.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.primaryIncident.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.primaryIncident.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const duplicateMatches = group.duplicates.some(duplicate => 
        duplicate.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        duplicate.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        duplicate.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        duplicate.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const similarMatches = group.similarIncidents.some(similar => 
        similar.incidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        similar.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        similar.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        similar.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return primaryMatch || duplicateMatches || similarMatches;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const getSortedTransactions = (): IncidentGroup[] => {
    let sortableItems = [...filteredTransactions];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch(sortConfig.key) {
          case 'incidentNumber':
            aValue = a.primaryIncident.incidentNumber;
            bValue = b.primaryIncident.incidentNumber;
            break;
          case 'summary':
            aValue = a.primaryIncident.summary;
            bValue = b.primaryIncident.summary;
            break;
          case 'detailedDescription':
            aValue = a.primaryIncident.detailedDescription;
            bValue = b.primaryIncident.detailedDescription;
            break;
          case 'createdOn':
            aValue = a.primaryIncident.createdOn;
            bValue = b.primaryIncident.createdOn;
            break;
          case 'assignedTo':
            aValue = a.primaryIncident.assignedTo;
            bValue = b.primaryIncident.assignedTo;
            break;
          case 'duplicatesCount':
            aValue = a.duplicates.length;
            bValue = b.duplicates.length;
            break;
          case 'similarCount':
            aValue = a.similarIncidents.length;
            bValue = b.similarIncidents.length;
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  };

  const sortedTransactions = getSortedTransactions();



  const renderIncidentRow = (incident: Incident, isPrimary = false, isDuplicate = false, isSimilar = false) => (
    <TableRow hover key={incident.incidentNumber} sx={{ 
      backgroundColor: isPrimary ? '#e8f5e9' : isDuplicate ? '#ffebee' : isSimilar ? '#fff3e0' : 'transparent',
      '&:hover': { 
        backgroundColor: isPrimary ? '#c8e6c9' : isDuplicate ? '#ffcdd2' : isSimilar ? '#ffcc80' : 'transparent'
      }
    }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isPrimary && (
            <Chip 
              label="Primary" 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ fontWeight: 'bold', borderColor: '#4caf50', color: '#4caf50' }}
            />
          )}
          {isDuplicate && (
            <Chip 
              label="Duplicate" 
              size="small" 
              color="error" 
              variant="outlined"
              sx={{ fontWeight: 'bold', borderColor: '#f44336', color: '#f44336' }}
            />
          )}
          {isSimilar && (
            <Chip 
              label="Similar" 
              size="small" 
              color="warning" 
              variant="outlined"
              sx={{ fontWeight: 'bold', borderColor: '#ff9800', color: '#ff9800' }}
            />
          )}
          {incident.incidentNumber}
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ fontWeight: isPrimary ? 'bold' : 'normal' }}>
          {incident.summary}
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
          {incident.detailedDescription}
        </Typography>
      </TableCell>
      <TableCell>{incident.createdOn}</TableCell>
      <TableCell>{incident.assignedTo}</TableCell>
    </TableRow>
  );

  const renderExpandedSection = (group: IncidentGroup, groupIndex: number, theme: any) => {
    const isExpanded = expandedGroups.has(groupIndex);
    
    return (
      <React.Fragment>
        <TableRow>
          <TableCell colSpan={7} sx={{ p: 0, borderBottom: 'none' }}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, borderTop: '1px solid ' + (theme?.palette?.divider || '#e0e0e0'), backgroundColor: (theme?.palette?.background?.default || '#fafafa') }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: (theme?.palette?.text?.primary || '#000'), fontWeight: 'bold' }}>
                    Duplicates ({group.duplicates.length})
                  </Typography>
                  {group.duplicates.length > 0 ? (
                    <Paper sx={{ mb: 2, backgroundColor: (theme?.palette?.background?.paper || '#fff'), width: '100%' }}>
                      <Table size="small" sx={{ width: '100%' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Incident Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Summary</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Created On</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Assigned To</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.duplicates.map(duplicate => renderIncidentRow(duplicate, false, true, false))}
                        </TableBody>
                      </Table>
                    </Paper>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No duplicates found
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: (theme?.palette?.text?.primary || '#000'), fontWeight: 'bold' }}>
                    Similar Incidents ({group.similarIncidents.length})
                  </Typography>
                  {group.similarIncidents.length > 0 ? (
                    <Paper sx={{ backgroundColor: (theme?.palette?.background?.paper || '#fff'), width: '100%' }}>
                      <Table size="small" sx={{ width: '100%' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Incident Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Summary</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Created On</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Assigned To</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.similarIncidents.map(similar => renderIncidentRow(similar, false, false, true))}
                        </TableBody>
                      </Table>
                    </Paper>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No similar incidents found
                    </Typography>
                  )}
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Incident Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage grouped incident reports
        </Typography>
      </Box>

      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Search incidents">
                  <IconButton edge="start" sx={{ mr: 1 }}>
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: 'white'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#003366'
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#003366'
            }
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ boxShadow: 3, borderRadius: 2, width: '100%', backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'incidentNumber'}
                  direction={sortConfig.key === 'incidentNumber' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('incidentNumber')}
                >
                  Incident Number {getSortIndicator('incidentNumber')}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'summary'}
                  direction={sortConfig.key === 'summary' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('summary')}
                >
                  Summary {getSortIndicator('summary')}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '20%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'detailedDescription'}
                  direction={sortConfig.key === 'detailedDescription' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('detailedDescription')}
                >
                  Description {getSortIndicator('detailedDescription')}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '10%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'createdOn'}
                  direction={sortConfig.key === 'createdOn' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('createdOn')}
                >
                  Created On {getSortIndicator('createdOn')}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '10%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'assignedTo'}
                  direction={sortConfig.key === 'assignedTo' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('assignedTo')}
                >
                  Assigned To {getSortIndicator('assignedTo')}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '10%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'duplicatesCount'}
                  direction={sortConfig.key === 'duplicatesCount' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('duplicatesCount')}
                >
                  Duplicates {getSortIndicator('duplicatesCount')}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
                <TableSortLabel
                  active={sortConfig.key === 'similarCount'}
                  direction={sortConfig.key === 'similarCount' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('similarCount')}
                >
                  Similar Incidents {getSortIndicator('similarCount')}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((group, groupIndex) => (
                  <React.Fragment key={group.primaryIncident.incidentNumber}>
                    <TableRow 
                      hover 
                      sx={{ 
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                      onClick={() => toggleExpandGroup(groupIndex)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small">
                            {expandedGroups.has(groupIndex) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                          <Chip 
                            label="Primary" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                            sx={{ 
                              fontWeight: 'bold', 
                              borderColor: '#4caf50', 
                              color: '#4caf50',
                              backgroundColor: 'white'
                            }}
                          />
                          {group.primaryIncident.incidentNumber}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{group.primaryIncident.summary}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                          {group.primaryIncident.detailedDescription}
                        </Typography>
                      </TableCell>
                      <TableCell>{group.primaryIncident.createdOn}</TableCell>
                      <TableCell>{group.primaryIncident.assignedTo}</TableCell>
                      <TableCell>{group.duplicates.length}</TableCell>
                      <TableCell>{group.similarIncidents.length}</TableCell>
                    </TableRow>
                    
                    {renderExpandedSection(group, groupIndex, {})}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default TransactionsPage;

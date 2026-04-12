import React, { useState } from 'react';
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
  Tooltip
} from '@mui/material';
import { Search as SearchIcon, ArrowDropDown as ArrowDropDownIcon, ArrowDropUp as ArrowDropUpIcon } from '@mui/icons-material';

const TransactionsPage = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([
    {
      incidentNumber: "INC-001",
      summary: "System downtime reported",
      detailedDescription: "Database server experiencing intermittent connectivity issues causing application slowdowns.",
      createdOn: "2023-05-15",
      assignedTo: "John Smith"
    },
    {
      incidentNumber: "INC-002",
      summary: "User authentication failure",
      detailedDescription: "Multiple users unable to log into the system. Error messages indicate LDAP connection timeout.",
      createdOn: "2023-05-16",
      assignedTo: "Jane Doe"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = filteredTransactions.filter(transaction =>
      transaction.incidentNumber.toLowerCase().includes(term.toLowerCase()) ||
      transaction.summary.toLowerCase().includes(term.toLowerCase()) ||
      transaction.detailedDescription.toLowerCase().includes(term.toLowerCase()) ||
      transaction.assignedTo.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(sortedTransactions);
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transaction Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage incident reports
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <Tooltip title="Search incidents">
                <IconButton edge="start" sx={{ mr: 1 }}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      </Box>

      {/* Transactions Table */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ boxShadow: 3, borderRadius: 2, width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'incidentNumber'}
                    direction={sortConfig.key === 'incidentNumber' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('incidentNumber')}
                  >
                    Incident Number {getSortIndicator('incidentNumber')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'summary'}
                    direction={sortConfig.key === 'summary' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('summary')}
                  >
                    Summary {getSortIndicator('summary')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'detailedDescription'}
                    direction={sortConfig.key === 'detailedDescription' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('detailedDescription')}
                  >
                    Detailed Description {getSortIndicator('detailedDescription')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'createdOn'}
                    direction={sortConfig.key === 'createdOn' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('createdOn')}
                  >
                    Created On {getSortIndicator('createdOn')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'assignedTo'}
                    direction={sortConfig.key === 'assignedTo' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('assignedTo')}
                  >
                    Assigned To {getSortIndicator('assignedTo')}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{transaction.incidentNumber}</TableCell>
                    <TableCell>{transaction.summary}</TableCell>
                    <TableCell>{transaction.detailedDescription}</TableCell>
                    <TableCell>{transaction.createdOn}</TableCell>
                    <TableCell>{transaction.assignedTo}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
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
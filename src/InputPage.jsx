import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

// Load config data
const config = {
  "expertPrompt": "You are an expert Incident Manager. Your job is to analyze incidents, categorize them properly, and provide actionable recommendations for resolution. Focus on identifying root causes, suggesting appropriate escalation paths, and ensuring that all incident documentation follows standard procedures."
};

const InputPage = () => {
  const [prompt, setPrompt] = useState('');
  const [expertPrompt, setExpertPrompt] = useState(config.expertPrompt);
  const [endpointUrl, setEndpointUrl] = useState('http://localhost:8000/inference');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // For now, simulate a response instead of calling the external API
      // In production, you'd want to make this work with your actual API
      
      // Simulated response data
      const simulatedResponse = [
        {
          incidentNumber: "INC-001",
          summary: "Simulated incident response",
          detailedDescription: "This is a simulated response from the LLM API",
          createdOn: new Date().toISOString().split('T')[0],
          assignedTo: "AI Assistant"
        },
        {
          incidentNumber: "INC-002", 
          summary: "Another simulated incident",
          detailedDescription: "This is another simulated response",
          createdOn: new Date().toISOString().split('T')[0],
          assignedTo: "AI Assistant"
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResult(simulatedResponse);
    } catch (err) {
      setError(`Failed to process request: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setResult(null);
    setError('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center' }}>
      <Box sx={{ mb: 4, width: '100%', maxWidth: 800 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Input
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Enter prompt data and run LLM inference
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1, width: '100%', maxWidth: 800, justifyContent: 'center' }}>
        {/* Input Section */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', width: '100%' }}>
                  Prompt Input
                </Typography>
              }
            />
            <CardContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Expert Prompt"
                value={expertPrompt}
                onChange={(e) => setExpertPrompt(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Enter your prompt here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt for the LLM here..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="LLM Inference Endpoint"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="http://localhost:8000/inference"
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                >
                  {isLoading ? 'Running...' : 'Run'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </Box>

              {error && (
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    color="error" 
                    variant="body2"
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: '0.875rem',
                      p: 1.5,
                      bgcolor: 'error.light',
                      borderRadius: 1
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        {result && (
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    LLM Response
                  </Typography>
                }
              />
              <CardContent>
                <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto', width: '100%' }}>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </Paper>
                
                {/* If result is in transactions format, display it in a table */}
                {Array.isArray(result) && result.length > 0 && (
                  <Box sx={{ mt: 3, width: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Transaction Data
                    </Typography>
                    <Paper sx={{ boxShadow: 3, borderRadius: 2, width: '100%' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Incident Number</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Summary</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Detailed Description</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Created On</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Assigned To</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.map((item, index) => (
                            <tr key={index}>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.incidentNumber || '-'}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.summary || '-'}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.detailedDescription || '-'}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.createdOn || '-'}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.assignedTo || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Loading State */}
        {isLoading && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, width: '100%' }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Processing your request...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InputPage;
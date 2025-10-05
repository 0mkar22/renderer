import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import WorkOrder from './pages/WorkOrder';
import Reports from './pages/Reports';
import InvoiceSwitcher from './pages/InvoiceSwitcher';

const theme = createTheme({
  palette: {
    primary: {
      main: '#28a745', // Green color from HTML
    },
    secondary: {
      main: '#2196F3', // Blue color for back button
    },
    background: {
      default: '#f4f4f4', // Light gray background from HTML
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '5px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/work-order" replace />} />
            <Route path="/work-order" element={<WorkOrder />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/bill/*" element={<InvoiceSwitcher />} />
            <Route path="*" element={<Navigate to="/work-order" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;

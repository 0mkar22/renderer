import React, { useState, useEffect } from 'react';
import VendorInvoice from './VendorInvoice';
import WorkOrderInvoice from './WorkOrderInvoice';
import { Box, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function InvoiceSwitcher() {
  const [workItems, setWorkItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState('none');

  useEffect(() => {
    axios.get('http://localhost:5000/api/work-orders')
      .then(res => {
        const allWorkItems = res.data.flatMap(order =>
          order.workItems.map(item => ({
            ...item,
            parentWorkOrderId: order._id,
            entryNumber: order.entryNumber,
            date: order.eventDate,
            vendor: order.vendor,
            // Try to get poType from item, fallback to order
            poType: item.poNpo || '-'
          }))
        );
        setWorkItems(allWorkItems);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch work items.');
        setLoading(false);
      });
  }, []);

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = workItems.filter(item => selectedIds.includes(item._id));

  return (
    <Box sx={{ p: 3 }}>
      {/* Common Work Item Selection Table */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Select Work Items</Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Entry Number</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Event Date</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>PO/NPO</TableCell>
                  <TableCell>Work Type</TableCell>
                  <TableCell>Location and Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workItems.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(item._id)}
                        onChange={() => handleSelect(item._id)}
                      />
                    </TableCell>
                    <TableCell>{item.entryNumber}</TableCell>
                    <TableCell>{item.eventName}</TableCell>
                    <TableCell>{item.eventVenue || '-'}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.poType || '-'}</TableCell>
                    <TableCell>{item.workMain}</TableCell>
                    <TableCell>{item.workSub || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {/* Common Invoice Preview */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Invoice Preview</Typography>
        {selectedItems.length === 0 ? (
          <Typography color="text.secondary">No work items selected.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Entry Number</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Event Date</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>PO/NPO</TableCell>
                  <TableCell>Work Type</TableCell>
                  <TableCell>Location and Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map(item => (
                  <TableRow key={item._id}>
                    <TableCell>{item.entryNumber}</TableCell>
                    <TableCell>{item.eventName}</TableCell>
                    <TableCell>{item.eventVenue || '-'}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.poType || '-'}</TableCell>
                    <TableCell>{item.workMain}</TableCell>
                    <TableCell>{item.workSub || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      {/* Buttons to generate invoices */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          variant={show === 'vendor' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setShow('vendor')}
          disabled={selectedItems.length === 0}
        >
          Generate Vendor Bill
        </Button>
        <Button
          variant={show === 'workorder' ? 'contained' : 'outlined'}
          color="secondary"
          onClick={() => setShow('workorder')}
          disabled={selectedItems.length === 0}
        >
          Generate Work Order Invoice
        </Button>
      </Paper>
      {/* Render the selected invoice type below */}
      {show === 'vendor' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: 'primary.main' }}>Vendor Invoice</Typography>
          <VendorInvoice selectedItems={selectedItems} />
        </Box>
      )}
      {show === 'workorder' && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: 'secondary.main' }}>Work Order Invoice</Typography>
          <WorkOrderInvoice selectedItems={selectedItems} />
        </Box>
      )}
      {show === 'none' && (
        <Paper sx={{ p: 3, textAlign: 'center', color: '#888' }}>
          Please select work items and then choose an invoice type to generate.
        </Paper>
      )}
    </Box>
  );
}

export default InvoiceSwitcher;

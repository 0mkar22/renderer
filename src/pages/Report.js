import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Button, Box, Alert
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Pricing configuration
const pricing = {
  "Still_Photography": {
    "Mumbai_Upto_4_Hrs": 15000,
    "Mumbai_Above_4_and_upto_8_Hrs": 20000,
    "Panvel_Upto_4_Hrs": 15000,
    "Panvel_Above_4_and_upto_8_Hrs": 20000,
    "Uran_Upto_4_Hrs": 15000,
    "Uran_Above_4_and_upto_8_Hrs": 20000,
    "Nhava_Upto_4_Hrs": 15000,
    "Nhava_Above_4_and_upto_8_Hrs": 20000,
    "Outstation_Upto_4_Hrs": 20000,
    "Outstation_Above_4_and_upto_8_Hrs": 25000
  },
  "Videography": {
    "Mumbai_Upto_4_Hrs": 25000,
    "Mumbai_Above_4_and_upto_8_Hrs": 30000,
    "Panvel_Upto_4_Hrs": 25000,
    "Panvel_Above_4_and_upto_8_Hrs": 30000,
    "Uran_Upto_4_Hrs": 25000,
    "Uran_Above_4_and_upto_8_Hrs": 30000,
    "Nhava_Upto_4_Hrs": 25000,
    "Nhava_Above_4_and_upto_8_Hrs": 30000,
    "Outstation_Upto_4_Hrs": 30000,
    "Outstation_Above_4_and_upto_8_Hrs": 35000
  },
  "Two_Camera_Setup": {
    "Mumbai_Upto_4_Hrs": 31000,
    "Mumbai_Above_4_and_upto_8_Hrs": 40000,
    "Panvel_Upto_4_Hrs": 31000,
    "Panvel_Above_4_and_upto_8_Hrs": 40000,
    "Uran_Upto_4_Hrs": 31000,
    "Uran_Above_4_and_upto_8_Hrs": 40000,
    "Nhava_Upto_4_Hrs": 31000,
    "Nhava_Above_4_and_upto_8_Hrs": 40000,
    "Outstation_Upto_4_Hrs": 32000,
    "Outstation_Above_4_and_upto_8_Hrs": 43000
  },
  "Three_Camera_Setup": {
    "Mumbai_Upto_4_Hrs": 31000,
    "Mumbai_Above_4_and_upto_8_Hrs": 40000,
    "Panvel_Upto_4_Hrs": 31000,
    "Panvel_Above_4_and_upto_8_Hrs": 40000,
    "Uran_Upto_4_Hrs": 31000,
    "Uran_Above_4_and_upto_8_Hrs": 40000,
    "Nhava_Upto_4_Hrs": 31000,
    "Nhava_Above_4_and_upto_8_Hrs": 40000,
    "Outstation_Upto_4_Hrs": 32000,
    "Outstation_Above_4_and_upto_8_Hrs": 43000
  },
  "Live_Telecast": {
    "Mumbai_Upto_4_Hrs": 7000,
    "Mumbai_Above_4_and_upto_8_Hrs": 9000,
    "Panvel_Upto_4_Hrs": 7000,
    "Panvel_Above_4_and_upto_8_Hrs": 9000,
    "Uran_Upto_4_Hrs": 7000,
    "Uran_Above_4_and_upto_8_Hrs": 9000,
    "Nhava_Upto_4_Hrs": 7000,
    "Nhava_Above_4_and_upto_8_Hrs": 9000,
    "Outstation_Upto_4_Hrs": 9000,
    "Outstation_Above_4_and_upto_8_Hrs": 10000
  }
};

function Report() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching work orders...');
      
      // First, check if the server is running
      try {
        const testResponse = await axios.get('http://localhost:5000/api/health');
        console.log('Server health check:', testResponse.data);
      } catch (error) {
        console.error('Server health check failed:', error);
        throw new Error('Backend server is not running. Please start the server first.');
      }

      // Then fetch the work orders
      const response = await axios.get('http://localhost:5000/api/work-orders');
      console.log('API Response:', response);
      
      if (!response || !response.data) {
        throw new Error('No data received from the server');
      }

      const orders = response.data;
      console.log('Work Orders:', orders);

      if (!Array.isArray(orders)) {
        throw new Error('Received data is not an array');
      }

      if (orders.length === 0) {
        console.log('No work orders found in the database');
        setWorkOrders([]);
        setTotalAmount(0);
        return;
      }

      // Add pricing to each work item
      const ordersWithPricing = orders.map(order => ({
        ...order,
        workItems: order.workItems.map(item => ({
          ...item,
          pricing: pricing[item.workMain]?.[item.workSub] || 0
        }))
      }));

      console.log('Orders with pricing:', ordersWithPricing);
      setWorkOrders(ordersWithPricing);
      
      // Calculate total amount
      const total = ordersWithPricing.reduce((sum, order) => {
        if (!order.workItems || !Array.isArray(order.workItems)) {
          console.warn('Invalid workItems in order:', order);
          return sum;
        }
        
        const orderTotal = order.workItems.reduce((itemSum, item) => {
          return itemSum + (Number(item.pricing) || 0);
        }, 0);
        return sum + orderTotal;
      }, 0);
      
      console.log('Total Amount:', total);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error in fetchWorkOrders:', error);
      setError(error.message || 'Failed to fetch work orders');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const reportContainer = document.getElementById('reportContainer');
    if (!reportContainer) {
      console.error('Report container not found');
      return;
    }

    html2canvas(reportContainer).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('work-order-report.pdf');
    }).catch(error => {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
        <Typography variant="h4">
          Work Order Report
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={fetchWorkOrders}
            sx={{ mr: 2 }}
          >
            Refresh Data
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={downloadPDF}
            disabled={loading || error || workOrders.length === 0}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }} id="reportContainer">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : workOrders.length === 0 ? (
          <Alert severity="info">
            No work orders found. Please add some work orders first.
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr. No.</TableCell>
                    <TableCell>Entry Number</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Event Venue</TableCell>
                    <TableCell>Event Time</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Work Type</TableCell>
                    <TableCell>Contact Person</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workOrders.flatMap((order, orderIndex) =>
                    order.workItems.map((item, itemIndex) => (
                      <TableRow key={`${order._id}-${itemIndex}`}>
                        <TableCell>{orderIndex * order.workItems.length + itemIndex + 1}</TableCell>
                        <TableCell>{order.entryNumber}</TableCell>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{item.eventName}</TableCell>
                        <TableCell>{item.eventVenue}</TableCell>
                        <TableCell>{item.eventTime}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell>
                          {item.workMain?.replaceAll('_', ' ')}
                          {item.workSub ? ` - ${item.workSub.replaceAll('_', ' ')}` : ''}
                        </TableCell>
                        <TableCell>{item.contactPerson}</TableCell>
                        <TableCell>{item.contactNumber}</TableCell>
                        <TableCell>{formatCurrency(item.pricing)}</TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow>
                    <TableCell colSpan={10} align="right">
                      <Typography variant="h6">Total Amount:</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">{formatCurrency(totalAmount)}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Report; 
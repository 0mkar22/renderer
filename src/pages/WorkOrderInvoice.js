import React from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button
} from '@mui/material';

const pricing = {
  "Still_Photography": {
    "Mumbai_Upto_4_Hrs": 2950,
    "Mumbai_Above_4_and_upto_8_Hrs": 4150,
    "Panvel_Upto_4_Hrs": 3200,
    "Panvel_Above_4_and_upto_8_Hrs": 4150,
    "Uran_Upto_4_Hrs": 4000,
    "Uran_Above_4_and_upto_8_Hrs": 5200,
    "Nhava_Upto_4_Hrs": 4000,
    "Nhava_Above_4_and_upto_8_Hrs": 5200,
    "Outstation_Upto_4_Hrs": 4490,
    "Outstation_Above_4_and_upto_8_Hrs": 6300
  },
  "Videography": {
    "Mumbai_Upto_4_Hrs": 4300,
    "Mumbai_Above_4_and_upto_8_Hrs": 6000,
    "Panvel_Upto_4_Hrs": 4300,
    "Panvel_Above_4_and_upto_8_Hrs": 6000,
    "Uran_Upto_4_Hrs": 4500,
    "Uran_Above_4_and_upto_8_Hrs": 6000,
    "Nhava_Upto_4_Hrs": 4500,
    "Nhava_Above_4_and_upto_8_Hrs": 6000,
    "Outstation_Upto_4_Hrs": 5800,
    "Outstation_Above_4_and_upto_8_Hrs": 7500
  },
  "Two_Camera_Setup": {
    "Mumbai_Upto_4_Hrs": 23650,
    "Mumbai_Above_4_and_upto_8_Hrs": 37000,
    "Panvel_Upto_4_Hrs": 25500,
    "Panvel_Above_4_and_upto_8_Hrs": 37000,
    "Uran_Upto_4_Hrs": 26500,
    "Uran_Above_4_and_upto_8_Hrs": 38000,
    "Nhava_Upto_4_Hrs": 26500,
    "Nhava_Above_4_and_upto_8_Hrs": 38000,
    "Outstation_Upto_4_Hrs": 32000,
    "Outstation_Above_4_and_upto_8_Hrs": 41000
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

// Number to words (Indian system, simple)
function numberToWords(num) {
  // This is a very basic version. For production, use a library!
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
    'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if ((num = num.toString()).length > 9) return 'Overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; let str = '';
  str += (n[1] !== '00') ? (a[Number(n[1])] || b[n[1][0]] + '  ' + a[n[1][1]]) + ' Crore ' : '';
  str += (n[2] !== '00') ? (a[Number(n[2])] || b[n[2][0]] + '  ' + a[n[2][1]]) + ' Lakh ' : '';
  str += (n[3] !== '00') ? (a[Number(n[3])] || b[n[3][0]] + '  ' + a[n[3][1]]) + ' Thousand ' : '';
  str += (n[4] !== '0') ? (a[Number(n[4])] || b[n[4][0]] + '  ' + a[n[4][1]]) + ' Hundred ' : '';
  str += (n[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + '  ' + a[n[5][1]]) + ' ' : '';
  return str.trim() + ' Rupees Only';
}

function WorkOrderInvoice({ selectedItems }) {
  const [showInvoice, setShowInvoice] = React.useState(false);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Work Order Invoice</Typography>

      {/* Invoice Preview */}
      <Paper sx={{ p: 2 }}>
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
                    <TableCell>{item.poNumber || item.npoNumber || '-'}</TableCell>
                    <TableCell>{item.workMain}</TableCell>
                    <TableCell>{item.workSub || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Generate Invoice Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => setShowInvoice(true)}
        disabled={selectedItems.length === 0}
      >
        Generate Invoice
      </Button>

      {/* The final invoice layout will be implemented in the next step as per your image */}
      {showInvoice && (
        <Paper id="generated-invoice" sx={{ p: 0, mt: 3, mb: 3, border: '2px solid #000', background: '#fff', fontFamily: 'Arial, sans-serif' }}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', borderBottom: '1px solid #000', p: 1 }}>
            <img src="/ONGC logo.png" alt="ONGC Logo" style={{ height: 100, marginBottom: 8 }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>निगमित संचार विभाग</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>पहिली मंजिल, एनबीपी ग्रीन हाईट्स,</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>क्षेत्रीय कार्यालय, ओएनजीसी बांद्रा कुर्ला कॉम्प्लेक्स</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>बांद्रा (ईस्ट) , मुंबई - ४०००५१</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>दूरभाष: 022-26274105 /4134  email : ongcmumbaice@ongc.co.in</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1, textAlign: 'left' }}>सं. प.सं.अ.सं./सी.सी./39/232/2024-25</Typography>
            <Typography variant="body2" sx={{ textAlign: 'right', ml: 1 }}>DT: {new Date().toLocaleDateString()}</Typography>
          </Box>
          {/* Recipient and Title */}
          <Box sx={{ p: 2, pb: 0 }}>
            <Typography variant="body2" sx={{ textAlign: 'left', mb: 1 }}>
              To,<br />M/s.IcompSystems<br />21, Nilkanth Apt., Samata Nagar,<br />Pokharan RoadNo.1,Thane (W),<br />Mumbai 400 606
            </Typography>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', textDecoration: 'underline', mb: 1 }}>Work Order</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              The Following Photography Assignment Is Assigned To Your Agency.
            </Typography>
          </Box>
          {/* Work Table */}
          <TableContainer>
            <Table size="small" sx={{ border: '1px solid #000', borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', width: 40 }}>Sr.<br />No.</TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', width: 350 }}>Work</TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', width: 40 }}>Qty.</TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', width: 90 }}>Rate</TableCell>
                  <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', width: 90 }}>Amount<br />(Rs.)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item, idx) => (
                  <TableRow key={item._id}>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'center' }}>{idx + 1}</TableCell>
                    <TableCell sx={{ border: '1px solid #000', fontSize: '0.98rem' }}>
                      {item.workMain || ''}<br />
                      dt. {new Date(item.date).toLocaleDateString()}<br />
                      for {item.eventName}<br />
                      at {item.eventVenue || '-'}<br />
                      {item.workSub && `Duration : ${item.workSub}`}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'center' }}>1</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right' }}>{(() => {
                      // Determine work type key
                      let workType = (item.workMain || '').replace(/\s+/g, '_');
                      // Determine location (Mumbai, Panvel, Uran, Nhava, Outstation)
                      let location = 'Mumbai';
                      if (item.eventVenue) {
                        const venue = item.eventVenue.toLowerCase();
                        if (venue.includes('panvel')) location = 'Panvel';
                        else if (venue.includes('uran')) location = 'Uran';
                        else if (venue.includes('nhava')) location = 'Nhava';
                        else if (venue.includes('outstation')) location = 'Outstation';
                      }
                      // Determine duration from workSub
                      let duration = 0;
                      if (item.workSub) {
                        const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                        if (match) duration = parseFloat(match[1]);
                      }
                      let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                      // Compose pricing key
                      const priceKey = `${location}_${durationKey}`;
                      // Get rate from pricing table
                      const rate = pricing[workType]?.[priceKey] ?? 0;
                      return `Rs.${Number(rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                    })()}</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right' }}>{(() => {
                      // Determine work type key
                      let workType = (item.workMain || '').replace(/\s+/g, '_');
                      // Determine location (Mumbai, Panvel, Uran, Nhava, Outstation)
                      let location = 'Mumbai';
                      if (item.eventVenue) {
                        const venue = item.eventVenue.toLowerCase();
                        if (venue.includes('panvel')) location = 'Panvel';
                        else if (venue.includes('uran')) location = 'Uran';
                        else if (venue.includes('nhava')) location = 'Nhava';
                        else if (venue.includes('outstation')) location = 'Outstation';
                      }
                      // Determine duration from workSub
                      let duration = 0;
                      if (item.workSub) {
                        const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                        if (match) duration = parseFloat(match[1]);
                      }
                      let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                      // Compose pricing key
                      const priceKey = `${location}_${durationKey}`;
                      // Get rate from pricing table
                      const rate = pricing[workType]?.[priceKey] ?? 0;
                      return `Rs.${Number(rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                    })()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Footer Section */}
          <Box sx={{ p: 2, borderTop: '1px solid #000', mt: 0 }}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', textAlign: 'right'}}>Total Cost</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right', width: '230px' }}>{(() => {
                      const total = selectedItems.reduce((sum, item) => {
                        let workType = (item.workMain || '').replace(/\s+/g, '_');
                        let location = 'Mumbai';
                        if (item.eventVenue) {
                          const venue = item.eventVenue.toLowerCase();
                          if (venue.includes('panvel')) location = 'Panvel';
                          else if (venue.includes('uran')) location = 'Uran';
                          else if (venue.includes('nhava')) location = 'Nhava';
                          else if (venue.includes('outstation')) location = 'Outstation';
                        }
                        let duration = 0;
                        if (item.workSub) {
                          const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                          if (match) duration = parseFloat(match[1]);
                        }
                        let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                        const priceKey = `${location}_${durationKey}`;
                        const rate = pricing[workType]?.[priceKey] ?? 0;
                        return sum + rate;
                      }, 0);
                      return total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right' }}>CGST 9%</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right' }}>{(() => {
                      const total = selectedItems.reduce((sum, item) => {
                        let workType = (item.workMain || '').replace(/\s+/g, '_');
                        let location = 'Mumbai';
                        if (item.eventVenue) {
                          const venue = item.eventVenue.toLowerCase();
                          if (venue.includes('panvel')) location = 'Panvel';
                          else if (venue.includes('uran')) location = 'Uran';
                          else if (venue.includes('nhava')) location = 'Nhava';
                          else if (venue.includes('outstation')) location = 'Outstation';
                        }
                        let duration = 0;
                        if (item.workSub) {
                          const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                          if (match) duration = parseFloat(match[1]);
                        }
                        let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                        const priceKey = `${location}_${durationKey}`;
                        const rate = pricing[workType]?.[priceKey] ?? 0;
                        return sum + rate;
                      }, 0);
                      return (total * 0.09).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right' }}>SGST 9%</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right' }}>{(() => {
                      const total = selectedItems.reduce((sum, item) => {
                        let workType = (item.workMain || '').replace(/\s+/g, '_');
                        let location = 'Mumbai';
                        if (item.eventVenue) {
                          const venue = item.eventVenue.toLowerCase();
                          if (venue.includes('panvel')) location = 'Panvel';
                          else if (venue.includes('uran')) location = 'Uran';
                          else if (venue.includes('nhava')) location = 'Nhava';
                          else if (venue.includes('outstation')) location = 'Outstation';
                        }
                        let duration = 0;
                        if (item.workSub) {
                          const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                          if (match) duration = parseFloat(match[1]);
                        }
                        let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                        const priceKey = `${location}_${durationKey}`;
                        const rate = pricing[workType]?.[priceKey] ?? 0;
                        return sum + rate;
                      }, 0);
                      return (total * 0.09).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', textAlign: 'right' }}>Total</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{(() => {
                      const total = selectedItems.reduce((sum, item) => {
                        let workType = (item.workMain || '').replace(/\s+/g, '_');
                        let location = 'Mumbai';
                        if (item.eventVenue) {
                          const venue = item.eventVenue.toLowerCase();
                          if (venue.includes('panvel')) location = 'Panvel';
                          else if (venue.includes('uran')) location = 'Uran';
                          else if (venue.includes('nhava')) location = 'Nhava';
                          else if (venue.includes('outstation')) location = 'Outstation';
                        }
                        let duration = 0;
                        if (item.workSub) {
                          const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                          if (match) duration = parseFloat(match[1]);
                        }
                        let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                        const priceKey = `${location}_${durationKey}`;
                        const rate = pricing[workType]?.[priceKey] ?? 0;
                        return sum + rate;
                      }, 0);
                      return (total * 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                    })()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000', fontWeight: 'bold', textAlign: 'right' }}>{(() => {
                      const total = selectedItems.reduce((sum, item) => {
                        let workType = (item.workMain || '').replace(/\s+/g, '_');
                        let location = 'Mumbai';
                        if (item.eventVenue) {
                          const venue = item.eventVenue.toLowerCase();
                          if (venue.includes('panvel')) location = 'Panvel';
                          else if (venue.includes('uran')) location = 'Uran';
                          else if (venue.includes('nhava')) location = 'Nhava';
                          else if (venue.includes('outstation')) location = 'Outstation';
                        }
                        let duration = 0;
                        if (item.workSub) {
                          const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                          if (match) duration = parseFloat(match[1]);
                        }
                        let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                        const priceKey = `${location}_${durationKey}`;
                        const rate = pricing[workType]?.[priceKey] ?? 0;
                        return sum + rate;
                      }, 0);
                      const rounded = Math.round(total * 1.18);
                      return `Round Up Rs. (${numberToWords(rounded)})`;
                    })()}</TableCell>
                    <TableCell sx={{ border: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>{(() => {
                      const total = selectedItems.reduce((sum, item) => {
                        let workType = (item.workMain || '').replace(/\s+/g, '_');
                        let location = 'Mumbai';
                        if (item.eventVenue) {
                          const venue = item.eventVenue.toLowerCase();
                          if (venue.includes('panvel')) location = 'Panvel';
                          else if (venue.includes('uran')) location = 'Uran';
                          else if (venue.includes('nhava')) location = 'Nhava';
                          else if (venue.includes('outstation')) location = 'Outstation';
                        }
                        let duration = 0;
                        if (item.workSub) {
                          const match = item.workSub.match(/(\d+(?:\.\d+)?)\s*hour/i);
                          if (match) duration = parseFloat(match[1]);
                        }
                        let durationKey = duration > 4 ? 'Above_4_and_upto_8_Hrs' : 'Upto_4_Hrs';
                        const priceKey = `${location}_${durationKey}`;
                        const rate = pricing[workType]?.[priceKey] ?? 0;
                        return sum + rate;
                      }, 0);
                      const rounded = Math.round(total * 1.18);
                      return (
                        <>
                          {`${rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          <br/>
                        </>
                      );
                    })()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Event/Date Table between In Words and Signature Block */}
          <Box sx={{ p: 2, borderTop: '1px solid #000', mt: 0 }}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000', width: 100 }}>Event</TableCell>
                    <TableCell sx={{ border: '1px solid #000' }}>
                      {selectedItems.length === 1
                        ? `For ${selectedItems[0].eventName} ${selectedItems[0].workMain ? 'WOB' : ''} at ${selectedItems[0].eventVenue}, ${selectedItems[0].eventVenue && selectedItems[0].eventVenue.toLowerCase().includes('mumbai') ? 'Mumbai' : ''}`
                        : 'For Various events at various places..'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: '1px solid #000' }}>Date</TableCell>
                    <TableCell sx={{ border: '1px solid #000' }}>
                      {selectedItems.length === 1
                        ? new Date(selectedItems[0].date).toLocaleDateString('en-GB')
                        : 'Various Dates'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {/* Signature Block (Marathi) */}
          <Box sx={{ mt: 25, mb: 2, pr: 4, textAlign: 'center', paddingLeft: '50%' }}>
            <Typography variant="body2" sx={{ fontFamily: 'Mangal, Arial, sans-serif', fontSize: '1.1rem', lineHeight: 1.7 }}>
              केलिए<br/>
              निगमित संचार विभाग<br/>
              पहिली मंजिल, एनबीपी ग्रीन हाइट्स,<br/>
              बीकेसी-बांद्रा-ईस्ट-मुंबई
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default WorkOrderInvoice;
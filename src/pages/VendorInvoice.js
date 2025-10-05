import React, { useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField
} from '@mui/material';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './VendorInvoice.css';

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

// Helper to get amount for a work item
const getAmount = (item) => {
  return pricing[item.workMain]?.[item.workSub] || 0;
};

// Helper to convert number to words (simple version)
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

// Define reusable styles
const tableCellStyle = {
  border: '1px solid #000',
  p: '4px 8px',
};

const boldHeaderCellStyle = {
  ...tableCellStyle,
  fontWeight: 'bold',
};

const boldRightAlignedCellStyle = {
  ...boldHeaderCellStyle,
  textAlign: 'right',
};

const flexEndColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
};

const flexRowBetweenStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const borderBottomStyle = {
  borderBottom: '1px solid #000',
};

const borderRightStyle = {
  borderRight: '1px solid #000',
};

function VendorInvoice({ selectedItems }) {
  const [showBill, setShowBill] = useState(false);
  const [recipient, setRecipient] = useState(
    `OIL & NATURAL GAS CORPORATION LTD.\nCorporate Communication,\nN.B.P. Green Heights,\nBKC, Bandra (E),\nMumbai 400 051`
  );
  const [editingRecipient, setEditingRecipient] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('248/2025');
  const [editingInvoiceNumber, setEditingInvoiceNumber] = useState(false);
  const [dealingOfficer, setDealingOfficer] = useState('Bagmishree');
  const [editingDealingOfficer, setEditingDealingOfficer] = useState(false);
  const [emailId, setEmailId] = useState('bagmishree@ongc.co.in');
  const [editingEmailId, setEditingEmailId] = useState(false);
  const [vendorCode, setVendorCode] = useState('896180');
  const [editingVendorCode, setEditingVendorCode] = useState(false);
  const [poNumber, setPoNumber] = useState('');
  const [editingPoNumber, setEditingPoNumber] = useState(false);
  const [poDate, setPoDate] = useState('');
  const [editingPoDate, setEditingPoDate] = useState(false);
  const [serviceDescription, setServiceDescription] = useState('Photography, Videography');
  const [editingServiceDescription, setEditingServiceDescription] = useState(false);

  // Handle download bill
  const handleDownloadBill = () => {
    const billElement = document.getElementById('generated-bill');
    if (!billElement) {
      console.error('Bill element not found');
      return;
    }
    // Add large font class
    billElement.classList.add('pdf-bill-large');
    setTimeout(() => {
      html2canvas(billElement, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxWidth = pdfWidth - 2 * margin;
        const maxHeight = pdfHeight - 2 * margin;
        const imgPixelWidth = canvas.width;
        const imgPixelHeight = canvas.height;
        const pxPerMm = imgPixelWidth / billElement.offsetWidth;
        const imgWidthMm = imgPixelWidth / pxPerMm;
        const imgHeightMm = imgPixelHeight / pxPerMm;
        let renderWidth = imgWidthMm;
        let renderHeight = imgHeightMm;
        const widthScale = maxWidth / imgWidthMm;
        const heightScale = maxHeight / imgHeightMm;
        const scale = Math.min(widthScale, heightScale, 1);
        renderWidth = imgWidthMm * scale;
        renderHeight = imgHeightMm * scale;
        const x = (pdfWidth - renderWidth) / 2;
        const y = margin;
        pdf.addImage(
          imgData,
          'PNG',
          x,
          y,
          renderWidth,
          renderHeight,
          undefined,
          'MEDIUM'
        );
        pdf.save('vendor-invoice.pdf');
        // Remove large font class after rendering
        billElement.classList.remove('pdf-bill-large');
      });
    }, 100);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Vendor Invoice</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Select Work Items</Typography>
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

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => setShowBill(true)}
        disabled={selectedItems.length === 0}
      >
        Generate Bill
      </Button>

      {showBill && (
        <Paper id="generated-bill" sx={{ p: 0, mt: 3, mb: 3, border: '2px solid #000', background: '#fff' }}>
          {/* Header: Tabular layout */}
          <Box sx={{ display: 'flex', flexDirection: 'row', ...borderBottomStyle, alignItems: 'stretch' }}>
            {/* Left Column (Recipient) */}
            <Box sx={{ flex: 1, ...borderRightStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ p: 1, fontSize: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>To,</Typography>
                {editingRecipient ? (
                  <TextField
                    multiline
                    minRows={3}
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ background: '#fafafa' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                    onBlur={() => setEditingRecipient(false)}
                    autoFocus
                  />
                ) : (
                  <Box onClick={() => setEditingRecipient(true)} sx={{ cursor: 'pointer', minHeight: 60, whiteSpace: 'pre-line', p: 0.5 }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>{recipient}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
            {/* Right Column (Logo and Address) */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1, justifyContent: 'center', height: '100%' }}>
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                  <img src="/logo.png" alt="Company Logo" style={{ height: '100%', width: 'auto', maxHeight: 120 }} />
                </Box>
                <Box sx={{ textAlign: 'right', fontSize: '1.2rem' }}>
                  <Typography variant="body2">21, Nilkanth Aprtment, Samata Nagar,</Typography>
                  <Typography variant="body2">Pokharan Road No. 1, Thane (W) 400 606</Typography>
                  <Typography variant="body2">E-mail : bhogtevijay@gmail.com</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Dealing Officer, Email, GST No. below header */}
          <Box sx={{ display: 'flex', flexDirection: 'row', ...borderBottomStyle }}>
            <Box sx={{ flex: 1, ...borderRightStyle, p: 1, fontSize: '1.2rem' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}><span style={{ fontWeight: 'bold' }}>Dealing Officer :</span>
                {editingDealingOfficer ? (
                  <TextField
                    value={dealingOfficer}
                    onChange={e => setDealingOfficer(e.target.value)}
                    onBlur={() => setEditingDealingOfficer(false)}
                    autoFocus
                    size="small"
                    sx={{ ml: 1, background: '#fafafa' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                ) : (
                  <Box component="span" onClick={() => setEditingDealingOfficer(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontSize: '1.2rem' }}>{dealingOfficer}</Typography>
                  </Box>
                )}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}><span style={{ fontWeight: 'bold' }}>Email ID :</span>
                {editingEmailId ? (
                  <TextField
                    value={emailId}
                    onChange={e => setEmailId(e.target.value)}
                    onBlur={() => setEditingEmailId(false)}
                    autoFocus
                    size="small"
                    sx={{ ml: 1, background: '#fafafa' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                ) : (
                  <Box component="span" onClick={() => setEditingEmailId(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontSize: '1.2rem' }}>{emailId}</Typography>
                  </Box>
                )}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}><span style={{ fontWeight: 'bold' }}>GST No. :</span> <span style={{ fontSize: '1.25rem', verticalAlign: 'middle' }}>27AAAOC1598A1ZN</span></Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}><span style={{ fontWeight: 'bold' }}>PO No. :</span>
                {editingPoNumber ? (
                  <TextField
                    value={poNumber}
                    onChange={e => setPoNumber(e.target.value)}
                    onBlur={() => setEditingPoNumber(false)}
                    autoFocus
                    size="small"
                    sx={{ ml: 1, background: '#fafafa' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                ) : (
                  <Box component="span" onClick={() => setEditingPoNumber(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontSize: '1.2rem' }}>{poNumber || 'N/A'}</Typography>
                  </Box>
                )}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}><span style={{ fontWeight: 'bold' }}>PO Date :</span>
                {editingPoDate ? (
                  <TextField
                    value={poDate}
                    onChange={e => setPoDate(e.target.value)}
                    onBlur={() => setEditingPoDate(false)}
                    autoFocus
                    size="small"
                    sx={{ ml: 1, background: '#fafafa' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                ) : (
                  <Box component="span" onClick={() => setEditingPoDate(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontSize: '1.2rem' }}>{poDate || 'N/A'}</Typography>
                  </Box>
                )}
              </Typography>
            </Box>
            {/* Invoice Details (right) */}
            <Box sx={{ flex: 1, p: 1, fontSize: '1.2rem' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, ...borderBottomStyle, pb: 0.5 }}>
                {/* Invoice No. */}
                <Box sx={{ display: 'flex', alignItems: 'center', ...borderRightStyle, pr: 2, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Invoice No. :</Typography>
                  {editingInvoiceNumber ? (
                    <TextField
                      value={invoiceNumber}
                      onChange={e => setInvoiceNumber(e.target.value)}
                      onBlur={() => setEditingInvoiceNumber(false)}
                      autoFocus
                      size="small"
                      sx={{ width: 100, background: '#fafafa', ml: '8px' }}
                      InputProps={{ style: { fontSize: '1.2rem' } }}
                    />
                  ) : (
                    <Box component="span" onClick={() => setEditingInvoiceNumber(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                      <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{invoiceNumber}</Typography>
                    </Box>
                  )}
                </Box>
                {/* Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Date :</Typography>
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>{new Date().toLocaleDateString()}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mt: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Vendor Code :</Typography>
                {editingVendorCode ? (
                  <TextField
                    value={vendorCode}
                    onChange={e => setVendorCode(e.target.value)}
                    onBlur={() => setEditingVendorCode(false)}
                    autoFocus
                    size="small"
                    sx={{ width: 100, background: '#fafafa', ml: '8px' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                ) : (
                  <Box component="span" onClick={() => setEditingVendorCode(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{vendorCode}</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Place Of Supply :</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem', marginLeft: 4 }}>Mumbai</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Service Description :</Typography>
                {editingServiceDescription ? (
                  <TextField
                    value={serviceDescription}
                    onChange={e => setServiceDescription(e.target.value)}
                    onBlur={() => setEditingServiceDescription(false)}
                    autoFocus
                    size="small"
                    sx={{ width: 180, background: '#fafafa', ml: '8px' }}
                    InputProps={{ style: { fontSize: '1.2rem' } }}
                  />
                ) : (
                  <Box component="span" onClick={() => setEditingServiceDescription(true)} sx={{ cursor: 'pointer', borderBottom: '1px dashed #aaa', ml: 1 }}>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{serviceDescription}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          {/* Table */}
          <Table size="small" sx={{ borderCollapse: 'collapse', border: '1px solid #000', borderTop: 'none' }}>
            <TableHead>
              <TableRow sx={{ borderBottom: '1px solid #000' }}>
                <TableCell sx={boldHeaderCellStyle}>Sr. No</TableCell>
                <TableCell sx={boldHeaderCellStyle}>Description Of Items</TableCell>
                <TableCell sx={boldHeaderCellStyle}>Quantity</TableCell>
                <TableCell sx={boldHeaderCellStyle}>HSN Code</TableCell>
                <TableCell sx={boldRightAlignedCellStyle}>Rate Rs.</TableCell>
                <TableCell sx={boldRightAlignedCellStyle}>Amount Rs.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map((item, idx) => {
                const amount = getAmount(item);
                return (
                  <TableRow key={item._id} sx={{ borderBottom: '1px solid #000' }}>
                    <TableCell sx={tableCellStyle} align="center">{idx + 1}</TableCell>
                    <TableCell sx={tableCellStyle}>
                      <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        <span style={{ fontWeight: 'bold' }}>Event Date:</span> {new Date(item.date).toLocaleDateString()}<br />
                        <span style={{ fontWeight: 'bold' }}>Event Name:</span> {item.eventName}<br />
                        <span style={{ fontWeight: 'bold' }}>Venue:</span> {item.eventVenue || '-'}<br />
                        <span style={{ fontWeight: 'bold' }}>Work Type:</span> {item.workMain}<br />
                        <span style={{ fontWeight: 'bold' }}>Location and Duration:</span> {item.workSub}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>1</TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>99838</TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'right' }}>{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'right' }}>{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* Totals, Bank Details, and Signatory below the table */}
          {(() => {
            const amountBeforeTax = selectedItems.reduce((sum, item) => sum + getAmount(item), 0);
            const cgst = amountBeforeTax * 0.09;
            const sgst = amountBeforeTax * 0.09;
            const total = amountBeforeTax + cgst + sgst;
            const rounded = Math.round(total);
            return (
              <Box sx={{ fontSize: '1.1rem' }}>
                {/* Totals section (top right alignment) */}
                <Box sx={{ ...flexEndColumnStyle, alignItems: 'flex-end', ...borderBottomStyle, m: 1 }}>
                  <Box sx={{ width: 340, p: '8px', textAlign: 'right', m: 1 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 0.5, mb: 0, columnGap: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ gridColumn: '1 / 2', textAlign: 'left', whiteSpace: 'nowrap' }}
                      >
                        Amount Before Tax:
                      </Typography>
                      <Typography variant="body2" sx={{ gridColumn: '2 / 3', textAlign: 'right' }}>{amountBeforeTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                      <Typography variant="body2" sx={{ gridColumn: '1 / 2', textAlign: 'left' }}>CGST 9%:</Typography>
                      <Typography variant="body2" sx={{ gridColumn: '2 / 3', textAlign: 'right' }}>{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                      <Typography variant="body2" sx={{ gridColumn: '1 / 2', textAlign: 'left' }}>SGST 9%:</Typography>
                      <Typography variant="body2" sx={{ gridColumn: '2 / 3', textAlign: 'right' }}>{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                      <Typography variant="body2" sx={{ gridColumn: '1 / 2', textAlign: 'left', fontWeight: 'bold' }}>Total Amount Rs.:</Typography>
                      <Typography variant="body2" sx={{ gridColumn: '2 / 3', textAlign: 'right', fontWeight: 'bold' }}>{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    </Box>
                  </Box>
                </Box>
                {/* In Words and Round Up section */}
                <Box sx={{ display: 'flex', ...borderBottomStyle }}>
                  <Box sx={{ flex: 1, p: '8px', ...borderRightStyle }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      In Words: {numberToWords(rounded)}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 280, p: '8px', ...flexRowBetweenStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>Round up Rs.:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                </Box>
                {/* Bank Details and Signatory section */}
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ flex: 3, p: '8px', ...borderRightStyle, fontSize: '1rem' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>GST No. 27AAAOC1598A1ZN</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Pan No. ABJPB2133M</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>Bank Details:</Typography>
                    <Typography variant="body2">Bank Name: State Bank Of India</Typography>
                    <Typography variant="body2">Bank A/C No.: 34238902999</Typography>
                    <Typography variant="body2">Bank IFSC Code: SBIN0013035</Typography>
                  </Box>
                  <Box sx={{ width: 860, textAlign: 'center', display: 'flex' }}>
                    {/* Digital Signature Section */}
                    <Box sx={{ flex: 1, mr: 0.5, textAlign: 'center', ...borderRightStyle, pr: 1, height: '100%', py: '8px', ...flexEndColumnStyle }}>
                      {/* Digital signature area (placeholder) */}
                      <Box sx={{ height: 100, width: '90%', maxWidth: 220, mx: 'auto', mt: 1 }}>{/* Digital signature box */}</Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Digital Signature</Typography>
                    </Box>
                    {/* Authorised Signatory Section */}
                    <Box sx={{ flex: 1, ml: 2, textAlign: 'center', height: '100%', py: '8px', ...flexEndColumnStyle }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2 }}>For icomp Systems</Typography>
                      <Box sx={{ height: 100, width: '100%', maxWidth: 220, mx: 'auto', mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/signature.png" alt="Authorised Signatory Signature" style={{ width: '100%', maxWidth: 180, height: 'auto', objectFit: 'contain' }} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Authorised Signatory</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })()}
        </Paper>
      )}

      {showBill && selectedItems.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, mb: 3 }}
          onClick={handleDownloadBill}
        >
          Download Bill (PDF)
        </Button>
      )}
    </Box>
  );
}

export default VendorInvoice;
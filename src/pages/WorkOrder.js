import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import api from '../services/api';

// --- Your Data Arrays (Kept Exactly as You Provided) ---
const subWorks = {
  "Still_Photography": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Videography": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Two_Camera_Setup": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Three_Camera_Setup": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Live_Telecast": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"]
};
const vendors = ['ICOMP SYSTEMS', 'STUDIO VISION', 'WAGHSONS PHOTO VISION'];
const venues = [
  'NBP Green Heights, BKC, Bandra (East), Mumbai - 400051',
  'Vasudhara Bhavan, Western Express Highway, Bandra (East), Mumbai – 400051',
  '11 High, Sion-Bandra Link Rd, Sion West, Mumbai - 400017',
  'Helibase, Airport area, Juhu, Mumbai - 400049',
  "Maker Tower 'E', Chamundeshwari Nagar, Cuffe Parade, Mumbai - 400005",
  'Phase-I, Panvel, Navi Mumbai – 410221',
  'Phase-II, Panvel, Navi Mumbai – 410221',
  'Uran Plant, Dronagiri Bhavan, Uran, Distt Raigad 400702',
  'Nhava Supply Base, Navi Mumbai - 410206',
  'Others'
];

function WorkOrder() {
  // --- State Management ---
  const [entryNumber, setEntryNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [workItems, setWorkItems] = useState([{
    eventName: '', poNpo: 'PO', eventTime: '', eventVenue: '', contactPerson: '',
    contactNumber: '', workMain: '', workSub: '', customVenue: '', customWorkMain: ''
  }]);

  // --- Your Form Handlers ---
  const handleAddWorkItem = () => {
    setWorkItems([...workItems, {
      eventName: '', poNpo: 'PO', eventTime: '', eventVenue: '', contactPerson: '',
      contactNumber: '', workMain: '', workSub: '', customVenue: '', customWorkMain: ''
    }]);
  };

  const handleRemoveWorkItem = (index) => {
    const newWorkItems = workItems.filter((_, i) => i !== index);
    setWorkItems(newWorkItems);
  };

  const handleWorkItemChange = (index, field, value) => {
    const newWorkItems = [...workItems];
    newWorkItems[index] = { ...newWorkItems[index], [field]: value };
    setWorkItems(newWorkItems);
  };

  // --- API Interaction Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entryNumber || !eventDate || !vendor) {
      alert('Please fill in all required fields');
      return;
    }
    const workOrderToSubmit = {
      entryNumber,
      eventDate,
      vendor,
      workItems: workItems.map(item => ({
        ...item,
        eventVenue: item.eventVenue === 'Others' ? item.customVenue || '' : item.eventVenue,
        workMain: item.workMain === 'Others' ? item.customWorkMain || '' : item.workMain,
      }))
    };

    try {
      await api.post('/work-orders', workOrderToSubmit);
      alert('Work order submitted successfully!');
      // Reset form
      setEntryNumber('');
      setEventDate('');
      setVendor('');
      setWorkItems([{
        eventName: '', poNpo: 'PO', eventTime: '', eventVenue: '', contactPerson: '',
        contactNumber: '', workMain: '', workSub: '', customVenue: '', customWorkMain: ''
      }]);
    } catch (error) {
      console.error('Error submitting work order:', error);
      alert('Failed to submit work order. See console for details.');
    }
  };

  const handleDownloadImage = async (index) => {
    const element = document.getElementById(`work-item-${index}`);
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', logging: false });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `work-order-${entryNumber || 'new'}-item-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image.');
    }
  };

  // --- JSX / Rendering ---
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Event Data Entry Form
        </Typography>
        <form onSubmit={handleSubmit}>
         <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
           <TextField
             label="Entry Number"
             value={entryNumber}
             onChange={(e) => setEntryNumber(e.target.value)}
             required
             inputProps={{ maxLength: 5, style: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' } }}
             sx={{ minWidth: 100 }}
           />
           <TextField
             label="Event Date"
             type="date"
             value={eventDate}
             onChange={(e) => setEventDate(e.target.value)}
             InputLabelProps={{ shrink: true }}
             required
             sx={{ minWidth: 260 }}
           />
           <FormControl required sx={{ minWidth: 260 }}>
             <InputLabel>Vendor</InputLabel>
             <Select
               value={vendor}
               onChange={(e) => setVendor(e.target.value)}
               label="Vendor"
               MenuProps={{ PaperProps: { sx: { minWidth: 260 } } }}
             >
               {vendors.map((v) => (
                 <MenuItem key={v} value={v}>{v}</MenuItem>
               ))}
             </Select>
           </FormControl>
         </Box>

         {workItems.map((item, index) => (
           <Paper key={index} id={`work-item-${index}`} sx={{ p: 2, mt: 2, position: 'relative', border: '1px solid #eee' }}>
             <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
               <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                 <Typography variant="subtitle1">
                   <strong>Entry Number:</strong> {entryNumber}
                 </Typography>
                 <Typography variant="subtitle1">
                   <strong>Event Date:</strong> {eventDate}
                 </Typography>
                 <Typography variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
                   <strong>Vendor:</strong> {vendor}
                 </Typography>
               </Box>
             </Box>
             <Grid container spacing={2}>
               {/* All your Grid items for the form are correct */}
               <Grid item xs={12} sm={6}>
                 <TextField fullWidth label="Event Name" value={item.eventName} onChange={(e) => handleWorkItemChange(index, 'eventName', e.target.value)} required sx={{ minWidth: 260 }} />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required sx={{ minWidth: 260 }}>
                    <InputLabel>Event Venue</InputLabel>
                    <Select value={item.eventVenue} onChange={(e) => handleWorkItemChange(index, 'eventVenue', e.target.value)} label="Event Venue" MenuProps={{ PaperProps: { sx: { minWidth: 260 } } }}>
                      {venues.map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>))}
                    </Select>
                  </FormControl>
                  {item.eventVenue === 'Others' && (<TextField fullWidth label="Custom Venue" value={item.customVenue || ''} onChange={(e) => handleWorkItemChange(index, 'customVenue', e.target.value)} required sx={{ minWidth: 260, mt: 1 }}/>)}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Event Time" type="time" value={item.eventTime} onChange={(e) => handleWorkItemChange(index, 'eventTime', e.target.value)} InputLabelProps={{ shrink: true }} required sx={{ minWidth: 260 }}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ minWidth: 260 }}>
                        <InputLabel>PO/NPO</InputLabel>
                        <Select value={item.poNpo} onChange={(e) => handleWorkItemChange(index, 'poNpo', e.target.value)} label="PO/NPO" MenuProps={{ PaperProps: { sx: { minWidth: 260 } } }}>
                            <MenuItem value="PO">PO</MenuItem>
                            <MenuItem value="NPO">NPO</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ minWidth: 260 }}>
                        <InputLabel>Work Name</InputLabel>
                        <Select value={item.workMain} onChange={(e) => handleWorkItemChange(index, 'workMain', e.target.value)} label="Work Name" MenuProps={{ PaperProps: { sx: { minWidth: 260 } } }}>
                            <MenuItem value="">Select Work</MenuItem>
                            <MenuItem value="Still_Photography">Still Photography</MenuItem>
                            <MenuItem value="Videography">Videography</MenuItem>
                            <MenuItem value="Two_Camera_Setup">Two Video Cameras Live Setup</MenuItem>
                            <MenuItem value="Three_Camera_Setup">Three Video Cameras Live Setup</MenuItem>
                            <MenuItem value="Live_Telecast">Live Telecast Setup</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                    {item.workMain === 'Others' && (<TextField fullWidth label="Custom Work Name" value={item.customWorkMain || ''} onChange={(e) => handleWorkItemChange(index, 'customWorkMain', e.target.value)} required sx={{ minWidth: 260, mt: 1 }}/>)}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required sx={{ minWidth: 260 }}>
                        <InputLabel>Work Subcategory</InputLabel>
                        <Select value={item.workSub} onChange={(e) => handleWorkItemChange(index, 'workSub', e.target.value)} label="Work Subcategory" disabled={!item.workMain} MenuProps={{ PaperProps: { sx: { minWidth: 260 } } }}>
                            <MenuItem value="">Select Sub Work</MenuItem>
                            {item.workMain === 'Others' ? Array.from(new Set(Object.values(subWorks).flat())).map((sub) => (<MenuItem key={sub} value={sub}>{sub.replaceAll('_', ' ')}</MenuItem>))
                            : Array.isArray(subWorks[item.workMain]) && subWorks[item.workMain].map((sub) => (<MenuItem key={sub} value={sub}>{sub.replaceAll('_', ' ')}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Contact Person Name" value={item.contactPerson} onChange={(e) => handleWorkItemChange(index, 'contactPerson', e.target.value)} required sx={{ minWidth: 260 }}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Contact Person Number" value={item.contactNumber} onChange={(e) => handleWorkItemChange(index, 'contactNumber', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} required inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*', style: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' } }} sx={{ minWidth: 260 }}/>
                </Grid>
               <Grid item xs={12}>
                 <Box display="flex" justifyContent="space-between">
                   <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveWorkItem(index)}>
                     Remove Item
                   </Button>
                   <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} onClick={() => handleDownloadImage(index)}>
                     Download Image
                   </Button>
                 </Box>
               </Grid>
             </Grid>
           </Paper>
         ))}

         <Box mt={2} display="flex" justifyContent="space-between">
           <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddWorkItem}>
             Add Work Item
           </Button>
           <Button type="submit" variant="contained" color="primary" size="large">
             Submit Work Order
           </Button>
         </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default WorkOrder;
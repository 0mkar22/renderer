import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

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

const subWorks = {
  "Still_Photography": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Videography": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Two_Camera_Setup": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Three_Camera_Setup": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"],
  "Live_Telecast": ["Mumbai_Upto_4_Hrs", "Mumbai_Above_4_and_upto_8_Hrs", "Panvel_Upto_4_Hrs", "Panvel_Above_4_and_upto_8_Hrs", "Uran_Upto_4_Hrs", "Uran_Above_4_and_upto_8_Hrs", "Nhava_Upto_4_Hrs", "Nhava_Above_4_and_upto_8_Hrs", "Outstation_Upto_4_Hrs", "Outstation_Above_4_and_upto_8_Hrs"]
};

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

// Helper function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Reports() {
  const navigate = useNavigate();
  const [workItems, setWorkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('');
  const [vendors, setVendors] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;
  const [monthFilter, setMonthFilter] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemData, setEditedItemData] = useState(null);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/work-orders');
      const allWorkItems = response.data.flatMap(order =>
        order.workItems.map(item => ({
          ...item,
          parentWorkOrderId: order._id,
          entryNumber: order.entryNumber,
          date: order.eventDate,
          vendor: order.vendor
        }))
      );
      setWorkItems(allWorkItems);
      
      // Extract unique vendors and work types
      const uniqueVendors = [...new Set(allWorkItems.map(item => item.vendor))];
      const uniqueWorkTypes = [...new Set(allWorkItems.map(item => item.workMain))];
      setVendors(uniqueVendors);
      setWorkTypes(uniqueWorkTypes);
    } catch (error) {
      console.error('Error fetching work items:', error);
      setError('Failed to fetch work orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = () => {
    let sortedItems = [...workItems];
    
    // Apply search filter
    if (searchTerm) {
      sortedItems = sortedItems.filter(item =>
        item.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eventVenue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workMain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply month filter
    if (monthFilter) {
      sortedItems = sortedItems.filter(item => {
        if (!item.date) return false;
        const itemDate = new Date(item.date);
        const [filterYear, filterMonth] = monthFilter.split('-');
        return (
          itemDate.getFullYear() === parseInt(filterYear, 10) &&
          itemDate.getMonth() + 1 === parseInt(filterMonth, 10)
        );
      });
    }

    // Apply vendor filter
    if (vendorFilter) {
      sortedItems = sortedItems.filter(item => item.vendor === vendorFilter);
    }

    // Apply work type filter
    if (workTypeFilter) {
      sortedItems = sortedItems.filter(item => item.workMain === workTypeFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortedItems;
  };

  const handleExportToExcel = () => {
    const filteredItems = getSortedItems();
    
    // Calculate totals
    const totalAmount = filteredItems.reduce((sum, item) => sum + (pricing[item.workMain]?.[item.workSub] || 0), 0);
    const totalAmountWithGst = filteredItems.reduce((sum, item) => sum + ((pricing[item.workMain]?.[item.workSub] || 0) * 1.18), 0);
    
    // Create data rows
    const data = filteredItems.map((item, idx) => ({
      'Entry Number': item.entryNumber,
      'Sr. No': idx + 1,
      'Event Date': new Date(item.date).toLocaleDateString('en-GB'),
      'Vendor': item.vendor,
      'Event Name': item.eventName,
      'Event Venue': item.eventVenue,
      'Event Time': item.eventTime,
      'PO/NPO': item.poNpo,
      'Work Type': `${item.workMain.replaceAll('_', ' ')}${item.workSub ? ' - ' + item.workSub.replaceAll('_', ' ') : ''}`,
      'Contact Person': item.contactPerson,
      'Contact Number': item.contactNumber,
      'Amount': pricing[item.workMain]?.[item.workSub] || 0,
      'Amount with GST': (pricing[item.workMain]?.[item.workSub] * 1.18) || 0
    }));

    // Add total row
    data.push({
      'Entry Number': '',
      'Sr. No': '',
      'Event Date': '',
      'Vendor': '',
      'Event Name': '',
      'Event Venue': '',
      'Event Time': '',
      'PO/NPO': '',
      'Work Type': '',
      'Contact Person': '',
      'Contact Number': 'Total Amount:',
      'Amount': totalAmount,
      'Amount with GST': totalAmountWithGst
    });

    const ws = XLSX.utils.json_to_sheet(data);

    // Apply formatting to the total row
    const lastRow = data.length;
    const totalRowStyle = { font: { bold: true }, fill: { fgColor: { rgb: "CCCCCC" } } };
    
    // Style the total row
    ws['K' + lastRow].s = totalRowStyle; // Contact Number column ("Total Amount:" text)
    ws['L' + lastRow].s = totalRowStyle; // Amount column
    ws['M' + lastRow].s = totalRowStyle; // Amount with GST column

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Work Orders');
    XLSX.writeFile(wb, 'work_orders_report.xlsx');
  };

  const handleExportToPDF = () => {
    const filteredItems = getSortedItems();
    
    // Calculate totals
    const totalAmount = filteredItems.reduce((sum, item) => sum + (pricing[item.workMain]?.[item.workSub] || 0), 0);
    const totalAmountWithGst = filteredItems.reduce((sum, item) => sum + ((pricing[item.workMain]?.[item.workSub] || 0) * 1.18), 0);

    // Create PDF in landscape mode
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Set smaller margins for more space
    const pageMargin = 8;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add title more compactly
    doc.setFontSize(14);
    doc.text('Work Orders Report', pageWidth / 2, pageMargin + 5, { align: 'center' });
    
    // Add date with smaller text
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageMargin + 12, { align: 'center' });

    // Calculate available width for table
    const tableWidth = pageWidth - (2 * pageMargin);
    
    // Define columns and their widths in mm for landscape A4
    const availableWidth = pageWidth - (2 * pageMargin); // Calculate available width
    
    // Define column widths proportionally
    const columns = [
      { header: 'Entry No', width: availableWidth * 0.06 }, // 6%
      { header: 'Sr. No', width: availableWidth * 0.04 }, // 4%
      { header: 'Date', width: availableWidth * 0.07 }, // 7%
      { header: 'Vendor', width: availableWidth * 0.12 }, // 12%
      { header: 'Event Name', width: availableWidth * 0.12 }, // 12%
      { header: 'Venue', width: availableWidth * 0.12 }, // 12%
      { header: 'Time', width: availableWidth * 0.06 }, // 6%
      { header: 'PO/NPO', width: availableWidth * 0.06 }, // 6%
      { header: 'Work Type', width: availableWidth * 0.12 }, // 12%
      { header: 'Contact', width: availableWidth * 0.07 }, // 7%
      { header: 'Phone', width: availableWidth * 0.07 }, // 7%
      { header: 'Amount', width: availableWidth * 0.045 }, // 4.5%
      { header: 'Amount+GST', width: availableWidth * 0.045 } // 4.5%
    ];
    
    // Convert relative widths to actual widths
    columns.forEach(col => {
      col.width = (col.width / 100) * tableWidth;
    });

    // Set initial positions and dimensions for maximum space efficiency
    let currentX = pageMargin;
    let currentY = pageMargin + 15; // Start table even closer to top
    const rowHeight = 6; // Minimum readable row height
    const cellPadding = 1; // Minimum padding
    
    // Set smaller font size for better fit
    doc.setFontSize(6); // Smaller but still readable font size

    // Function to draw cell with border and handle text wrapping
    const drawCell = (text, width, isHeader = false, align = 'left') => {
      // Draw cell border
      doc.rect(currentX, currentY - 6, width, rowHeight);
      
      // Fill header cells
      if (isHeader) {
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, currentY - 6, width, rowHeight, 'F');
      }
      
      // Add text
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
      
      // Handle text wrapping and alignment
      const maxWidth = width - (2 * cellPadding);
      let textLines = doc.splitTextToSize(text.toString(), maxWidth);
      
      // Limit to one line and add ellipsis if too long
      if (textLines.length > 1) {
        textLines = [textLines[0].substring(0, textLines[0].length - 3) + '...'];
      }
      
      let xPos = currentX + cellPadding;
      if (align === 'right') {
        xPos = currentX + width - cellPadding - doc.getStringUnitWidth(textLines[0]) * doc.getFontSize() / doc.internal.scaleFactor;
      } else if (align === 'center') {
        xPos = currentX + (width - doc.getStringUnitWidth(textLines[0]) * doc.getFontSize() / doc.internal.scaleFactor) / 2;
      }
      
      doc.text(textLines[0], xPos, currentY);
      currentX += width;
    };

    // Draw table header
    columns.forEach(col => {
      drawCell(col.header, col.width, true, 'center');
    });

    // Start drawing table content
    doc.setFont('helvetica', 'normal');
    currentY += rowHeight;

    // Calculate number of rows that fit per page
    const usablePageHeight = pageHeight - (2 * pageMargin) - 20; // Account for margins and headers
    const rowsPerPage = Math.floor(usablePageHeight / rowHeight);
    const addNewPage = () => {
      doc.addPage();
      currentY = pageMargin + 15;
      
      // Add page header
      doc.setFontSize(8);
      doc.text('Work Orders Report - Continued', pageWidth / 2, pageMargin + 5, { align: 'center' });
      
      // Redraw table header
      currentX = pageMargin;
      doc.setFontSize(6);
      columns.forEach(col => {
        drawCell(col.header, col.width, true, 'center');
      });
      currentY += rowHeight;
    };

    // Add table rows
    let rowsOnCurrentPage = 0;

    filteredItems.forEach((item, idx) => {
      // Check if we need a new page based on rows count
      if (rowsOnCurrentPage >= rowsPerPage) {
        addNewPage();
        rowsOnCurrentPage = 0;
      }

      currentX = pageMargin;
      
      const rowData = [
        item.entryNumber,
        (idx + 1).toString(),
        new Date(item.date).toLocaleDateString('en-GB'),
        item.vendor,
        item.eventName,
        item.eventVenue,
        item.eventTime,
        item.poNpo,
        `${item.workMain.replaceAll('_', ' ')}${item.workSub ? ' - ' + item.workSub.replaceAll('_', ' ') : ''}`,
        item.contactPerson,
        item.contactNumber,
        `₹${(pricing[item.workMain]?.[item.workSub] || 0).toLocaleString('en-IN')}`,
        `₹${((pricing[item.workMain]?.[item.workSub] || 0) * 1.18).toLocaleString('en-IN')}`
      ];

      // Draw each cell in the row
      columns.forEach((col, i) => {
        const align = i >= 11 ? 'right' : // Amount columns right-aligned
                     i <= 1 ? 'center' : // Entry No and Sr. No center-aligned
                     'left'; // Other columns left-aligned
        drawCell(rowData[i].toString(), col.width, false, align);
      });

      currentY += rowHeight;
      rowsOnCurrentPage++;
    });

    // Add total row - ensure it's on a new page if needed
    if (rowsOnCurrentPage >= rowsPerPage) {
      addNewPage();
      rowsOnCurrentPage = 0;
    }

    // Add some space before totals
    currentY += 2;
    
    currentX = pageMargin;
    doc.setFont('helvetica', 'bold');

    // Draw total row cells
    columns.forEach((col, i) => {
      const text = i === 11 ? `₹${totalAmount.toLocaleString('en-IN')}` :
                  i === 12 ? `₹${totalAmountWithGst.toLocaleString('en-IN')}` :
                  i === 10 ? 'Total Amount:' :
                  '';
      
      const align = i >= 11 ? 'right' : // Amount columns right-aligned
                   i === 10 ? 'right' : // "Total Amount:" right-aligned
                   'left'; // Other columns left-aligned
      
      drawCell(text, col.width, true, align);
    });

    // Add page numbers to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - pageMargin, pageHeight - 5, { align: 'right' });
    }

    doc.save('work_orders_report.pdf');
    return; // Ensure the function ends here
  };

  const handleEditWorkItem = (item) => {
    setEditingItem(item);
    setEditedItemData({ ...item, date: formatDateToYYYYMMDD(item.date) });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingItem(null);
    setEditedItemData(null);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditedItemData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!editedItemData || !editedItemData._id || !editedItemData.parentWorkOrderId) {
      alert('Item data or parent work order ID is missing.');
      return;
    }

    try {
      // 1. Fetch the full parent work order
      const parentWorkOrderResponse = await axios.get(
        `http://localhost:5000/api/work-orders/${editedItemData.parentWorkOrderId}`
      );
      const parentWorkOrder = parentWorkOrderResponse.data;

      // 2. Find the index of the work item to be updated
      const itemIndex = parentWorkOrder.workItems.findIndex(
        (item) => item._id === editedItemData._id
      );

      if (itemIndex === -1) {
        alert('Could not find the work item in the parent work order.');
        return;
      }

      // 3. Update the specific work item in the parent work order's workItems array
      const updatedWorkItems = [...parentWorkOrder.workItems];
      // Create the updated item data, renaming date to eventDate
      const updatedItemData = { ...editedItemData };
      updatedItemData.eventDate = updatedItemData.date; // Rename date to eventDate
      delete updatedItemData.date; // Remove the old date field

      updatedWorkItems[itemIndex] = updatedItemData;

      // 4. Prepare the full parent work order data to send back
      const updatedParentWorkOrder = {
        ...parentWorkOrder,
        workItems: updatedWorkItems,
        // Ensure eventDate and vendor from the form are used if they were added to editedItemData
        // Note: Currently, only individual work item fields are in the modal,
        // but if parent fields were added, they would be included here.
        eventDate: editedItemData.date ? editedItemData.date : parentWorkOrder.eventDate, // Use the potentially updated date
        vendor: editedItemData.vendor ? editedItemData.vendor : parentWorkOrder.vendor // Use the potentially updated vendor
      };
       // Frontend date format YYYY-MM-DD, backend expects eventDate. Ensure consistency.
       if(updatedParentWorkOrder.eventDate) {
           updatedParentWorkOrder.eventDate = formatDateToYYYYMMDD(updatedParentWorkOrder.eventDate);
       }


      // 5. Send the updated parent work order to the backend
      const response = await axios.put(
        `http://localhost:5000/api/work-orders/${updatedParentWorkOrder._id}`,
        updatedParentWorkOrder
      );

      if (response.data) {
        alert('Work item updated successfully!');
        handleCloseEditModal();
        fetchWorkOrders(); // Refresh data in the report
      } else {
        alert('Failed to update work item.');
      }
    } catch (error) {
      console.error('Error updating work item:', error);
      // Handle different types of errors
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to update work item.';
        const errorDetails = error.response.data.errors || [];
        if (errorDetails.length > 0) {
          alert(`Validation Error:\n${errorDetails.join('\n')}`);
        } else {
          alert(errorMessage);
        }
      } else if (error.request) {
        alert('No response from server. Please check your connection.');
      } else {
        alert('Error setting up the request. Please try again.');
      }
    }
  };

  const renderTable = () => {
    const sortedItems = getSortedItems();
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = sortedItems.slice(startIndex, endIndex);
    
    // Calculate totals for all filtered items
    const totalAmount = sortedItems.reduce((sum, item) => {
      const amount = pricing[item.workMain]?.[item.workSub] || 0;
      return sum + amount;
    }, 0);
    
    const totalAmountWithGst = sortedItems.reduce((sum, item) => {
      const amount = pricing[item.workMain]?.[item.workSub] || 0;
      return sum + (amount * 1.18);
    }, 0);

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('entryNumber')} sx={{ cursor: 'pointer' }}>
                Entry Number {sortConfig.key === 'entryNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>
                Sr. No
              </TableCell>
              <TableCell onClick={() => handleSort('date')} sx={{ cursor: 'pointer' }}>
                Event Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('vendor')} sx={{ cursor: 'pointer' }}>
                Vendor {sortConfig.key === 'vendor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('eventName')} sx={{ cursor: 'pointer' }}>
                Event Name {sortConfig.key === 'eventName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('eventVenue')} sx={{ cursor: 'pointer' }}>
                Event Venue {sortConfig.key === 'eventVenue' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('eventTime')} sx={{ cursor: 'pointer' }}>
                Event Time {sortConfig.key === 'eventTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('poNpo')} sx={{ cursor: 'pointer' }}>
                PO/NPO {sortConfig.key === 'poNpo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('workMain')} sx={{ cursor: 'pointer' }}>
                Work Type {sortConfig.key === 'workMain' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('contactPerson')} sx={{ cursor: 'pointer' }}>
                Contact Person {sortConfig.key === 'contactPerson' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('contactNumber')} sx={{ cursor: 'pointer' }}>
                Contact Number {sortConfig.key === 'contactNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('amount')} sx={{ cursor: 'pointer' }}>
                Amount without GST  {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('gstAmount')} sx={{ cursor: 'pointer' }}>
                Amount with GST {sortConfig.key === 'gstAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.entryNumber}</TableCell>
                <TableCell>{index + 1 + startIndex}</TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>{item.vendor}</TableCell>
                <TableCell>{item.eventName}</TableCell>
                <TableCell>{item.eventVenue}</TableCell>
                <TableCell>{item.eventTime}</TableCell>
                <TableCell>{item.poNpo}</TableCell>
                <TableCell>{`${item.workMain.replaceAll('_', ' ')}${item.workSub ? ' - ' + item.workSub.replaceAll('_', ' ') : ''}`}</TableCell>
                <TableCell>{item.contactPerson}</TableCell>
                <TableCell>{item.contactNumber}</TableCell>
                <TableCell>{pricing[item.workMain]?.[item.workSub] ? `₹${(pricing[item.workMain]?.[item.workSub] || 0).toLocaleString('en-IN')}` : ''}</TableCell>
                <TableCell>{pricing[item.workMain]?.[item.workSub] ? `₹${(pricing[item.workMain]?.[item.workSub] * 1.18 || 0).toLocaleString('en-IN')}` : ''}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditWorkItem(item)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell 
                colSpan={11} 
                sx={{ 
                  fontWeight: 'bold', 
                  textAlign: 'right',
                  fontSize: '1.2rem'
                }}
              >
                Total Amount:
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: '#1976d2'
                }}
              >
                ₹{totalAmount.toLocaleString('en-IN')}
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: '#1976d2'
                }}
              >
                ₹{totalAmountWithGst.toLocaleString('en-IN')}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
          <Pagination
            count={Math.ceil(getSortedItems().length / itemsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Main Page
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Work Orders Report
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <TextField
            label="Month"
            type="month"
            size="small"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            sx={{ minWidth: 160 }}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Vendor</InputLabel>
            <Select
              value={vendorFilter}
              label="Vendor"
              onChange={(e) => setVendorFilter(e.target.value)}
            >
              <MenuItem value="">All Vendors</MenuItem>
              {vendors.map((vendor) => (
                <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Work Type</InputLabel>
            <Select
              value={workTypeFilter}
              label="Work Type"
              onChange={(e) => setWorkTypeFilter(e.target.value)}
            >
              <MenuItem value="">All Work Types</MenuItem>
              {workTypes.map((type) => (
                <MenuItem key={type} value={type}>{type.replaceAll('_', ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="success"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportToExcel}
          >
            Export to Excel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportToPDF}
          >
            Export to PDF
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : workItems.length === 0 ? (
          <Alert severity="info">
            No work orders found. Please add some work orders first.
          </Alert>
        ) : (
          renderTable()
        )}
      </Paper>

      {/* Edit Modal */}
      {
        editModalOpen && editingItem && editedItemData && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
              overflowY: 'auto',
            }}
          >
            <Paper sx={{ p: 3, width: '90%', maxWidth: 600 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Edit Work Item</Typography>
                <Button size="small" onClick={handleCloseEditModal}>
                  <CloseIcon />
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Entry Number"
                    name="entryNumber"
                    value={editedItemData.entryNumber || ''}
                    onChange={handleEditInputChange}
                    required
                    inputProps={{ maxLength: 5, style: { textAlign: 'center', fontVariantNumeric: 'tabular-nums' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      label="Vendor"
                      name="vendor"
                      value={editedItemData.vendor || ''}
                      onChange={handleEditInputChange}
                      MenuProps={{ PaperProps: { sx: { minWidth: 260 } } }}
                    >
                      {vendors.map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    name="eventName"
                    value={editedItemData.eventName || ''}
                    onChange={handleEditInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>PO/NPO</InputLabel>
                    <Select
                      label="PO/NPO"
                      name="poNpo"
                      value={editedItemData.poNpo || 'PO'}
                      onChange={handleEditInputChange}
                    >
                      <MenuItem value="PO">PO</MenuItem>
                      <MenuItem value="NPO">NPO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Time"
                    type="time"
                    name="eventTime"
                    value={editedItemData.eventTime || ''}
                    onChange={handleEditInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Event Venue</InputLabel>
                    <Select
                      label="Event Venue"
                      name="eventVenue"
                      value={editedItemData.eventVenue || ''}
                      onChange={handleEditInputChange}
                    >
                      {venues.map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {editedItemData.eventVenue === 'Others' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Custom Venue"
                      name="customVenue"
                      value={editedItemData.customVenue || ''}
                      onChange={handleEditInputChange}
                      required
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Person Name"
                    name="contactPerson"
                    value={editedItemData.contactPerson || ''}
                    onChange={handleEditInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Person Number"
                    name="contactNumber"
                    value={editedItemData.contactNumber || ''}
                    onChange={handleEditInputChange}
                    required
                    inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                  />
                </Grid>
                 <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Work Name</InputLabel>
                    <Select
                      label="Work Name"
                      name="workMain"
                      value={editedItemData.workMain || ''}
                      onChange={handleEditInputChange}
                    >
                      <MenuItem value="">Select Work</MenuItem>
                      <MenuItem value="Still_Photography">Still Photography</MenuItem>
                      <MenuItem value="Videography">Videography</MenuItem>
                      <MenuItem value="Two_Camera_Setup">Two Video Cameras Live Setup</MenuItem>
                      <MenuItem value="Three_Camera_Setup">Three Video Cameras Live Setup</MenuItem>
                      <MenuItem value="Live_Telecast">Live Telecast Setup</MenuItem>
                       <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {editedItemData.workMain === 'Others' && (
                  <Grid item xs={12} sm={6}>
                     <TextField
                      fullWidth
                      label="Custom Work Name"
                      name="customWorkMain"
                      value={editedItemData.customWorkMain || ''}
                      onChange={handleEditInputChange}
                      required
                    />
                  </Grid>
                )}
                 <Grid item xs={12} sm={6}>
                   <FormControl fullWidth required disabled={!editedItemData.workMain}>
                     <InputLabel>Work Subcategory</InputLabel>
                     <Select
                       label="Work Subcategory"
                       name="workSub"
                       value={editedItemData.workSub || ''}
                       onChange={handleEditInputChange}
                     >
                       <MenuItem value="">Select Sub Work</MenuItem>
                         {editedItemData.workMain === 'Others'
                           ? Array.from(new Set(Object.values(subWorks).flat())).map((sub) => (
                               <MenuItem key={sub} value={sub}>
                                 {sub.replaceAll('_', ' ')}
                               </MenuItem>
                             ))
                           : editedItemData.workMain && Array.isArray(subWorks[editedItemData.workMain]) && subWorks[editedItemData.workMain].map((sub) => (
                               <MenuItem key={sub} value={sub}>
                                 {sub.replaceAll('_', ' ')}
                               </MenuItem>
                             ))}
                     </Select>
                   </FormControl>
                 </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Date"
                    type="date"
                    name="date"
                    value={editedItemData.date || ''}
                    onChange={handleEditInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="contained" color="secondary" onClick={handleCloseEditModal} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Box>
            </Paper>
          </Box>
        )
      }
    </Container>
  );
}

export default Reports;
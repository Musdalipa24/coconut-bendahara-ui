import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon, PictureAsPdf as PdfIcon, TableView as ExcelIcon } from '@mui/icons-material';

export default function DownloadMenu({ anchorEl, open, handleClose, generatePDF, exportToExcel }) {
  const handlePDFDownload = async () => {
    try {
      await generatePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', minWidth: { xs: '200px', sm: '250px' } } }}
    >
      <MenuItem onClick={handlePDFDownload} sx={{ py: { xs: 1.5, sm: 1 } }}>
        <PdfIcon sx={{ mr: 1, color: '#f44336' }} /> Unduh PDF
      </MenuItem>
      <MenuItem onClick={exportToExcel} sx={{ py: { xs: 1.5, sm: 1 } }}>
        <ExcelIcon sx={{ mr: 1, color: '#4CAF50' }} /> Unduh Excel
      </MenuItem>
    </Menu>
  );
}

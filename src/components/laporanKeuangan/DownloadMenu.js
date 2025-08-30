import React from 'react';
import { Menu, MenuItem, useTheme } from '@mui/material';
import { FileDownload as FileDownloadIcon, PictureAsPdf as PdfIcon, TableView as ExcelIcon } from '@mui/icons-material';

export default function DownloadMenu({ anchorEl, open, handleClose, generatePDF, exportToExcel }) {
  const theme = useTheme();
  
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
      sx={{ 
        '& .MuiPaper-root': { 
          borderRadius: '12px', 
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px rgba(0,0,0,0.6)' 
            : '0 8px 16px rgba(0,0,0,0.1)', 
          minWidth: { xs: '200px', sm: '250px' },
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.95)' 
            : theme.palette.background.paper,
          backdropFilter: 'blur(10px)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : 'none'
        } 
      }}
    >
      <MenuItem 
        onClick={handlePDFDownload} 
        sx={{ 
          py: { xs: 1.5, sm: 1 },
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <PdfIcon sx={{ mr: 1, color: '#f44336' }} /> Unduh PDF
      </MenuItem>
      <MenuItem 
        onClick={exportToExcel} 
        sx={{ 
          py: { xs: 1.5, sm: 1 },
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        <ExcelIcon sx={{ mr: 1, color: '#4CAF50' }} /> Unduh Excel
      </MenuItem>
    </Menu>
  );
}

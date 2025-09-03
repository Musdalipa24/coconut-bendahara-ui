'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material'
import { Receipt as ReceiptIcon, Error as ErrorIcon, Download as DownloadIcon } from '@mui/icons-material'

export default function NotaPreviewDialog({
  notaDialog,
  handleCloseNotaDialog
}) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [fallbackAttempted, setFallbackAttempted] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
    console.log('Image loaded successfully:', notaDialog.imageUrl)
  }

  const handleDownload = () => {
    if (notaDialog.imageUrl) {
      const link = document.createElement('a')
      link.href = notaDialog.imageUrl
      link.download = 'nota-pengeluaran.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleImageError = () => {
    console.error('Failed to load image:', notaDialog.imageUrl)
    
    if (!fallbackAttempted) {
      // Try fallback URL construction
      const originalUrl = notaDialog.imageUrl
      const fileName = originalUrl.split('/').pop()
      const fallbackUrl = `http://localhost:8087/uploads/${fileName}`
      
      console.log('Attempting fallback URL:', fallbackUrl)
      setFallbackAttempted(true)
      
      // Force re-render with fallback URL
      setTimeout(() => {
        if (notaDialog.imageUrl !== fallbackUrl) {
          // This would need to be handled by parent component
          console.log('Fallback needed, but cannot update URL from child component')
        }
      }, 100)
    }
    
    setImageError(true)
    setImageLoaded(false)
  }

  const handleDialogClose = () => {
    setImageLoaded(false)
    setImageError(false)
    setFallbackAttempted(false)
    handleCloseNotaDialog()
  }
  return (
    <Dialog
      open={notaDialog.open}
      onClose={handleCloseNotaDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(45, 45, 45, 0.95) 50%, rgba(25, 25, 25, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          margin: '16px',
          width: 'calc(100% - 32px)',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'linear-gradient(45deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.05) 100%)'
              : 'linear-gradient(45deg, rgba(244, 67, 54, 0.05) 0%, rgba(229, 57, 53, 0.02) 100%)',
            pointerEvents: 'none',
            zIndex: -1
          }
        }
      }}
      aria-labelledby="nota-dialog-title"
    >
      <DialogTitle id="nota-dialog-title" sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.3) 0%, rgba(229, 57, 53, 0.4) 50%, rgba(239, 83, 80, 0.3) 100%)'
          : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 50%, rgba(239, 83, 80, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        color: isDarkMode ? '#e57373' : '#c62828',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textShadow: isDarkMode 
          ? '0 2px 10px rgba(229, 115, 115, 0.3)' 
          : '0 2px 10px rgba(198, 40, 40, 0.2)',
        '& .MuiTypography-root': {
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }
      }}>
        <ReceiptIcon sx={{ fontSize: 28 }} />
        Pratinjau Nota
      </DialogTitle>
      <DialogContent sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minHeight: '200px'
      }}>

        {!imageLoaded && !imageError && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            py: 4
          }}>
            <CircularProgress size={40} sx={{ 
              color: isDarkMode ? '#e57373' : '#c62828' 
            }} />
            <Typography variant="body2" sx={{
              color: isDarkMode ? '#b0bec5' : '#666'
            }}>
              Memuat gambar nota...
            </Typography>
          </Box>
        )}

        {imageError && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            py: 4
          }}>
            <ErrorIcon sx={{ 
              fontSize: 48, 
              color: isDarkMode ? '#e57373' : '#d32f2f' 
            }} />
            <Alert 
              severity="error" 
              sx={{ 
                textAlign: 'center',
                borderRadius: '12px',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.25) 100%)'
                  : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(244, 67, 54, 0.3)'
                  : '1px solid rgba(244, 67, 54, 0.2)',
                color: isDarkMode ? '#ffcdd2' : '#c62828',
                '& .MuiAlert-icon': {
                  color: isDarkMode ? '#e57373' : '#d32f2f'
                }
              }}
            >
              <Typography variant="body2">
                Gagal memuat gambar nota. Pastikan file ada dan dapat diakses.
              </Typography>
            </Alert>
          </Box>
        )}

        {notaDialog.imageUrl && (
          <Image
            src={notaDialog.imageUrl}
            alt="Nota Pengeluaran"
            width={800}
            height={600}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              display: imageLoaded ? 'block' : 'none'
            }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{
        px: 4,
        py: 3,
        borderTop: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        gap: 2,
        background: isDarkMode
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(10px)'
      }}>
        <Button
          onClick={handleDialogClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            background: isDarkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(0, 0, 0, 0.2)',
            color: isDarkMode ? '#ffffff' : '#666',
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.9)',
              border: isDarkMode 
                ? '1px solid rgba(229, 115, 115, 0.3)'
                : '1px solid rgba(198, 40, 40, 0.3)',
              color: isDarkMode ? '#e57373' : '#c62828',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(255, 255, 255, 0.1)'
                : '0 4px 16px rgba(198, 40, 40, 0.1)'
            }
          }}
        >
          Tutup
        </Button>
        {notaDialog.imageUrl && (
          <Button
            onClick={handleDownload}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: '12px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.8) 0%, rgba(229, 57, 53, 0.9) 50%, rgba(239, 83, 80, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(229, 57, 53, 1) 50%, rgba(239, 83, 80, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(244, 67, 54, 0.3)'
                : '1px solid rgba(244, 67, 54, 0.2)',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 16px rgba(244, 67, 54, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              px: 4,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(229, 57, 53, 1) 50%, rgba(239, 83, 80, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(244, 67, 54, 1) 0%, rgba(229, 57, 53, 1.1) 50%, rgba(239, 83, 80, 1) 100%)',
                boxShadow: isDarkMode
                  ? '0 6px 20px rgba(244, 67, 54, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  : '0 6px 20px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
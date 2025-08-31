'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import { useState, useEffect } from 'react'
import { useSoftUIController } from '@/context'

export default function NotaPreviewDialog({ notaDialog, handleCloseNotaDialog }) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  const [imageError, setImageError] = useState(false)
  const [attemptedUrls, setAttemptedUrls] = useState([])

  // Reset image error state when dialog opens
  useEffect(() => {
    if (notaDialog.open) {
      setImageError(false)
      setAttemptedUrls([])
    }
  }, [notaDialog.open, notaDialog.imageUrl])

  const handleDownload = () => {
    if (notaDialog.imageUrl) {
      const link = document.createElement('a')
      link.href = notaDialog.imageUrl
      link.download = 'nota-pemasukan.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleImageError = (e) => {
    setAttemptedUrls(prev => [...prev, e.target.src])
    
    // Try alternative URLs
    const currentSrc = e.target.src
    if (!attemptedUrls.includes(currentSrc)) {
      if (currentSrc.includes('localhost:8087/uploads/')) {
        // Try without the uploads path
        const fileName = currentSrc.split('/').pop()
        const alternativeUrl = `http://localhost:8087/${fileName}`
        e.target.src = alternativeUrl
        return
      }
    }
    
    setImageError(true)
  }

  const handleImageLoad = (e) => {
    setImageError(false)
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
              ? 'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.05) 100%)'
              : 'linear-gradient(45deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.02) 100%)',
            pointerEvents: 'none',
            zIndex: -1
          }
        }
      }}
    >
      <DialogTitle sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(139, 195, 74, 0.4) 50%, rgba(102, 187, 106, 0.3) 100%)'
          : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 50%, rgba(102, 187, 106, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        color: isDarkMode ? '#81c784' : '#2e7d32',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textShadow: isDarkMode 
          ? '0 2px 10px rgba(129, 199, 132, 0.3)' 
          : '0 2px 10px rgba(46, 125, 50, 0.2)',
        '& .MuiTypography-root': {
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography component="span" sx={{ 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: isDarkMode ? '#81c784' : '#2e7d32'
          }}>
            Preview Nota Pemasukan
          </Typography>
        </Box>
        <IconButton
          onClick={handleCloseNotaDialog}
          sx={{ 
            color: isDarkMode ? '#81c784' : '#2e7d32',
            '&:hover': {
              background: isDarkMode 
                ? 'rgba(129, 199, 132, 0.1)'
                : 'rgba(46, 125, 50, 0.1)'
            }
          }}
          aria-label="Tutup dialog"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, textAlign: 'center', minHeight: '300px' }}>
        {notaDialog.imageUrl && !imageError ? (
          <Box sx={{ 
            position: 'relative', 
            display: 'inline-block',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={notaDialog.imageUrl}
              alt="Nota Pemasukan"
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                height: 'auto',
                objectFit: 'contain'
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </Box>
        ) : (
          <Box sx={{ 
            padding: '60px 20px',
            background: isDarkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              color: isDarkMode ? '#ffffff' : '#666'
            }}>
              {imageError ? 'Gambar tidak dapat dimuat' : 'Nota tidak tersedia'}
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 1,
              color: isDarkMode ? '#b0bec5' : '#666'
            }}>
              {imageError 
                ? 'Pastikan file gambar masih tersedia di server' 
                : 'Gambar nota tidak ditemukan atau belum diupload'
              }
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        borderTop: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        gap: 1,
        background: isDarkMode
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(10px)'
      }}>
        <Button
          onClick={handleCloseNotaDialog}
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
            transition: 'all 0.3s ease',
            '&:hover': {
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.9)',
              border: isDarkMode 
                ? '1px solid rgba(129, 199, 132, 0.3)'
                : '1px solid rgba(46, 125, 50, 0.3)',
              color: isDarkMode ? '#81c784' : '#2e7d32',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(255, 255, 255, 0.1)'
                : '0 4px 16px rgba(46, 125, 50, 0.1)'
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
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(139, 195, 74, 0.9) 50%, rgba(102, 187, 106, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(139, 195, 74, 1) 50%, rgba(102, 187, 106, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(76, 175, 80, 0.3)'
                : '1px solid rgba(76, 175, 80, 0.2)',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(76, 175, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 16px rgba(76, 175, 80, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(139, 195, 74, 1) 50%, rgba(102, 187, 106, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(76, 175, 80, 1) 0%, rgba(139, 195, 74, 1.1) 50%, rgba(102, 187, 106, 1) 100%)',
                boxShadow: isDarkMode
                  ? '0 6px 20px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  : '0 6px 20px rgba(76, 175, 80, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
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

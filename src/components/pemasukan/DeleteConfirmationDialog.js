'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material'
import { Warning as WarningIcon, Delete as DeleteIcon } from '@mui/icons-material'

export default function DeleteConfirmationDialog({
  deleteDialog,
  setDeleteDialog,
  confirmDelete,
  loading
}) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
  return (
    <Dialog
      open={deleteDialog.open}
      onClose={() => setDeleteDialog({ open: false, id: null })}
      maxWidth="xs"
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
    >
      <DialogTitle sx={{
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
        color: isDarkMode ? '#e57373' : '#d32f2f',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textShadow: isDarkMode 
          ? '0 2px 10px rgba(229, 115, 115, 0.3)' 
          : '0 2px 10px rgba(211, 47, 47, 0.2)',
        '& .MuiTypography-root': {
          fontSize: '1.3rem',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }
      }}>
        <WarningIcon sx={{ fontSize: 28 }} />
        Konfirmasi Penghapusan
      </DialogTitle>
      <DialogContent sx={{
        py: 4,
        px: { xs: 3, sm: 4 }
      }}>
        <Typography variant="body1" sx={{ 
          mb: 2,
          color: isDarkMode ? '#ffffff' : '#212121',
          fontWeight: 500
        }}>
          Apakah Anda yakin ingin menghapus pemasukan ini?
        </Typography>
        <Typography variant="body2" sx={{
          color: isDarkMode ? '#b0bec5' : '#666'
        }}>
          Tindakan ini tidak dapat dibatalkan.
        </Typography>
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
          onClick={() => setDeleteDialog({ open: false, id: null })}
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
            px: 3,
            py: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.9)',
              border: isDarkMode 
                ? '1px solid rgba(229, 115, 115, 0.3)'
                : '1px solid rgba(211, 47, 47, 0.3)',
              color: isDarkMode ? '#e57373' : '#d32f2f',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(255, 255, 255, 0.1)'
                : '0 4px 16px rgba(211, 47, 47, 0.1)'
            }
          }}
        >
          Batal
        </Button>
        <Button
          onClick={confirmDelete}
          variant="contained"
          disabled={loading}
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
            px: 3,
            py: 1,
            gap: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(229, 57, 53, 1) 50%, rgba(239, 83, 80, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 1) 0%, rgba(229, 57, 53, 1.1) 50%, rgba(239, 83, 80, 1) 100%)',
              boxShadow: isDarkMode
                ? '0 6px 20px rgba(244, 67, 54, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : '0 6px 20px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
            },
            '&:disabled': {
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              transform: 'none',
              boxShadow: 'none'
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Menghapus...
            </>
          ) : (
            <>
              <DeleteIcon />
              Hapus
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
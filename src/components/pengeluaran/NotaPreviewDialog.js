'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material'
import { Receipt as ReceiptIcon } from '@mui/icons-material'

export default function NotaPreviewDialog({
  notaDialog,
  handleCloseNotaDialog,
  showSnackbar
}) {
  return (
    <Dialog
      open={notaDialog.open}
      onClose={handleCloseNotaDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          margin: '16px',
          width: 'calc(100% - 32px)',
          maxHeight: '90vh'
        }
      }}
      aria-labelledby="nota-dialog-title"
    >
      <DialogTitle id="nota-dialog-title" sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ReceiptIcon sx={{ fontSize: 28 }} />
        Pratinjau Nota
      </DialogTitle>
      <DialogContent sx={{
        py: 4,
        px: { xs: 3, sm: 4 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
          '&:hover': {
            background: '#666',
          },
        },
      }}>
        {notaDialog.imageUrl ? (
          <img
            src={notaDialog.imageUrl}
            alt="Nota Pengeluaran"
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: '8px',
              objectFit: 'contain'
            }}
            onError={() => {
              showSnackbar('Gagal memuat gambar nota', 'error')
              handleCloseNotaDialog()
            }}
          />
        ) : (
          <Typography variant="body1" color="textSecondary">
            Gambar nota tidak tersedia
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{
        px: 4,
        py: 3,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        gap: 2,
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }}>
        <Button
          onClick={handleCloseNotaDialog}
          variant="contained"
          sx={{
            borderRadius: '10px',
            bgcolor: '#1a237e',
            '&:hover': {
              bgcolor: '#0d47a1'
            },
            px: 3,
            py: 1
          }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  )
}
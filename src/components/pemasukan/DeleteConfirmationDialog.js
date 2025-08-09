'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress
} from '@mui/material'
import { Warning as WarningIcon, Delete as DeleteIcon } from '@mui/icons-material'

export default function DeleteConfirmationDialog({
  deleteDialog,
  setDeleteDialog,
  confirmDelete,
  loading
}) {
  return (
    <Dialog
      open={deleteDialog.open}
      onClose={() => setDeleteDialog({ open: false, id: null })}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          margin: '16px',
          width: 'calc(100% - 32px)'
        }
      }}
    >
      <DialogTitle sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WarningIcon sx={{ fontSize: 28 }} />
        Konfirmasi Penghapusan
      </DialogTitle>
      <DialogContent sx={{
        py: 4,
        px: { xs: 3, sm: 4 }
      }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Apakah Anda yakin ingin menghapus pemasukan ini?
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Tindakan ini tidak dapat dibatalkan.
        </Typography>
      </DialogContent>
      <DialogActions sx={{
        px: 4,
        py: 3,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        gap: 2,
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }}>
        <Button
          onClick={() => setDeleteDialog({ open: false, id: null })}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            borderColor: '#666',
            color: '#666',
            '&:hover': {
              borderColor: '#d32f2f',
              color: '#d32f2f',
              bgcolor: 'rgba(211, 47, 47, 0.04)'
            },
            px: 3,
            py: 1
          }}
        >
          Batal
        </Button>
        <Button
          onClick={confirmDelete}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: '10px',
            bgcolor: '#d32f2f',
            '&:hover': {
              bgcolor: '#b71c1c'
            },
            px: 3,
            py: 1,
            gap: 1
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
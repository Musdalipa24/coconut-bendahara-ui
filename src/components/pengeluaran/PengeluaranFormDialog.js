'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Box
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Receipt as ReceiptIcon } from '@mui/icons-material'

export default function PengeluaranFormDialog({
  showModal,
  setShowModal,
  editingId,
  formData,
  handleInputChange,
  handleSave,
  loading,
  previewUrl,
  setPreviewUrl
}) {
  const handleClose = () => {
    setShowModal(false)
    setPreviewUrl('')
  }

  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          maxHeight: '90vh',
          margin: '16px',
          width: 'calc(100% - 32px)'
        }
      }}
      aria-labelledby="pengeluaran-dialog-title"
    >
      <DialogTitle id="pengeluaran-dialog-title" sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '& .MuiTypography-root': {
          fontSize: '1.5rem',
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }}>
        {editingId ? (
          <>
            <EditIcon sx={{ fontSize: 28 }} />
            Edit Pengeluaran
          </>
        ) : (
          <>
            <AddIcon sx={{ fontSize: 28 }} />
            Tambah Pengeluaran
          </>
        )}
      </DialogTitle>

      <DialogContent
        sx={{
          py: 4,
          px: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
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
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#c62828' }}>
            Informasi Pengeluaran
          </Typography>
          <Divider />
        </Box>

        <TextField
          label="Tanggal dan Waktu"
          name="tanggal"
          type="datetime-local"
          value={formData.tanggal}
          onChange={handleInputChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
            sx: { fontWeight: 500 }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#c62828',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#c62828',
                borderWidth: '2px',
              }
            }
          }}
        />

        <TextField
          label="Jumlah"
          name="nominal"
          type="text"
          value={formData.nominal ? parseInt(formData.nominal).toLocaleString('id-ID') : ''}
          onChange={handleInputChange}
          fullWidth
          required
          inputProps={{
            maxLength: 11,
            pattern: '[0-9]*'
          }}
          InputProps={{
            startAdornment: (
              <Typography sx={{
                mr: 1,
                color: '#666',
                fontWeight: 500
              }}>
                Rp
              </Typography>
            ),
            sx: {
              borderRadius: '12px',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#c62828',
                }
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#c62828',
                  borderWidth: '2px',
                }
              }
            }
          }}
          placeholder="Contoh: 1.000.000"
        />

        <TextField
          label="Keterangan"
          name="keterangan"
          value={formData.keterangan}
          onChange={handleInputChange}
          fullWidth
          required
          multiline
          rows={4}
          placeholder="Masukkan detail keterangan pengeluaran"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#c62828',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#c62828',
                borderWidth: '2px',
              }
            }
          }}
        />

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: theme => theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <ReceiptIcon sx={{ fontSize: 20 }} />
            Upload Nota {editingId ? '(Opsional)' : '*'}
          </Typography>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: theme => theme.palette.divider,
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#c62828',
                bgcolor: 'rgba(26, 35, 126, 0.04)'
              }
            }}
          >
            <input
              accept="image/*"
              type="file"
              name="nota"
              onChange={handleInputChange}
              style={{ display: 'none' }}
              id="nota-upload"
              aria-label="Upload nota pengeluaran"
            />
            <label htmlFor="nota-upload" style={{ cursor: 'pointer' }}>
              {previewUrl ? (
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={previewUrl}
                    alt="Preview Nota"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 2,
                      color: 'text.secondary'
                    }}
                  >
                    Klik untuk mengganti gambar
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ py: 3 }}>
                  <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Klik atau seret file nota ke sini
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Format yang didukung: JPG, PNG, JPEG (Maks. 5MB)
                  </Typography>
                </Box>
              )}
            </label>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        px: 4,
        py: 3,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        gap: 2,
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            borderColor: '#666',
            color: '#666',
            '&:hover': {
              borderColor: '#c62828',
              color: '#c62828',
              bgcolor: 'rgba(26, 35, 126, 0.04)'
            },
            px: 3,
            py: 1
          }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: '10px',
            bgcolor: '#c62828',
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
              Menyimpan...
            </>
          ) : (
            <>
              <ReceiptIcon />
              Simpan
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
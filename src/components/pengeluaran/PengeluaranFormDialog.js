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
  Box,
  useTheme
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { Add as AddIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'

export default function PengeluaranFormDialog({
  showModal,
  setShowModal,
  editingId,
  formData,
  setFormData,
  handleInputChange,
  handleNominalBlur,
  handleSave,
  loading
}) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [previewUrl, setPreviewUrl] = useState('')

  // Set default date to current date when opening for new entry
  useEffect(() => {
    if (showModal && !editingId && !formData.tanggal) {
      const now = new Date()
      // Format to date input format (YYYY-MM-DD)
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}`
      setFormData(prev => ({ ...prev, tanggal: formatted }))
    }
  }, [showModal, editingId, formData.tanggal, setFormData])

  // Update preview URL when a new file is selected or existing nota string is passed
  useEffect(() => {
    if (formData.nota instanceof File) {
      const url = URL.createObjectURL(formData.nota)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (formData.nota && typeof formData.nota === 'string') {
      if (formData.nota.startsWith('http://') || formData.nota.startsWith('https://')) {
        setPreviewUrl(formData.nota)
      } else {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
        const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || `${apiBase}/api/uploads/`
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
        let cleanPath = formData.nota.replace(/^\/+/, '')
        cleanPath = cleanPath.replace(/^api\/uploads\//, '')
        cleanPath = cleanPath.replace(/^uploads\//, '')
        setPreviewUrl(`${cleanBaseUrl}${cleanPath}`)
      }
    } else {
      setPreviewUrl('')
    }
  }, [formData.nota])

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Max 5MB
        alert('Ukuran file terlalu besar (maksimal 5MB)')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Format file tidak didukung (hanya JPG, PNG, JPEG)')
        return
      }
      setFormData(prev => ({ ...prev, nota: file }))
    } else {
      setFormData(prev => ({ ...prev, nota: null }))
    }
  }

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      maxWidth="sm"
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
          maxHeight: '90vh',
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
        color: isDarkMode ? '#ef9a9a' : '#c62828',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textShadow: isDarkMode 
          ? '0 2px 10px rgba(239, 154, 154, 0.3)' 
          : '0 2px 10px rgba(198, 40, 40, 0.2)',
        '& .MuiTypography-root': {
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.5px'
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
      <DialogContent sx={{
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
      }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 1, 
            fontWeight: 500, 
            color: isDarkMode ? '#ef9a9a' : '#c62828'
          }}>
            Informasi Pengeluaran
          </Typography>
          <Divider sx={{
            borderColor: isDarkMode ? 'rgba(239, 154, 154, 0.2)' : 'rgba(198, 40, 40, 0.2)'
          }} />
        </Box>
        <TextField
          label="Tanggal"
          name="tanggal"
          type="date"
          value={formData.tanggal || ''}
          onChange={handleInputChange}
          fullWidth
          required
          InputLabelProps={{ 
            shrink: true,
            style: { 
              fontWeight: 500, 
              color: isDarkMode ? '#ef9a9a' : '#c62828'
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(239, 154, 154, 0.2)'
                : '1px solid rgba(198, 40, 40, 0.2)',
              '& fieldset': {
                border: 'none'
              },
              '&:hover': {
                background: isDarkMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.9)',
                border: isDarkMode 
                  ? '1px solid rgba(239, 154, 154, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.3)',
              },
              '&.Mui-focused': {
                background: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 1)',
                border: isDarkMode 
                  ? '2px solid rgba(239, 154, 154, 0.5)'
                  : '2px solid rgba(198, 40, 40, 0.5)',
                boxShadow: isDarkMode
                  ? '0 0 0 2px rgba(239, 154, 154, 0.2)'
                  : '0 0 0 2px rgba(198, 40, 40, 0.1)'
              }
            },
            '& .MuiOutlinedInput-input': {
              color: isDarkMode ? '#ffffff' : '#212121'
            },
            '& input[type="date"]': {
              fontSize: '1rem',
              padding: '16.5px 14px',
              colorScheme: isDarkMode ? 'dark' : 'light'
            }
          }}
          inputProps={{ 
            'aria-label': 'Tanggal pengeluaran'
          }}
          helperText="Pilih tanggal pengeluaran"
        />
        <TextField
          label="Jumlah"
          name="nominal"
          type="text"
          value={formData.nominal ? parseInt(formData.nominal).toLocaleString('id-ID') : ''}
          onChange={handleInputChange}
          onBlur={handleNominalBlur}
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <Typography sx={{ 
                mr: 1, 
                color: isDarkMode ? '#b0bec5' : '#666', 
                fontWeight: 500 
              }}>
                Rp
              </Typography>
            )
          }}
          InputLabelProps={{
            style: { 
              color: isDarkMode ? '#ef9a9a' : '#c62828',
              fontWeight: 500
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(239, 154, 154, 0.2)'
                : '1px solid rgba(198, 40, 40, 0.2)',
              '& fieldset': {
                border: 'none'
              },
              '&:hover': {
                background: isDarkMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.9)',
                border: isDarkMode 
                  ? '1px solid rgba(239, 154, 154, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.3)',
              },
              '&.Mui-focused': {
                background: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 1)',
                border: isDarkMode 
                  ? '2px solid rgba(239, 154, 154, 0.5)'
                  : '2px solid rgba(198, 40, 40, 0.5)',
                boxShadow: isDarkMode
                  ? '0 0 0 2px rgba(239, 154, 154, 0.2)'
                  : '0 0 0 2px rgba(198, 40, 40, 0.1)'
              }
            },
            '& .MuiOutlinedInput-input': {
              color: isDarkMode ? '#ffffff' : '#212121'
            }
          }}
          placeholder="Contoh: 1.000.000"
          helperText="Nominal minimal Rp. 1.000"
          inputProps={{ 'aria-label': 'Jumlah pengeluaran' }}
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
          InputLabelProps={{
            style: { 
              color: isDarkMode ? '#ef9a9a' : '#c62828',
              fontWeight: 500
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(239, 154, 154, 0.2)'
                : '1px solid rgba(198, 40, 40, 0.2)',
              '& fieldset': {
                border: 'none'
              },
              '&:hover': {
                background: isDarkMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.9)',
                border: isDarkMode 
                  ? '1px solid rgba(239, 154, 154, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.3)',
              },
              '&.Mui-focused': {
                background: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 1)',
                border: isDarkMode 
                  ? '2px solid rgba(239, 154, 154, 0.5)'
                  : '2px solid rgba(198, 40, 40, 0.5)',
                boxShadow: isDarkMode
                  ? '0 0 0 2px rgba(239, 154, 154, 0.2)'
                  : '0 0 0 2px rgba(198, 40, 40, 0.1)'
              }
            },
            '& .MuiOutlinedInput-input': {
              color: isDarkMode ? '#ffffff' : '#212121'
            }
          }}
          inputProps={{ 'aria-label': 'Keterangan pengeluaran' }}
        />
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: isDarkMode ? '#ef9a9a' : '#c62828',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <ReceiptIcon sx={{ fontSize: 20 }} />
            Upload Nota (Opsional)
          </Typography>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: isDarkMode 
                ? 'rgba(239, 154, 154, 0.3)' 
                : 'rgba(198, 40, 40, 0.3)',
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.02)'
                : 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: isDarkMode 
                  ? 'rgba(239, 154, 154, 0.5)' 
                  : 'rgba(198, 40, 40, 0.5)',
                background: isDarkMode
                  ? 'rgba(239, 154, 154, 0.05)'
                  : 'rgba(198, 40, 40, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 4px 16px rgba(239, 154, 154, 0.1)'
                  : '0 4px 16px rgba(198, 40, 40, 0.1)'
              }
            }}
          >
            <input
              accept="image/*"
              type="file"
              name="nota"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="nota-upload-pengeluaran"
              aria-label="Upload nota pengeluaran"
            />
            <label htmlFor="nota-upload-pengeluaran" style={{ cursor: 'pointer' }}>
              {previewUrl ? (
                <Box sx={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview Nota"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      console.error('Error loading image:', e)
                      e.target.style.display = 'none'
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
                  <ReceiptIcon sx={{ 
                    fontSize: 48, 
                    color: isDarkMode ? '#90a4ae' : '#616161', 
                    mb: 2 
                  }} />
                  <Typography variant="body1" sx={{ 
                    mb: 1,
                    color: isDarkMode ? '#ffffff' : '#212121'
                  }}>
                    Klik atau seret file nota ke sini
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: isDarkMode ? '#b0bec5' : '#666'
                  }}>
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
          onClick={() => setShowModal(false)}
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
                ? '1px solid rgba(239, 154, 154, 0.3)'
                : '1px solid rgba(198, 40, 40, 0.3)',
              color: isDarkMode ? '#ef9a9a' : '#c62828',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 4px 16px rgba(255, 255, 255, 0.1)'
                : '0 4px 16px rgba(198, 40, 40, 0.1)'
            }
          }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: '12px',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.8) 0%, rgba(229, 57, 53, 0.9) 50%, rgba(239, 83, 80, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(211, 47, 47, 0.9) 0%, rgba(198, 40, 40, 1) 50%, rgba(229, 57, 53, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode 
              ? '1px solid rgba(244, 67, 54, 0.3)'
              : '1px solid rgba(211, 47, 47, 0.2)',
            boxShadow: isDarkMode
              ? '0 4px 16px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 16px rgba(211, 47, 47, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
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
                : 'linear-gradient(135deg, rgba(211, 47, 47, 1) 0%, rgba(198, 40, 40, 1.1) 50%, rgba(229, 57, 53, 1) 100%)',
              boxShadow: isDarkMode
                ? '0 6px 20px rgba(244, 67, 54, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : '0 6px 20px rgba(211, 47, 47, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
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
              Menyimpan...
            </>
          ) : (
            <>
              <SaveIcon />
              Simpan
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
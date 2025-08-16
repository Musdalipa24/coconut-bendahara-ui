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
  MenuItem,
  Box
} from '@mui/material'
import Image from 'next/image'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { Add as AddIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'

export default function PemasukanFormDialog({
  showModal,
  setShowModal,
  editingId,
  formData,
  setFormData,
  handleInputChange,
  handleSave,
  loading
}) {
  const [previewUrl, setPreviewUrl] = useState('');

  // Update preview URL when a new file is selected
  useEffect(() => {
    if (formData.nota instanceof File) {
      const url = URL.createObjectURL(formData.nota);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(formData.nota || '');
    }
  }, [formData.nota]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Max 5MB
        alert('Ukuran file terlalu besar (maksimal 5MB)');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Format file tidak didukung (hanya JPG, PNG, JPEG)');
        return;
      }
      setFormData(prev => ({ ...prev, nota: file }));
    } else {
      setFormData(prev => ({ ...prev, nota: null }));
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
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
    >
      <DialogTitle sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
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
            Edit Pemasukan
          </>
        ) : (
          <>
            <AddIcon sx={{ fontSize: 28 }} />
            Tambah Pemasukan
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
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#2e7d32' }}>
            Informasi Pemasukan
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
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#2e7d32',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2e7d32',
                borderWidth: '2px',
              }
            }
          }}
          inputProps={{ 'aria-label': 'Tanggal dan waktu pemasukan' }}
        />
        <TextField
          label="Jumlah"
          name="nominal"
          type="text"
          value={formData.nominal ? parseInt(formData.nominal).toLocaleString('id-ID') : ''}
          onChange={handleInputChange}
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <Typography sx={{ mr: 1, color: '#666', fontWeight: 500 }}>
                Rp
              </Typography>
            )
          }}
          placeholder="Contoh: 1.000.000"
          inputProps={{ 'aria-label': 'Jumlah pemasukan' }}
        />
        <TextField
          label="Kategori"
          name="kategori"
          select
          value={formData.kategori}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#2e7d32',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2e7d32',
                borderWidth: '2px',
              }
            }
          }}
          inputProps={{ 'aria-label': 'Kategori pemasukan' }}
        >
          <MenuItem value="">Pilih Kategori</MenuItem>
          <MenuItem value="Pajak">Pajak</MenuItem>
          <MenuItem value="Retribusi">Retribusi</MenuItem>
          <MenuItem value="Dana Desa">Dana Desa</MenuItem>
          <MenuItem value="Bantuan">Bantuan</MenuItem>
          <MenuItem value="Lainnya">Lainnya</MenuItem>
        </TextField>
        {formData.kategori === 'Lainnya' && (
          <TextField
            label="Kategori Kustom"
            name="kategoriKustom"
            value={formData.kategoriKustom || ''}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="Masukkan kategori kustom"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32',
                  borderWidth: '2px',
                }
              }
            }}
            inputProps={{ 'aria-label': 'Kategori kustom pemasukan' }}
          />
        )}
        <TextField
          label="Keterangan"
          name="keterangan"
          value={formData.keterangan}
          onChange={handleInputChange}
          fullWidth
          required
          multiline
          rows={4}
          placeholder="Masukkan detail keterangan pemasukan"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '&:hover fieldset': {
                borderColor: '#2e7d32',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2e7d32',
                borderWidth: '2px',
              }
            }
          }}
          inputProps={{ 'aria-label': 'Keterangan pemasukan' }}
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
            Upload Nota (Opsional)
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
                borderColor: '#2e7d32',
                bgcolor: 'rgba(46, 125, 50, 0.04)'
              }
            }}
          >
            <input
              accept="image/*"
              type="file"
              name="nota"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="nota-upload"
              aria-label="Upload nota pemasukan"
            />
            <label htmlFor="nota-upload" style={{ cursor: 'pointer' }}>
              {previewUrl ? (
                <Box sx={{ position: 'relative' }}>
                  <Image
                    src={previewUrl}
                    alt="Preview Nota"
                    width={200} // Tentukan lebar
                    height={200} // Tentukan tinggi
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'contain'
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
                  <Typography variant="caption" color="text.secondary">
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
          onClick={() => setShowModal(false)}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            borderColor: '#666',
            color: '#666',
            '&:hover': {
              borderColor: '#2e7d32',
              color: '#2e7d32',
              bgcolor: 'rgba(46, 125, 50, 0.04)'
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
            bgcolor: '#2e7d32',
            '&:hover': {
              bgcolor: '#1b5e20'
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
              <SaveIcon />
              Simpan
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
'use client'

import Image from 'next/image'
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
import { Add as AddIcon, Edit as EditIcon, Receipt as ReceiptIcon } from '@mui/icons-material'

export default function PengeluaranFormDialog({
  showModal,
  setShowModal,
  editingId,
  formData,
  handleInputChange,
  handleNominalBlur,
  handleSave,
  loading,
  previewUrl,
  setPreviewUrl
}) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  
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
      aria-labelledby="pengeluaran-dialog-title"
    >
      <DialogTitle id="pengeluaran-dialog-title" sx={{
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
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          borderTop: 'none',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDarkMode ? 'rgba(229, 115, 115, 0.4)' : 'rgba(198, 40, 40, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: isDarkMode ? 'rgba(229, 115, 115, 0.6)' : 'rgba(198, 40, 40, 0.5)',
            },
          },
        }}
      >
        <Box sx={{ 
          mb: 3,
          p: 3,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(229, 57, 53, 0.12) 100%)'
            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.03) 0%, rgba(229, 57, 53, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: isDarkMode 
            ? '1px solid rgba(229, 115, 115, 0.2)'
            : '1px solid rgba(198, 40, 40, 0.1)',
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(229, 115, 115, 0.1)'
            : '0 8px 32px rgba(198, 40, 40, 0.05)'
        }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 2, 
            fontWeight: 600, 
            color: isDarkMode ? '#e57373' : '#c62828',
            textShadow: isDarkMode 
              ? '0 2px 8px rgba(229, 115, 115, 0.3)' 
              : '0 2px 8px rgba(198, 40, 40, 0.2)',
            letterSpacing: '0.5px'
          }}>
            Informasi Pengeluaran
          </Typography>
          <Divider sx={{
            borderColor: isDarkMode ? 'rgba(229, 115, 115, 0.3)' : 'rgba(198, 40, 40, 0.2)',
            boxShadow: isDarkMode 
              ? '0 1px 3px rgba(229, 115, 115, 0.2)' 
              : '0 1px 3px rgba(198, 40, 40, 0.1)'
          }} />
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
            style: { 
              fontWeight: 500, 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.9rem'
            }
          }}
          sx={{
            mb: 3,
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: isDarkMode ? '#e57373' : '#c62828',
                textShadow: isDarkMode 
                  ? '0 0 10px rgba(229, 115, 115, 0.3)' 
                  : '0 0 8px rgba(198, 40, 40, 0.2)'
              }
            },
            '& .MuiOutlinedInput-root': {
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: isDarkMode
                  ? '0 8px 25px rgba(229, 115, 115, 0.15)'
                  : '0 8px 25px rgba(198, 40, 40, 0.1)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                border: isDarkMode 
                  ? '1px solid rgba(229, 115, 115, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.2)'
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 12px 35px rgba(229, 115, 115, 0.25)'
                  : '0 12px 35px rgba(198, 40, 40, 0.15)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)',
                border: isDarkMode 
                  ? '2px solid rgba(229, 115, 115, 0.5)'
                  : '2px solid rgba(198, 40, 40, 0.3)'
              },
              '& input': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                fontSize: '0.95rem',
                fontWeight: 500
              },
              '& input[type="datetime-local"]': {
                fontSize: '1rem',
                padding: '16.5px 14px',
                colorScheme: isDarkMode ? 'dark' : 'light'
              }
            }
          }}
          inputProps={{ 
            'aria-label': 'Tanggal dan waktu pengeluaran',
            step: '60' // Set step to 1 minute intervals
          }}
          helperText="Pilih tanggal dan waktu pengeluaran"
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
          inputProps={{
            maxLength: 11,
            pattern: '[0-9]*'
          }}
          InputProps={{
            startAdornment: (
              <Typography sx={{
                mr: 1,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontWeight: 500
              }}>
                Rp
              </Typography>
            )
          }}
          sx={{
            mb: 3,
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.9rem',
              fontWeight: 500,
              '&.Mui-focused': {
                color: isDarkMode ? '#e57373' : '#c62828',
                textShadow: isDarkMode 
                  ? '0 0 10px rgba(229, 115, 115, 0.3)' 
                  : '0 0 8px rgba(198, 40, 40, 0.2)'
              }
            },
            '& .MuiOutlinedInput-root': {
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: isDarkMode
                  ? '0 8px 25px rgba(229, 115, 115, 0.15)'
                  : '0 8px 25px rgba(198, 40, 40, 0.1)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                border: isDarkMode 
                  ? '1px solid rgba(229, 115, 115, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.2)'
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 12px 35px rgba(229, 115, 115, 0.25)'
                  : '0 12px 35px rgba(198, 40, 40, 0.15)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)',
                border: isDarkMode 
                  ? '2px solid rgba(229, 115, 115, 0.5)'
                  : '2px solid rgba(198, 40, 40, 0.3)'
              },
              '& input': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                fontSize: '0.95rem',
                fontWeight: 500
              }
            }
          }}
          placeholder="Contoh: 1.000.000"
          helperText="Nominal minimal Rp. 1.000"
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
            mb: 3,
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.9rem',
              fontWeight: 500,
              '&.Mui-focused': {
                color: isDarkMode ? '#e57373' : '#c62828',
                textShadow: isDarkMode 
                  ? '0 0 10px rgba(229, 115, 115, 0.3)' 
                  : '0 0 8px rgba(198, 40, 40, 0.2)'
              }
            },
            '& .MuiOutlinedInput-root': {
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: isDarkMode
                  ? '0 8px 25px rgba(229, 115, 115, 0.15)'
                  : '0 8px 25px rgba(198, 40, 40, 0.1)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                border: isDarkMode 
                  ? '1px solid rgba(229, 115, 115, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.2)'
              },
              '&.Mui-focused': {
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 12px 35px rgba(229, 115, 115, 0.25)'
                  : '0 12px 35px rgba(198, 40, 40, 0.15)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)',
                border: isDarkMode 
                  ? '2px solid rgba(229, 115, 115, 0.5)'
                  : '2px solid rgba(198, 40, 40, 0.3)'
              },
              '& textarea': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                  opacity: 1
                }
              }
            }
          }}
        />

        <Box sx={{ 
          mb: 3,
          p: 3,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(229, 57, 53, 0.12) 100%)'
            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.03) 0%, rgba(229, 57, 53, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: isDarkMode 
            ? '1px solid rgba(229, 115, 115, 0.2)'
            : '1px solid rgba(198, 40, 40, 0.1)',
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(229, 115, 115, 0.1)'
            : '0 8px 32px rgba(198, 40, 40, 0.05)'
        }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: isDarkMode ? '#e57373' : '#c62828',
              textShadow: isDarkMode 
                ? '0 2px 8px rgba(229, 115, 115, 0.3)' 
                : '0 2px 8px rgba(198, 40, 40, 0.2)',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ReceiptIcon sx={{ fontSize: 24 }} />
            Upload Nota {editingId ? '(Opsional)' : '*'}
          </Typography>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: isDarkMode ? 'rgba(229, 115, 115, 0.4)' : 'rgba(198, 40, 40, 0.3)',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(229, 115, 115, 0.6)' : 'rgba(198, 40, 40, 0.5)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
                transform: 'translateY(-2px)',
                boxShadow: isDarkMode
                  ? '0 8px 25px rgba(229, 115, 115, 0.2)'
                  : '0 8px 25px rgba(198, 40, 40, 0.15)'
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
                  <Image
                    src={previewUrl}
                    alt="Preview Nota"
                    width={300}
                    height={200}
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
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                      fontWeight: 500
                    }}
                  >
                    Klik untuk mengganti gambar
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ py: 3 }}>
                  <ReceiptIcon sx={{ 
                    fontSize: 48, 
                    color: isDarkMode ? 'rgba(229, 115, 115, 0.7)' : 'rgba(198, 40, 40, 0.7)', 
                    mb: 2 
                  }} />
                  <Typography variant="body1" sx={{ 
                    mb: 1,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    fontWeight: 500
                  }}>
                    Klik atau seret file nota ke sini
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: 400
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
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        gap: 2
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem',
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.2)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 1) 100%)',
              border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.3)'
                : '1px solid rgba(0, 0, 0, 0.2)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              transform: 'translateY(-1px)',
              boxShadow: isDarkMode
                ? '0 4px 20px rgba(255, 255, 255, 0.1)'
                : '0 4px 20px rgba(0, 0, 0, 0.1)'
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
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.95rem',
            background: isDarkMode
              ? 'linear-gradient(135deg, #e57373 0%, #f44336 50%, #ef5350 100%)'
              : 'linear-gradient(135deg, #c62828 0%, #b71c1c 50%, #d32f2f 100%)',
            boxShadow: isDarkMode
              ? '0 8px 25px rgba(229, 115, 115, 0.4)'
              : '0 8px 25px rgba(198, 40, 40, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            gap: 1,
            '&:hover': {
              background: isDarkMode
                ? 'linear-gradient(135deg, #ef5350 0%, #f44336 50%, #e57373 100%)'
                : 'linear-gradient(135deg, #b71c1c 0%, #c62828 50%, #d32f2f 100%)',
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode
                ? '0 12px 35px rgba(229, 115, 115, 0.5)'
                : '0 12px 35px rgba(198, 40, 40, 0.4)'
            },
            '&:disabled': {
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.12)' 
                : 'rgba(0, 0, 0, 0.12)',
              color: isDarkMode 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(0, 0, 0, 0.26)',
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
              <ReceiptIcon />
              Simpan
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
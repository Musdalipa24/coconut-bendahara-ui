'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  FormControl, InputLabel, Select, MenuItem, TextField,
  DialogActions, CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DesktopAddButton } from './styles'
import { iuranService } from '@/services/iuranService'

export default function IuranHeader({
  totalIuran,
  isLoadingTotal,
  formatCurrency,
  showSnackbar
}) {
  const [openIuranDialog, setOpenIuranDialog] = useState(false);
  const [status, setStatus] = useState('bph');
  const [nra, setNra] = useState('');
  const [nama, setNama] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleOpenIuranDialog = () => {
    setOpenIuranDialog(true);
    setStatus('bph');
    setNra('');
    setNama('');
  };

  const handleCloseIuranDialog = () => {
    setOpenIuranDialog(false);
  };

  const handleSubmitIuran = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const newMember = { status, nra, nama };
      const response = await iuranService.addMember(newMember);

      if (response?.code >= 200 && response?.code < 300) {
        if (typeof showSnackbar === 'function') {
          showSnackbar('Member berhasil ditambahkan', 'success');
        }

        handleCloseIuranDialog();
      } else {
        console.error('Gagal menambah member:', response);
        if (typeof showSnackbar === 'function') {
          showSnackbar(response.message || 'Gagal menambah member', 'error');
        }
      }
    } catch (error) {
      console.error('Error saat tambah member:', error);
      if (typeof showSnackbar === 'function') {
        showSnackbar(error.message || 'Terjadi kesalahan', 'error');
      }
    } finally {
      setLoadingSubmit(false);
    }
  };


  return (
    <>
'use client'

import React, { useState } from 'react'
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  FormControl, InputLabel, Select, MenuItem, TextField,
  DialogActions, CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'
import { DesktopAddButton } from './styles'
import { iuranService } from '@/services/iuranService'
import { useSoftUIController } from '@/context'

export default function IuranHeader({
  totalIuran,
  isLoadingTotal,
  formatCurrency,
  showSnackbar
}) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode

  const [openIuranDialog, setOpenIuranDialog] = useState(false);
  const [status, setStatus] = useState('bph');
  const [nra, setNra] = useState('');
  const [nama, setNama] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleOpenIuranDialog = () => {
    setOpenIuranDialog(true);
    setStatus('bph');
    setNra('');
    setNama('');
  };

  const handleCloseIuranDialog = () => {
    setOpenIuranDialog(false);
  };

  const handleSubmitIuran = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const newMember = { status, nra, nama };
      const response = await iuranService.addMember(newMember);

      if (response?.code >= 200 && response?.code < 300) {
        if (typeof showSnackbar === 'function') {
          showSnackbar('Member berhasil ditambahkan', 'success');
        }

        handleCloseIuranDialog();
      } else {
        console.error('Gagal menambah member:', response);
        if (typeof showSnackbar === 'function') {
          showSnackbar(response.message || 'Gagal menambah member', 'error');
        }
      }
    } catch (error) {
      console.error('Error saat tambah member:', error);
      if (typeof showSnackbar === 'function') {
        showSnackbar(error.message || 'Terjadi kesalahan', 'error');
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Box sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.2) 0%, rgba(21, 101, 192, 0.25) 50%, rgba(30, 136, 229, 0.2) 100%)'
          : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.15) 50%, rgba(30, 136, 229, 0.1) 100%)',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        border: isDarkMode 
          ? '1px solid rgba(25, 118, 210, 0.3)'
          : '1px solid rgba(25, 118, 210, 0.2)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(25, 118, 210, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(25, 118, 210, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        marginBottom: { xs: '8px', sm: '24px' },
        padding: '24px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDarkMode 
            ? '0 12px 40px rgba(25, 118, 210, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : '0 12px 40px rgba(25, 118, 210, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }
      }}>
        {/* Background Icon */}
        <Box sx={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          opacity: isDarkMode ? 0.15 : 0.1,
          color: isDarkMode ? '#64b5f6' : '#1976d2',
        }}>
          <GroupIcon sx={{ fontSize: '120px' }} />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: isDarkMode ? '#64b5f6' : '#1565c0',
              textShadow: isDarkMode 
                ? '0 2px 10px rgba(100, 181, 246, 0.4)' 
                : '0 2px 10px rgba(21, 101, 192, 0.3)',
            }}
          >
            👥 Data Iuran
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: isDarkMode ? '#90caf9' : '#1e88e5',
              fontWeight: 600,
              letterSpacing: '0.5px',
              mb: 3
            }}
          >
            Kelola data member dan iuran organisasi
          </Typography>
          <DesktopAddButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenIuranDialog}
            sx={{ 
              p: 2.5,
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(21, 101, 192, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(21, 101, 192, 0.9) 0%, rgba(13, 71, 161, 1) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(100, 181, 246, 0.3)'
                : '1px solid rgba(25, 118, 210, 0.3)',
              boxShadow: isDarkMode 
                ? '0 4px 16px rgba(25, 118, 210, 0.3)'
                : '0 4px 16px rgba(21, 101, 192, 0.3)',
              color: '#ffffff',
              fontWeight: 600,
              '&:hover': {
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 1) 100%)'
                  : 'linear-gradient(135deg, rgba(21, 101, 192, 1) 0%, rgba(13, 71, 161, 1) 100%)',
                boxShadow: isDarkMode 
                  ? '0 6px 20px rgba(25, 118, 210, 0.4)'
                  : '0 6px 20px rgba(21, 101, 192, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Tambah Member
          </DesktopAddButton>
        </Box>

        {/* Dialog Input Member */}
        <Dialog open={openIuranDialog} onClose={handleCloseIuranDialog} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 1) 100%)'
              : 'linear-gradient(135deg, rgba(21, 101, 192, 0.9) 0%, rgba(13, 71, 161, 1) 100%)',
            color: 'white',
            fontWeight: 600
          }}>
            Tambah Member
          </DialogTitle>
          <DialogContent sx={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(245, 255, 247, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box component="form" onSubmit={handleSubmitIuran} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

              {/* Pilihan Status */}
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: isDarkMode ? '#64b5f6' : '#1565c0',
                  '&.Mui-focused': {
                    color: isDarkMode ? '#64b5f6' : '#1565c0'
                  }
                }}>
                  Status
                </InputLabel>
                <Select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  sx={{ 
                    background: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.8)',
                    color: isDarkMode ? '#ffffff' : '#1565c0', 
                    fontWeight: 600,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(25, 118, 210, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#64b5f6' : '#1976d2'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: isDarkMode ? '#64b5f6' : '#1976d2'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, rgba(40, 40, 40, 0.95) 0%, rgba(60, 60, 60, 0.9) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        '& .MuiMenuItem-root': {
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="bph">BPH</MenuItem>
                  <MenuItem value="anggota">Anggota</MenuItem>
                </Select>
              </FormControl>

              {/* Input NRA */}
              <TextField
                label="NRA"
                value={nra}
                onChange={e => setNra(e.target.value)}
                fullWidth
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    background: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.8)',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(25, 118, 210, 0.3)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#64b5f6' : '#1976d2'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#64b5f6' : '#1976d2'
                    }
                  }
                }}
                InputLabelProps={{ 
                  style: { 
                    color: isDarkMode ? '#64b5f6' : '#1565c0'
                  }
                }}
              />

              {/* Input Nama */}
              <TextField
                label="Nama"
                value={nama}
                onChange={e => setNama(e.target.value)}
                fullWidth
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    background: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.8)',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(100, 181, 246, 0.3)' : 'rgba(25, 118, 210, 0.3)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#64b5f6' : '#1976d2'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#64b5f6' : '#1976d2'
                    }
                  }
                }}
                InputLabelProps={{ 
                  style: { 
                    color: isDarkMode ? '#64b5f6' : '#1565c0'
                  }
                }}
              />

              <DialogActions sx={{ 
                px: 0, 
                background: 'transparent'
              }}>
                <Button 
                  onClick={handleCloseIuranDialog} 
                  sx={{ 
                    color: isDarkMode ? '#64b5f6' : '#1565c0', 
                    fontWeight: 600 
                  }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ 
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(21, 101, 192, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(21, 101, 192, 0.9) 0%, rgba(13, 71, 161, 1) 100%)',
                    color: 'white', 
                    fontWeight: 600, 
                    '&:hover': { 
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 1) 100%)'
                        : 'linear-gradient(135deg, rgba(21, 101, 192, 1) 0%, rgba(13, 71, 161, 1) 100%)'
                    }
                  }}
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? <CircularProgress size={24} color="inherit" /> : 'Simpan'}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}
    </>
  )
}
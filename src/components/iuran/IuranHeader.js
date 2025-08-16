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
      <Box sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        padding: '24px',
        color: 'white',
        borderRadius: '16px',
        marginBottom: { xs: '8px', sm: '24px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Data Iuran
          </Typography>
          {/* <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Iuran: {isLoadingTotal ? 'Memuat...' : formatCurrency(totalIuran)}
          </Typography> */}
        </Box>
        <DesktopAddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenIuranDialog}
          sx={{ p: 2.5 }}
        >
          Tambah Member
        </DesktopAddButton>

        {/* Dialog Input Member */}
        <Dialog open={openIuranDialog} onClose={handleCloseIuranDialog} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>Tambah Member</DialogTitle>
          <DialogContent sx={{ bgcolor: '#f5fff7' }}>
            <Box component="form" onSubmit={handleSubmitIuran} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

              {/* Pilihan Status */}
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#1a237e' }}>Status</InputLabel>
                <Select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  sx={{ bgcolor: 'white', color: '#1a237e', fontWeight: 600 }}
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
                sx={{ bgcolor: 'white' }}
                InputLabelProps={{ style: { color: '#1a237e' } }}
              />

              {/* Input Nama */}
              <TextField
                label="Nama"
                value={nama}
                onChange={e => setNama(e.target.value)}
                fullWidth
                required
                sx={{ bgcolor: 'white' }}
                InputLabelProps={{ style: { color: '#1a237e' } }}
              />

              <DialogActions sx={{ px: 0, bgcolor: '#f5fff7' }}>
                <Button onClick={handleCloseIuranDialog} sx={{ color: '#1a237e', fontWeight: 600 }}>Batal</Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#1b5e20' } }}
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
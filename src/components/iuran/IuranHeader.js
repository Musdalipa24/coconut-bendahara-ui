'use client'

import React, { useState } from 'react'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, DialogActions } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DesktopAddButton, AddButton } from './styles'

export default function IuranHeader({
  totalIuran,
  isLoadingTotal,
  handleAdd,
  formatCurrency
}) {
  const [openIuranDialog, setOpenIuranDialog] = useState(false);
  const [status, setStatus] = useState('bph');
  const [nama, setNama] = useState('');
  const [lunas, setLunas] = useState('lunas');
  const [jumlahBayar, setJumlahBayar] = useState('');

  const handleOpenIuranDialog = () => {
    setOpenIuranDialog(true);
    setStatus('bph');
    setNama('');
    setLunas('lunas');
    setJumlahBayar('');
  };
  const handleCloseIuranDialog = () => {
    setOpenIuranDialog(false);
  };
  const handleSubmitIuran = (e) => {
    e.preventDefault();
    // TODO: submit logic
    setOpenIuranDialog(false);
  };

  const namaBPH = [
    'Syahrul',
    'Aksan',
    'Faisal',
    'Ipa',
    'Citra',
    'Parwati',
    'Kiki',
    'Syarif',
    'Yusuf',
    'Windu',
    'Amel',
    'Salsa',
    'Fikri'
  ];
  const namaAnggota = [
    'Morgan',
    'Kaisya',
    'Lisa',
    'Bayyin',
    'Saudah',
    'Nawat',
    'Naufal',
    'Tege',
    'Dika',
    'Fajrul',
    'Udin',
    'Syah',
    'Dedes'
  ];

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
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Iuran: {isLoadingTotal ? 'Memuat...' : formatCurrency(totalIuran)}
          </Typography>
        </Box>
        <DesktopAddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenIuranDialog}
          sx={{ p: 2.5 }}
        >
          Tambah Member
        </DesktopAddButton>

        {/* Dialog Iuran Mingguan */}
        <Dialog open={openIuranDialog} onClose={handleCloseIuranDialog} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>Input Iuran Mingguan</DialogTitle>
          <DialogContent sx={{ bgcolor: '#f5fff7' }}>
            <Box component="form" onSubmit={handleSubmitIuran} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#1a237e' }}>Status</InputLabel>
                <Select
                  label="Status"
                  value={status}
                  onChange={e => { setStatus(e.target.value); setNama(''); }}
                  sx={{ bgcolor: 'white', color: '#1a237e', fontWeight: 600 }}
                >
                  <MenuItem value="bph">BPH</MenuItem>
                  <MenuItem value="anggota">Anggota</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#1a237e' }}>Nama</InputLabel>
                <Select
                  label="Nama"
                  value={nama}
                  onChange={e => setNama(e.target.value)}
                  sx={{ bgcolor: 'white', color: '#1a237e', fontWeight: 600 }}
                >
                  {(status === 'bph' ? namaBPH : namaAnggota).map(n => (
                    <MenuItem key={n} value={n}>{n}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <RadioGroup
                row
                value={lunas}
                onChange={e => setLunas(e.target.value)}
                sx={{ color: '#1a237e' }}
              >
                <FormControlLabel value="lunas" control={<Radio sx={{ color: '#1a237e' }} />} label="Lunas" />
                <FormControlLabel value="belum" control={<Radio sx={{ color: '#1a237e' }} />} label="Belum Lunas" />
              </RadioGroup>
              {lunas === 'belum' && (
                <TextField
                  label="Jumlah yang dibayar"
                  type="number"
                  value={jumlahBayar}
                  onChange={e => setJumlahBayar(e.target.value)}
                  fullWidth
                  required
                  sx={{ bgcolor: 'white', color: '#1a237e' }}
                  InputLabelProps={{ style: { color: '#1a237e' } }}
                />
              )}
              <DialogActions sx={{ px: 0, bgcolor: '#f5fff7' }}>
                <Button onClick={handleCloseIuranDialog} sx={{ color: '#1a237e', fontWeight: 600 }}>Batal</Button>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#1b5e20' } }}>Simpan</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}
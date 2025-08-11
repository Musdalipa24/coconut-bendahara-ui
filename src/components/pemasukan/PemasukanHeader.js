'use client'

import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { DesktopAddButton, AddButton, IuranButton } from './styles'

export default function PemasukanHeader({
  totalPemasukan,
  isLoadingTotal,
  handleAdd,
  formatCurrency
}) {
  // Dummy data nama BPH dan anggota
  const namaBPH = ['Budi', 'Siti', 'Andi'];
  const namaAnggota = ['Rina', 'Dewi', 'Joko', 'Tono'];

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

  return (
    <>
      <Box sx={{
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        padding: '24px',
        color: 'white',
        borderRadius: '16px',
        marginBottom: { xs: '8px', sm: '24px' },
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Data Pemasukan
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Pemasukan: {isLoadingTotal ? 'Memuat...' : formatCurrency(totalPemasukan)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <DesktopAddButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Tambah Pemasukan
          </DesktopAddButton>
          <IuranButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenIuranDialog}
          >
            Input Iuran Mingguan
          </IuranButton>
        </Box>
      </Box>

      <AddButton
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAdd}
      >
        Tambah Pemasukan
      </AddButton>

      {/* Dialog Iuran Mingguan */}
      <Dialog open={openIuranDialog} onClose={handleCloseIuranDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2e7d32', color: 'white' }}>Input Iuran Mingguan</DialogTitle>
        <DialogContent sx={{ bgcolor: '#f5fff7' }}>
          <Box component="form" onSubmit={handleSubmitIuran} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#2e7d32' }}>Status</InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={e => { setStatus(e.target.value); setNama(''); }}
                sx={{ bgcolor: 'white', color: '#2e7d32', fontWeight: 600 }}
              >
                <MenuItem value="bph">BPH</MenuItem>
                <MenuItem value="anggota">Anggota</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#2e7d32' }}>Nama</InputLabel>
              <Select
                label="Nama"
                value={nama}
                onChange={e => setNama(e.target.value)}
                sx={{ bgcolor: 'white', color: '#2e7d32', fontWeight: 600 }}
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
              sx={{ color: '#2e7d32' }}
            >
              <FormControlLabel value="lunas" control={<Radio sx={{ color: '#2e7d32' }} />} label="Lunas" />
              <FormControlLabel value="belum" control={<Radio sx={{ color: '#2e7d32' }} />} label="Belum Lunas" />
            </RadioGroup>
            {lunas === 'belum' && (
              <TextField
                label="Jumlah yang dibayar"
                type="number"
                value={jumlahBayar}
                onChange={e => setJumlahBayar(e.target.value)}
                fullWidth
                required
                sx={{ bgcolor: 'white', color: '#2e7d32' }}
                InputLabelProps={{ style: { color: '#2e7d32' } }}
              />
            )}
            <DialogActions sx={{ px: 0, bgcolor: '#f5fff7' }}>
              <Button onClick={handleCloseIuranDialog} sx={{ color: '#2e7d32', fontWeight: 600 }}>Batal</Button>
              <Button type="submit" variant="contained" sx={{ bgcolor: '#2e7d32', color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#1b5e20' } }}>Simpan</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
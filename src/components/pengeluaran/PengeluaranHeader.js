'use client'

import { Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DesktopAddButton, AddButton } from './styles'

export default function PengeluaranHeader({ 
  totalPengeluaran, 
  isLoadingTotal, 
  handleAdd,
  formatCurrency 
}) {
  return (
    <>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
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
            Data Pengeluaran
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Pengeluaran: {isLoadingTotal ? 'Memuat...' : formatCurrency(totalPengeluaran)}
          </Typography>
        </Box>
        <DesktopAddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ p: 2.5 }}
        >
          Tambah Pengeluaran
        </DesktopAddButton>
      </Box>
    </>
  )
}
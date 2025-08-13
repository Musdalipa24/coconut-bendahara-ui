'use client'

import { Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DesktopAddButton, AddButton } from './styles'

export default function PemasukanHeader({
  totalPemasukan,
  isLoadingTotal,
  handleAdd,
  formatCurrency
}) {
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
            sx={{ p: 2.5 }}
          >
            Tambah Pemasukan
          </DesktopAddButton>
        </Box>
      </Box>
    </>
  )
}
'use client'

import { Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { DesktopAddButton, AddButton } from './styles'
import { useSoftUIController } from '@/context'

export default function PengeluaranHeader({ 
  totalPengeluaran, 
  isLoadingTotal, 
  handleAdd,
  formatCurrency 
}) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode

  return (
    <>
      <Box sx={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.25) 50%, rgba(239, 83, 80, 0.2) 100%)'
          : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 50%, rgba(239, 83, 80, 0.1) 100%)',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        border: isDarkMode 
          ? '1px solid rgba(244, 67, 54, 0.3)'
          : '1px solid rgba(244, 67, 54, 0.2)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(244, 67, 54, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(244, 67, 54, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        marginBottom: { xs: '8px', sm: '24px' },
        padding: '24px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDarkMode 
            ? '0 12px 40px rgba(244, 67, 54, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : '0 12px 40px rgba(244, 67, 54, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }
      }}>
        {/* Background Icon */}
        <Box sx={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          opacity: isDarkMode ? 0.15 : 0.1,
          color: isDarkMode ? '#e57373' : '#f44336',
        }}>
          <TrendingDownIcon sx={{ fontSize: '120px' }} />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: isDarkMode ? '#e57373' : '#d32f2f',
              textShadow: isDarkMode 
                ? '0 2px 10px rgba(229, 115, 115, 0.4)' 
                : '0 2px 10px rgba(211, 47, 47, 0.3)',
            }}
          >
            Data Pengeluaran
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: isDarkMode ? '#ffab91' : '#e53935',
              fontWeight: 600,
              letterSpacing: '0.5px',
              mb: 2
            }}
          >
            Total Pengeluaran: 
          </Typography>
          <Typography 
            variant="h5" 
            sx={{
              fontWeight: 700,
              color: isDarkMode ? '#f44336' : '#b71c1c',
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              textShadow: isDarkMode 
                ? '0 2px 10px rgba(244, 67, 54, 0.4)' 
                : '0 2px 10px rgba(183, 28, 28, 0.3)',
              mb: 3
            }}
          >
            {isLoadingTotal ? (
              <Box 
                sx={{
                  width: '100px',
                  height: '20px',
                  borderRadius: '10px',
                  background: isDarkMode 
                    ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.3) 25%, rgba(229, 57, 53, 0.5) 50%, rgba(244, 67, 54, 0.3) 75%)'
                    : 'linear-gradient(90deg, rgba(244, 67, 54, 0.2) 25%, rgba(229, 57, 53, 0.4) 50%, rgba(244, 67, 54, 0.2) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite',
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                  },
                  display: 'inline-block'
                }}
              />
            ) : (
              formatCurrency(totalPengeluaran)
            )}
          </Typography>
          <DesktopAddButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ 
              p: 2.5,
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.8) 0%, rgba(229, 57, 53, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(211, 47, 47, 0.9) 0%, rgba(183, 28, 28, 1) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(229, 115, 115, 0.3)'
                : '1px solid rgba(244, 67, 54, 0.3)',
              boxShadow: isDarkMode 
                ? '0 4px 16px rgba(244, 67, 54, 0.3)'
                : '0 4px 16px rgba(211, 47, 47, 0.3)',
              color: '#ffffff',
              fontWeight: 600,
              '&:hover': {
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(229, 57, 53, 1) 100%)'
                  : 'linear-gradient(135deg, rgba(211, 47, 47, 1) 0%, rgba(183, 28, 28, 1) 100%)',
                boxShadow: isDarkMode 
                  ? '0 6px 20px rgba(244, 67, 54, 0.4)'
                  : '0 6px 20px rgba(211, 47, 47, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Tambah Pengeluaran
          </DesktopAddButton>
        </Box>
      </Box>
    </>
  )
}
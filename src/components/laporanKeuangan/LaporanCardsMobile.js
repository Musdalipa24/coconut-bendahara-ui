import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';

export default function LaporanCardsMobile({ filteredData, formatDateTime, formatRupiah }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
      {filteredData.map((row, index) => (
        <Card 
          key={row.id_pemasukan || row.id_pengeluaran || index} 
          sx={{ 
            borderRadius: '16px', 
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.3)' 
              : '0 2px 8px rgba(0,0,0,0.1)', 
            overflow: 'visible', 
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.8)',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="caption" 
                sx={{ color: isDarkMode ? '#b0b0b0' : 'textSecondary' }}
              >
                Tanggal
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  color: isDarkMode ? '#ffffff' : 'inherit'
                }}
              >
                {formatDateTime(row.tanggal)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="caption" 
                sx={{ color: isDarkMode ? '#b0b0b0' : 'textSecondary' }}
              >
                Keterangan
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500,
                  color: isDarkMode ? '#ffffff' : 'inherit'
                }}
              >
                {row.keterangan}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="caption" 
                sx={{ color: isDarkMode ? '#b0b0b0' : 'textSecondary' }}
              >
                Nominal
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600, 
                  color: row.pemasukan > 0 ? '#4caf50' : '#f44336' 
                }}
              >
                {row.pemasukan > 0 ? `+ ${formatRupiah(row.pemasukan)}` : `- ${formatRupiah(row.pengeluaran)}`}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="caption" 
                sx={{ color: isDarkMode ? '#b0b0b0' : 'textSecondary' }}
              >
                Saldo
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#ffffff' : 'inherit'
                }}
              >
                {formatRupiah(row.total_saldo)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
      {filteredData.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.6) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '16px', 
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <AccountBalanceIcon sx={{ 
            fontSize: 48, 
            color: isDarkMode ? '#666' : '#ccc', 
            mb: 2 
          }} />
          <Typography 
            variant="body1" 
            sx={{ color: isDarkMode ? '#b0b0b0' : 'textSecondary' }}
          >
            Tidak ada data untuk periode ini
          </Typography>
        </Box>
      )}
    </Box>
  );
}

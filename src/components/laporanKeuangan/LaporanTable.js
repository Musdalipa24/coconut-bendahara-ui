import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, useTheme } from '@mui/material';
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { StyledCard } from './styles';

export default function LaporanTable({ loading, filteredData, formatDateTime, formatRupiah }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <StyledCard sx={{ 
      p: 0, 
      background: isDarkMode 
        ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.6) 100%)', 
      backdropFilter: 'blur(20px)',
      border: isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.1)' 
        : '1px solid rgba(255, 255, 255, 0.8)',
      color: isDarkMode ? '#ffffff' : 'inherit', 
      display: { xs: 'none', md: 'block' } 
    }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          bgcolor: isDarkMode ? 'rgba(100, 181, 246, 0.8)' : 'primary.main', 
          color: 'white', 
          p: 2, 
          borderRadius: '8px 8px 0 0', 
          fontWeight: 500 
        }}>
          Kelola data keuangan organisasi dengan mudah
        </Box>
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 600,
                  borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : undefined
                }}>
                  Tanggal
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 600,
                  borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : undefined
                }}>
                  Keterangan
                </TableCell>
                <TableCell align='right' sx={{ 
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 600,
                  borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : undefined
                }}>
                  Nominal
                </TableCell>
                <TableCell align='right' sx={{ 
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 600,
                  borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : undefined
                }}>
                  Saldo
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ 
                    py: 8,
                    color: isDarkMode ? '#ffffff' : 'inherit',
                    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                  }}>
                    <CircularProgress sx={{ color: isDarkMode ? '#64b5f6' : undefined }} />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ 
                    py: 8,
                    color: isDarkMode ? '#ffffff' : 'inherit',
                    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                  }}>
                    <AccountBalanceIcon sx={{ 
                      fontSize: 48, 
                      color: isDarkMode ? '#666' : '#ccc', 
                      mb: 2 
                    }} />
                    <Typography variant="body1" sx={{ 
                      color: isDarkMode ? '#b0b0b0' : 'textSecondary' 
                    }}>
                      Tidak ada data untuk periode ini
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow key={row.id_pemasukan || row.id_pengeluaran || index}>
                    <TableCell sx={{ 
                      color: isDarkMode ? '#ffffff' : 'inherit',
                      borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                    }}>
                      {formatDateTime(row.tanggal)}
                    </TableCell>
                    <TableCell sx={{ 
                      maxWidth: { md: '300px' }, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      color: isDarkMode ? '#ffffff' : 'inherit',
                      borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                    }}>
                      {row.keterangan}
                    </TableCell>
                    <TableCell align='right' sx={{ 
                      color: row.pemasukan > 0 ? '#4caf50' : '#f44336', 
                      fontWeight: 600, 
                      whiteSpace: 'nowrap',
                      borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                    }}>
                      {row.pemasukan > 0 ? `+ ${formatRupiah(row.pemasukan)}` : `- ${formatRupiah(row.pengeluaran)}`}
                    </TableCell>
                    <TableCell align='right' sx={{ 
                      fontWeight: 600, 
                      whiteSpace: 'nowrap',
                      color: isDarkMode ? '#ffffff' : 'inherit',
                      borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
                    }}>
                      {formatRupiah(row.total_saldo)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </StyledCard>
  );
}

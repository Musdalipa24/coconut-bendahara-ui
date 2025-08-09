import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  AccountBalance as AccountBalanceIcon
} from '@mui/material'
import { StyledCard } from './styles'
import { formatDateTime, formatRupiah } from './utils'

export const FinancialTable = ({ loading, filteredData }) => {
  return (
    <StyledCard sx={{
      p: 0,
      background: 'white',
      color: 'inherit',
      display: { xs: 'none', md: 'block' }
    }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          borderRadius: '8px 8px 0 0',
          fontWeight: 500
        }}>
          Kelola data keuangan desa dengan mudah
        </Box>
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tanggal</TableCell>
                <TableCell>Keterangan</TableCell>
                <TableCell align='right'>Nominal</TableCell>
                <TableCell align='right'>Saldo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary">
                      Tidak ada data untuk periode ini
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow
                    key={row.id_pemasukan || row.id_pengeluaran || index}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f8f9fa',
                        '& .action-buttons': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                    <TableCell sx={{
                      maxWidth: { md: '300px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{row.keterangan}</TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        color: row.pemasukan > 0 ? '#2e7d32' : '#d32f2f',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {row.pemasukan > 0
                        ? `+ ${formatRupiah(row.pemasukan)}`
                        : `- ${formatRupiah(row.pengeluaran)}`
                      }
                    </TableCell>
                    <TableCell align='right' sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
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
  )
}
'use client'

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TablePagination,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Box,
  TableContainer
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { StyledCard } from './styles'
import { useSoftUIController } from '@/context'

export default function PemasukanTable({
  rows,
  loading,
  page,
  rowsPerPage,
  totalItems,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDelete,
  handleShowNota, // Add this prop
  formatDateTime,
  formatCurrency
}) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode

  const tableHeaderStyle = {
    backgroundColor: isDarkMode 
      ? 'rgba(76, 175, 80, 0.1)' 
      : 'rgba(46, 125, 50, 0.05)',
    color: isDarkMode ? '#81c784' : '#2e7d32',
    fontWeight: 600,
  }

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 
      ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)')
      : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(248, 249, 250, 0.8)'),
    '&:hover': {
      backgroundColor: isDarkMode 
        ? 'rgba(76, 175, 80, 0.1)' 
        : 'rgba(46, 125, 50, 0.05)',
      '& .action-buttons': {
        opacity: 1
      }
    }
  })

  return (
    <StyledCard>
      <Box sx={{ p: 3 }}>
        {/* Table dengan Glass Morphism seperti IuranTable */}
        <TableContainer 
          component={Box} 
          sx={{ 
            overflowX: 'auto',
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.4) 100%)',
            backdropFilter: 'blur(20px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ 
                background: isDarkMode 
                  ? 'rgba(129, 199, 132, 0.1)' 
                  : 'rgba(46, 125, 50, 0.05)',
              }}>
                <TableCell 
                  align='center'
                  sx={{ 
                    color: isDarkMode ? '#81c784' : '#2e7d32',
                    fontWeight: 600 
                  }}
                >
                  No
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  fontWeight: 600 
                }}>
                  Tanggal
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  fontWeight: 600 
                }}>
                  Kategori
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  fontWeight: 600 
                }}>
                  Jumlah
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  fontWeight: 600 
                }}>
                  Keterangan
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  fontWeight: 600 
                }}>
                  Nota
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: isDarkMode ? '#81c784' : '#2e7d32',
                    fontWeight: 600 
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box 
                      sx={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isDarkMode 
                          ? 'conic-gradient(from 0deg, #81c784, #a5d6a7, #66bb6a, #81c784)'
                          : 'conic-gradient(from 0deg, #2e7d32, #4caf50, #388e3c, #2e7d32)',
                        animation: 'spin 2s linear infinite',
                        margin: '0 auto 8px',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    <Typography sx={{ color: isDarkMode ? '#81c784' : '#2e7d32' }}>
                      Memuat data pemasukan...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <AccountBalanceIcon sx={{ 
                      fontSize: 48, 
                      color: isDarkMode ? '#4caf50' : '#81c784', 
                      mb: 2 
                    }} />
                    <Typography 
                      variant="body1" 
                      sx={{ color: isDarkMode ? '#b0b0b0' : '#666666' }}
                    >
                      Belum ada data pemasukan
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: index % 2 === 0 
                        ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)')
                        : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(248, 249, 250, 0.8)'),
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(129, 199, 132, 0.1)' 
                          : 'rgba(46, 125, 50, 0.05)',
                        '& .action-buttons': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <TableCell 
                      align='center'
                      sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                      {formatDateTime(row.tanggal)}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                      {row.kategori}
                    </TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? '#81c784' : '#2e7d32',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {formatCurrency(row.nominal)}
                    </TableCell>
                    <TableCell sx={{
                      maxWidth: { xs: '120px', sm: '200px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}>
                      {row.keterangan}
                    </TableCell>
                    <TableCell>
                      {row.nota ? (
                        <IconButton
                          onClick={() => handleShowNota(row.nota)}
                          size="small"
                          aria-label={`Lihat nota pemasukan nomor ${row.id}`}
                          sx={{ color: isDarkMode ? '#81c784' : '#2e7d32' }}
                        >
                          <ReceiptIcon />
                        </IconButton>
                      ) : (
                        <Typography 
                          variant="caption" 
                          sx={{ color: isDarkMode ? '#888888' : '#666666' }}
                        >
                          Tidak ada
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        className="action-buttons"
                        sx={{
                          opacity: { xs: 1, sm: 0.5 },
                          transition: 'opacity 0.2s',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{
                              color: isDarkMode ? '#81c784' : '#2e7d32',
                              width: { xs: '35px', sm: '30px' },
                              height: { xs: '35px', sm: '30px' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.id)}
                            sx={{
                              color: isDarkMode ? '#e57373' : '#d32f2f',
                              width: { xs: '35px', sm: '30px' },
                              height: { xs: '35px', sm: '30px' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination tetap di bawah */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
          sx={{
            borderTop: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(224, 224, 224, 1)',
            color: isDarkMode ? '#ffffff' : '#000000',
            '& .MuiTablePagination-toolbar': {
              padding: '16px'
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: isDarkMode ? '#ffffff' : '#000000'
            },
            '& .MuiTablePagination-select': {
              color: isDarkMode ? '#ffffff' : '#000000'
            },
            '& .MuiIconButton-root': {
              color: isDarkMode ? '#ffffff' : '#000000'
            }
          }}
        />
      </Box>
    </StyledCard>
  )
}
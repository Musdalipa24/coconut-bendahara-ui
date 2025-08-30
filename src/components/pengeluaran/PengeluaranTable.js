'use client'

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TablePagination,
  TableContainer,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { StyledCard } from './styles'
import { useSoftUIController } from '@/context'

export default function PengeluaranTable({
  rows,
  loading,
  page,
  rowsPerPage,
  totalItems,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEdit,
  handleDelete,
  handleShowNota,
  formatDateTime,
  formatCurrency,
  timeRange,
  setTimeRange,
  timeRangeOptions
}) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode

  const tableHeaderStyle = {
    backgroundColor: isDarkMode 
      ? 'rgba(229, 57, 53, 0.1)' 
      : 'rgba(198, 40, 40, 0.05)',
    color: isDarkMode ? '#e57373' : '#c62828',
    fontWeight: 600,
  }

  const getRowStyle = (index) => ({
    backgroundColor: index % 2 === 0 
      ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)')
      : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(248, 249, 250, 0.8)'),
    '&:hover': {
      backgroundColor: isDarkMode 
        ? 'rgba(229, 57, 53, 0.1)' 
        : 'rgba(198, 40, 40, 0.05)',
    }
  })

  return (
    <StyledCard>
      <Box sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: 3
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              background: isDarkMode 
                ? 'linear-gradient(45deg, #e57373, #ef5350)'
                : 'linear-gradient(45deg, #c62828, #d32f2f)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}
          >
            Kelola data pengeluaran organisasi dengan mudah
          </Typography>
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: '180px' },
              maxWidth: { xs: '600px', sm: '180px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, rgba(40, 40, 40, 0.9) 0%, rgba(60, 60, 60, 0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.9rem',
                padding: '4px 8px',
                border: isDarkMode 
                  ? '1px solid rgba(229, 57, 53, 0.3)'
                  : '1px solid rgba(198, 40, 40, 0.2)',
                boxShadow: isDarkMode 
                  ? '0 2px 8px rgba(229, 57, 53, 0.1)'
                  : '0 2px 8px rgba(198, 40, 40, 0.1)',
                color: isDarkMode ? '#ffffff' : '#000000',
                '& .MuiSelect-select': {
                  padding: '8px 12px',
                  paddingRight: '32px !important',
                  color: isDarkMode ? '#ffffff' : '#000000'
                },
                '&:hover': {
                  borderColor: isDarkMode ? '#e57373' : '#c62828',
                  boxShadow: isDarkMode 
                    ? '0 4px 12px rgba(229, 57, 53, 0.2)'
                    : '0 4px 12px rgba(198, 40, 40, 0.2)',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(229, 57, 53, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(198, 40, 40, 0.05) 0%, rgba(229, 57, 53, 0.02) 100%)'
                },
                '&.Mui-focused': {
                  borderColor: isDarkMode ? '#e57373' : '#c62828',
                  borderWidth: '2px',
                  boxShadow: isDarkMode 
                    ? '0 0 0 3px rgba(229, 57, 53, 0.1)'
                    : '0 0 0 3px rgba(198, 40, 40, 0.1)',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(229, 57, 53, 0.08) 0%, rgba(244, 67, 54, 0.04) 100%)'
                    : 'linear-gradient(135deg, rgba(198, 40, 40, 0.08) 0%, rgba(229, 57, 53, 0.04) 100%)'
                },
                transition: 'all 0.2s ease'
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.9rem',
                color: isDarkMode ? '#b0b0b0' : '#666',
                transform: 'translate(14px, 10px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  color: isDarkMode ? '#e57373' : '#c62828'
                },
                '&.Mui-focused': {
                  color: isDarkMode ? '#e57373' : '#c62828'
                }
              },
              '& .MuiSvgIcon-root': {
                color: isDarkMode ? '#e57373' : '#c62828'
              }
            }}
          >
            <InputLabel>Filter Periode</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Filter Periode"
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(40, 40, 40, 0.95) 0%, rgba(60, 60, 60, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: isDarkMode 
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    '& .MuiMenuItem-root': {
                      color: isDarkMode ? '#ffffff' : '#000000',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(229, 57, 53, 0.1)'
                          : 'rgba(198, 40, 40, 0.05)'
                      }
                    }
                  }
                }
              }}
            >
              {timeRangeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
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
                  ? 'rgba(229, 115, 115, 0.1)' 
                  : 'rgba(198, 40, 40, 0.05)',
              }}>
                <TableCell sx={{ 
                  color: isDarkMode ? '#e57373' : '#c62828',
                  fontWeight: 600 
                }}>
                  No
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#e57373' : '#c62828',
                  fontWeight: 600 
                }}>
                  Tanggal
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#e57373' : '#c62828',
                  fontWeight: 600 
                }}>
                  Jumlah
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#e57373' : '#c62828',
                  fontWeight: 600 
                }}>
                  Keterangan
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? '#e57373' : '#c62828',
                  fontWeight: 600 
                }}>
                  Nota
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: isDarkMode ? '#e57373' : '#c62828',
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
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box 
                      sx={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isDarkMode 
                          ? 'conic-gradient(from 0deg, #e57373, #ef5350, #f44336, #e57373)'
                          : 'conic-gradient(from 0deg, #c62828, #d32f2f, #f44336, #c62828)',
                        animation: 'spin 2s linear infinite',
                        margin: '0 auto 8px',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    <Typography sx={{ color: isDarkMode ? '#e57373' : '#c62828' }}>
                      Memuat data pengeluaran...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <MoneyOffIcon sx={{ 
                      fontSize: 48, 
                      color: isDarkMode ? '#f44336' : '#e57373', 
                      mb: 2 
                    }} />
                    <Typography 
                      variant="body1" 
                      sx={{ color: isDarkMode ? '#b0b0b0' : '#666666' }}
                    >
                      Tidak ada data pengeluaran
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
                          ? 'rgba(229, 115, 115, 0.1)' 
                          : 'rgba(198, 40, 40, 0.05)',
                        '& .action-buttons': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                      {formatDateTime(row.tanggal)}
                    </TableCell>
                    <TableCell sx={{ 
                      color: isDarkMode ? '#e57373' : '#d32f2f', 
                      fontWeight: 600 
                    }}>
                      {formatCurrency(row.nominal)}
                    </TableCell>
                    <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                      {row.keterangan}
                    </TableCell>
                    <TableCell>
                      {row.nota ? (
                        <IconButton
                          onClick={() => handleShowNota(row.nota)}
                          size="small"
                          aria-label={`Lihat nota pengeluaran nomor ${row.id}`}
                          sx={{ color: isDarkMode ? '#e57373' : '#c62828' }}
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
                            aria-label={`Edit pengeluaran nomor ${row.id}`}
                            sx={{
                              color: isDarkMode ? '#e57373' : '#c62828',
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
                            aria-label={`Hapus pengeluaran nomor ${row.id}`}
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
        </TableContainer>
      </Box>
    </StyledCard>
  )
}
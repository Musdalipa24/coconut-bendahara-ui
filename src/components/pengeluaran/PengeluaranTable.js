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
          <Typography variant="h6" component="div" sx={{ color: '#1a237e' }}>
            Kelola data pengeluaran desa dengan mudah
          </Typography>
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: { xs: '100%', sm: '180px' },
              maxWidth: { xs: '600px', sm: '180px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                fontSize: '0.9rem',
                padding: '4px 8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                '& .MuiSelect-select': {
                  padding: '8px 12px',
                  paddingRight: '32px !important'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1a237e',
                  boxShadow: '0 0 0 3px rgba(26,35,126,0.1)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1a237e',
                  borderWidth: '2px',
                  boxShadow: '0 0 0 3px rgba(26,35,126,0.1)'
                },
                transition: 'all 0.2s ease'
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.9rem',
                color: '#666',
                transform: 'translate(14px, 10px) scale(1)',
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)',
                  color: '#1a237e'
                },
                '&.Mui-focused': {
                  color: '#1a237e'
                }
              },
              '& .MuiSvgIcon-root': {
                color: '#1a237e'
              }
            }}
          >
            <InputLabel>Filter Periode</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Filter Periode"
            >
              {timeRangeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Keterangan</TableCell>
                <TableCell>Nota</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <MoneyOffIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary">
                      Tidak ada data pengeluaran
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                    <TableCell sx={{ color: '#d32f2f', fontWeight: 600 }}>
                      {formatCurrency(row.nominal)}
                    </TableCell>
                    <TableCell>{row.keterangan}</TableCell>
                    <TableCell>
                      {row.nota ? (
                        <IconButton
                          onClick={() => handleShowNota(row.nota)}
                          size="small"
                          aria-label={`Lihat nota pengeluaran nomor ${row.id}`}
                        >
                          <ReceiptIcon />
                        </IconButton>
                      ) : (
                        <Typography variant="caption">Tidak ada</Typography>
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
                              color: '#1a237e',
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
                              color: '#d32f2f',
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
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              '& .MuiTablePagination-toolbar': {
                padding: '16px'
              }
            }}
          />
        </Box>
      </Box>
    </StyledCard>
  )
}
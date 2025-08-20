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
import { StyledCard } from './styles'

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
  formatDateTime,
  formatCurrency
}) {
  return (
    <StyledCard>
      <Box sx={{ p: 3 }}>
        {/* 🔑 Tambahkan TableContainer agar bisa scroll horizontal */}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>No</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Keterangan</TableCell>
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
                    <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" color="textSecondary">
                      Belum ada data pemasukan
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f8f9fa',
                        '& .action-buttons': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <TableCell align='center'>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                    <TableCell>{row.kategori}</TableCell>
                    <TableCell sx={{
                      color: '#2e7d32',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {formatCurrency(row.nominal)}
                    </TableCell>
                    <TableCell sx={{
                      maxWidth: { xs: '120px', sm: '200px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {row.keterangan}
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
                              color: '#2e7d32',
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
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            '& .MuiTablePagination-toolbar': {
              padding: '16px'
            }
          }}
        />
      </Box>
    </StyledCard>
  )
}
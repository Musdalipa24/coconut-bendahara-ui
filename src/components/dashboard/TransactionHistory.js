import { Box, Typography, CircularProgress } from '@mui/material'
import { Card, CardHeader, CardBody } from '@/components/ui/card'

export default function TransactionHistory({ transactions, loading, searchQuery, formatCurrency, emptyIcon }) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h5" fontWeight={600} color="#1a237e">Transaksi Terakhir Organisasi</Typography>}
        sx={{ borderBottom: '1px solid #eee', p: 3 }}
      />
      <CardBody sx={{ p: 0 }}>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px', textAlign: 'left' }}>Tanggal</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Keterangan</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Jenis</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                    <CircularProgress />
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                    {emptyIcon}
                    <Typography variant="body1" color="textSecondary">
                      {searchQuery ? 'Tidak ada data sesuai pencarian' : 'Belum ada data transaksi'}
                    </Typography>
                  </td>
                </tr>
              ) : (
                transactions.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '16px' }}>{item.tanggal}</td>
                    <td style={{ padding: '16px' }}>{item.keterangan}</td>
                    <td style={{ padding: '16px' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '12px',
                          bgcolor: item.jenis_transaksi === 'Pemasukan' ? '#e8f5e9' : '#ffebee',
                          color: item.jenis_transaksi === 'Pemasukan' ? '#2e7d32' : '#d32f2f',
                        }}
                      >
                        {item.jenis_transaksi}
                      </Box>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: item.jenis_transaksi === 'Pemasukan' ? '#2e7d32' : '#d32f2f' }}>
                      {item.jenis_transaksi === 'Pemasukan'
                        ? `+ ${formatCurrency(item.nominal)}`
                        : `- ${formatCurrency(item.nominal)}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </CardBody>
    </Card>
  )
}
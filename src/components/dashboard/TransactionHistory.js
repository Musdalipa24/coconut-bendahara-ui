import { Box, Typography, CircularProgress, useTheme } from '@mui/material'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { useSoftUIController } from '@/context'

export default function TransactionHistory({ transactions, loading, searchQuery, formatCurrency, emptyIcon }) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  const theme = useTheme()

  const cardStyle = {
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
  }

  const headerStyle = {
    borderBottom: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.1)',
    p: 3,
    background: isDarkMode 
      ? 'rgba(100, 181, 246, 0.1)' 
      : 'rgba(25, 118, 210, 0.05)',
    borderRadius: '20px 20px 0 0',
  }

  const tableHeaderStyle = {
    backgroundColor: isDarkMode 
      ? 'rgba(100, 181, 246, 0.1)' 
      : 'rgba(25, 118, 210, 0.05)',
    color: isDarkMode ? '#90caf9' : '#1976d2',
  }

  const getRowStyle = (index) => ({
    borderBottom: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: index % 2 === 0 
      ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)')
      : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(248, 249, 250, 0.8)'),
    color: isDarkMode ? '#ffffff' : '#000000',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: isDarkMode 
        ? 'rgba(100, 181, 246, 0.1)' 
        : 'rgba(25, 118, 210, 0.05)',
    }
  })

  return (
    <Card sx={cardStyle}>
      <CardHeader
        title={
          <Typography 
            variant="h5" 
            sx={{
              fontWeight: 700,
              background: isDarkMode 
                ? 'linear-gradient(45deg, #64b5f6, #90caf9)'
                : 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Transaksi Terakhir Organisasi
          </Typography>
        }
        sx={headerStyle}
      />
      <CardBody sx={{ p: 0 }}>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={tableHeaderStyle}>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left',
                  color: isDarkMode ? '#90caf9' : '#1976d2',
                  fontWeight: 600,
                }}>
                  Tanggal
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left',
                  color: isDarkMode ? '#90caf9' : '#1976d2',
                  fontWeight: 600,
                }}>
                  Keterangan
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left',
                  color: isDarkMode ? '#90caf9' : '#1976d2',
                  fontWeight: 600,
                }}>
                  Jenis
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'right',
                  color: isDarkMode ? '#90caf9' : '#1976d2',
                  fontWeight: 600,
                }}>
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                      <Box 
                        sx={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: isDarkMode 
                            ? 'conic-gradient(from 0deg, #64b5f6, #90caf9, #42a5f5, #64b5f6)'
                            : 'conic-gradient(from 0deg, #1976d2, #42a5f5, #2196f3, #1976d2)',
                          animation: 'spin 2s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ color: isDarkMode ? '#90caf9' : '#1976d2' }}
                      >
                        Memuat transaksi...
                      </Typography>
                    </Box>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                    <Box sx={{ 
                      color: isDarkMode ? '#64b5f6' : '#1976d2',
                      mb: 2,
                    }}>
                      {emptyIcon}
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ color: isDarkMode ? '#b0b0b0' : '#666666' }}
                    >
                      {searchQuery ? 'Tidak ada data sesuai pencarian' : 'Belum ada data transaksi'}
                    </Typography>
                  </td>
                </tr>
              ) : (
                transactions.map((item, i) => (
                  <tr key={i} style={getRowStyle(i)}>
                    <td style={{ 
                      padding: '16px',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}>
                      {item.tanggal}
                    </td>
                    <td style={{ 
                      padding: '16px',
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}>
                      {item.keterangan}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: '12px',
                          background: item.jenis_transaksi === 'Pemasukan' 
                            ? (isDarkMode 
                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.3) 100%)'
                                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.15) 100%)')
                            : (isDarkMode 
                                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.3) 100%)'
                                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 100%)'),
                          color: item.jenis_transaksi === 'Pemasukan' 
                            ? (isDarkMode ? '#81c784' : '#2e7d32')
                            : (isDarkMode ? '#e57373' : '#d32f2f'),
                          fontWeight: 600,
                          border: `1px solid ${item.jenis_transaksi === 'Pemasukan' 
                            ? (isDarkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)')
                            : (isDarkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.2)')}`,
                        }}
                      >
                        {item.jenis_transaksi}
                      </Box>
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      textAlign: 'right', 
                      fontWeight: 600, 
                      color: item.jenis_transaksi === 'Pemasukan' 
                        ? (isDarkMode ? '#81c784' : '#2e7d32')
                        : (isDarkMode ? '#e57373' : '#d32f2f')
                    }}>
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
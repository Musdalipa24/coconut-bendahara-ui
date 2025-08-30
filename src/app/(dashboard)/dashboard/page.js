'use client'

import { Box, ThemeProvider, createTheme, Snackbar, Alert, IconButton, CircularProgress, Typography, Container, Fade } from '@mui/material'
import Slide from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { useState, useEffect } from 'react'
import { laporanService } from '@/services/laporanService'
import { transaksiService } from '@/services/transaksiService'
import { useSoftUIController } from '@/context'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import StatCard from '@/components/dashboard/StatCard'
import TransactionHistory from '@/components/dashboard/TransactionHistory'
import BiodataDialog from '@/components/dashboard/BiodataDialog'
import { motion } from 'framer-motion'

// Custom theme untuk konsistensi dengan laporan
const createCustomTheme = (isDark) => createTheme({
  typography: { fontFamily: '"Poppins", sans-serif' },
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: isDark ? '#64b5f6' : '#1976d2',
      light: isDark ? '#90caf9' : '#42a5f5',
      dark: isDark ? '#1976d2' : '#0d47a1',
    },
    secondary: {
      main: isDark ? '#f48fb1' : '#dc004e',
    },
    background: {
      default: isDark ? '#0a0a0a' : '#f5f5f5',
      paper: isDark ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDark ? '#ffffff' : '#000000',
      secondary: isDark ? '#b0b0b0' : '#666666',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: isDark 
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
        }
      }
    }
  }
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Dashboard() {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  
  const [openBiodata, setOpenBiodata] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalSaldo, setTotalSaldo] = useState(0)
  const [totalPemasukan, setTotalPemasukan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' })

  const customTheme = createCustomTheme(isDarkMode)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch laporan data with better error handling
        try {
          const laporanData = await laporanService.getAllLaporan()
          if (laporanData?.length) {
            const lastReport = laporanData[0]
            setTotalSaldo(lastReport.total_saldo || 0)
            setTotalPemasukan(laporanData.reduce((sum, i) => sum + (i.pemasukan || 0), 0))
            setTotalPengeluaran(laporanData.reduce((sum, i) => sum + (i.pengeluaran || 0), 0))
          } else {
            // Set defaults when no data
            setTotalSaldo(0)
            setTotalPemasukan(0)
            setTotalPengeluaran(0)
          }
        } catch (laporanError) {
          console.error('Error fetching laporan:', laporanError)
          setTotalSaldo(0)
          setTotalPemasukan(0)
          setTotalPengeluaran(0)
          
          if (!laporanError.message.includes("can't access property")) {
            showSnackbar('Gagal memuat data laporan keuangan', 'warning')
          }
        }

        // Fetch transaction data with better error handling
        try {
          const transaksiData = await transaksiService.getLastTransaksi()
          if (Array.isArray(transaksiData) && transaksiData.length > 0) {
            setTransactions(transaksiData)
            setFilteredTransactions(transaksiData)
          } else {
            setTransactions([])
            setFilteredTransactions([])
          }
        } catch (transaksiError) {
          console.error('Error fetching transactions:', transaksiError)
          setTransactions([])
          setFilteredTransactions([])
          
          if (!transaksiError.message.includes("can't access property")) {
            showSnackbar('Gagal memuat histori transaksi', 'warning')
          }
        }
        
      } catch (err) {
        console.error('General error in fetchData:', err)
        
        let errorMessage = 'Terjadi kesalahan saat memuat data dashboard'
        if (err.message.includes('Network Error') || err.message.includes('fetch')) {
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        } else if (err.message.includes("can't access property")) {
          errorMessage = 'Belum ada data yang tersimpan di sistem.'
        }
        
        showSnackbar(errorMessage, 'info')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter(item =>
        item.keterangan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jenis_transaksi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tanggal?.includes(searchQuery)
      )
    )
  }, [searchQuery, transactions])

  const formatCurrency = amount =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity })
  const handleCloseSnackbar = (_, reason) => reason !== 'clickaway' && setSnackbar(s => ({ ...s, open: false }))

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at 25% 25%, rgba(100, 181, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(244, 143, 177, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 25% 25%, rgba(25, 118, 210, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(220, 0, 78, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative',
            zIndex: 1,
            py: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Page Title */}
              <Box 
                sx={{ 
                  p: 3,
                  borderRadius: '20px',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.4) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: isDarkMode 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    background: isDarkMode 
                      ? 'linear-gradient(45deg, #64b5f6, #90caf9, #42a5f5)'
                      : 'linear-gradient(45deg, #1976d2, #42a5f5, #1e88e5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    fontSize: { xs: '1.8rem', sm: '2.5rem' },
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                  }}
                >
                  Dashboard Bendahara
                </Typography>
              </Box>

              {/* Snackbar */}
              <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbar.severity}
                  sx={{
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: isDarkMode 
                      ? '0 8px 32px rgba(0,0,0,0.4)' 
                      : '0 8px 32px rgba(0,0,0,0.1)',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                    background: isDarkMode 
                      ? 'rgba(30, 30, 30, 0.9)' 
                      : 'rgba(255, 255, 255, 0.9)',
                  }}
                  action={
                    <IconButton size="small" onClick={handleCloseSnackbar}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>

              {loading ? (
                <Box 
                  display="flex" 
                  flexDirection="column"
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight="400px"
                  sx={{
                    borderRadius: '20px',
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(60, 60, 60, 0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 249, 250, 0.3) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: isDarkMode 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Box 
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: isDarkMode 
                        ? 'conic-gradient(from 0deg, #64b5f6, #90caf9, #42a5f5, #64b5f6)'
                        : 'conic-gradient(from 0deg, #1976d2, #42a5f5, #2196f3, #1976d2)',
                      animation: 'spin 2s linear infinite',
                      mb: 2,
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: isDarkMode ? '#90caf9' : '#1976d2',
                      fontWeight: 600,
                    }}
                  >
                    Memuat dashboard...
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Welcome Card */}
                  <motion.div variants={cardVariants}>
                    <WelcomeCard
                      totalSaldo={formatCurrency(totalSaldo)}
                      onOpenBiodata={() => setOpenBiodata(true)}
                    />
                  </motion.div>

                  {/* Stat Cards */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 24,
                      flexWrap: 'wrap',
                      width: '100%',
                    }}
                  >
                    <motion.div variants={cardVariants} style={{ flex: 1, minWidth: '280px' }}>
                      <StatCard
                        variant="green"
                        icon={<TrendingUpIcon sx={{ fontSize: '120px' }} />}
                        title="Total Pemasukan Organisasi"
                        value={formatCurrency(totalPemasukan)}
                      />
                    </motion.div>

                    <motion.div variants={cardVariants} style={{ flex: 1, minWidth: '280px' }}>
                      <StatCard
                        variant="red"
                        icon={<TrendingDownIcon sx={{ fontSize: '120px' }} />}
                        title="Total Pengeluaran Organisasi"
                        value={formatCurrency(totalPengeluaran)}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Transaction History */}
                  <motion.div variants={cardVariants}>
                    <TransactionHistory
                      transactions={filteredTransactions}
                      loading={loading}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      formatCurrency={formatCurrency}
                      emptyIcon={<AccountBalanceIcon style={{ fontSize: 48, color: '#ccc' }} />}
                    />
                  </motion.div>
                </>
              )}

              {/* Biodata Dialog */}
              <BiodataDialog open={openBiodata} onClose={() => setOpenBiodata(false)} />
            </Box>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
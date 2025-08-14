'use client'

import { Box, ThemeProvider, createTheme, Snackbar, Alert, IconButton, CircularProgress, Typography } from '@mui/material'
import Slide from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { useState, useEffect } from 'react'
import { laporanService } from '@/services/laporanService'
import { transaksiService } from '@/services/transaksiService'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import StatCard from '@/components/dashboard/StatCard'
import TransactionHistory from '@/components/dashboard/TransactionHistory'
import BiodataDialog from '@/components/dashboard/BiodataDialog'

const theme = createTheme({
  typography: { fontFamily: '"Poppins", sans-serif' },
})

export default function Dashboard() {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const laporanData = await laporanService.getAllLaporan()
        if (laporanData?.length) {
          const lastReport = laporanData[0]
          setTotalSaldo(lastReport.total_saldo || 0)
          setTotalPemasukan(laporanData.reduce((sum, i) => sum + (i.pemasukan || 0), 0))
          setTotalPengeluaran(laporanData.reduce((sum, i) => sum + (i.pengeluaran || 0), 0))
        } else {
          showSnackbar('Data laporan keuangan tidak tersedia', 'warning')
        }

        const transaksiData = await transaksiService.getLastTransaksi()
        if (Array.isArray(transaksiData)) {
          setTransactions(transaksiData)
          setFilteredTransactions(transaksiData)
        } else {
          showSnackbar('Format data transaksi tidak valid', 'error')
        }
      } catch (err) {
        showSnackbar('Gagal mengambil data', 'error')
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
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, padding: { xs: '16px', sm: '24px', md: '32px' } }}>
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
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontWeight: 500,
              bgcolor:
                snackbar.severity === 'error'
                  ? '#ffebee'
                  : snackbar.severity === 'warning'
                  ? '#fff3e0'
                  : '#e8f5e9',
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

        {/* Cards */}
        <WelcomeCard
          totalSaldo={loading ? 'Memuat...' : formatCurrency(totalSaldo)}
          onOpenBiodata={() => setOpenBiodata(true)}
        />

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <StatCard
            variant="green"
            icon={<TrendingUpIcon sx={{ fontSize: '120px' }} />}
            title="Total Pemasukan Organisasi"
            value={loading ? 'Memuat...' : formatCurrency(totalPemasukan)}
          />
          <StatCard
            variant="red"
            icon={<TrendingDownIcon sx={{ fontSize: '120px' }} />}
            title="Total Pengeluaran Organisasi"
            value={loading ? 'Memuat...' : formatCurrency(totalPengeluaran)}
          />
        </Box>

        {/* Transaction History */}
        <TransactionHistory
          transactions={filteredTransactions}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          formatCurrency={formatCurrency}
          emptyIcon={<AccountBalanceIcon style={{ fontSize: 48, color: '#ccc' }} />}
        />

        {/* Biodata Dialog */}
        <BiodataDialog open={openBiodata} onClose={() => setOpenBiodata(false)} />
      </Box>
    </ThemeProvider>
  )
}
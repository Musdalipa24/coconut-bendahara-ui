'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Snackbar,
  Slide,
  Alert,
  IconButton,
  Container,
  Typography,
  ThemeProvider,
  createTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  PengeluaranHeader,
  PengeluaranTable,
  PengeluaranFormDialog,
  DeleteConfirmationDialog,
  NotaPreviewDialog
} from '@/components/pengeluaran'
import { pengeluaranService, UPLOAD_URL } from '@/services/pengeluaranService'
import { laporanService } from '@/services/laporanService'
import { useSoftUIController } from '@/context'

// Custom theme untuk konsistensi
const createCustomTheme = (isDark) => createTheme({
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

export default function Pengeluaran() {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  
  const customTheme = createCustomTheme(isDarkMode)
  
  // State management
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    nominal: '',
    keterangan: '',
    nota: null
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState('')
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [isLoadingTotal, setIsLoadingTotal] = useState(true)
  const [currentSaldo, setCurrentSaldo] = useState(0)
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null
  })
  const [notaDialog, setNotaDialog] = useState({
    open: false,
    imageUrl: ''
  })
  const [timeRange, setTimeRange] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Constants
  const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8087/uploads/'
  const timeRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '1month', label: '1 Bulan Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun Terakhir' },
    { value: 'all', label: 'Semua' }
  ]

  // Helper functions
  const formatDate = (date) => {
    if (!date) return null
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getDateRange = (range) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    switch (range) {
      case 'today':
        return { start: formatDate(today), end: formatDate(today.setHours(24, 0, 0, 0)) }
      case 'yesterday':
        startDate.setDate(today.getDate() - 1)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '7days':
        startDate.setDate(today.getDate() - 7)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '1month':
        startDate.setMonth(today.getMonth() - 1)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '3months':
        startDate.setMonth(today.getMonth() - 3)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '6months':
        startDate.setMonth(today.getMonth() - 6)
        return { start: formatDate(startDate), end: formatDate(today) }
      case '1year':
        startDate.setFullYear(today.getFullYear() - 1)
        return { start: formatDate(startDate), end: formatDate(today) }
      case 'all':
      default:
        return { start: null, end: null }
    }
  }

  const formatCurrency = (amount) => {
    const validAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(validAmount)
  }

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-'
    try {
      const [datePart, timePart] = backendDateString.split(' ')
      const [day, month, year] = datePart.split('-')
      const [hours, minutes] = timePart.split(':')
      return new Date(year, month - 1, day, hours, minutes).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      console.error('Error formatting date:', e)
      return backendDateString
    }
  }

  // Data fetching
  const fetchData = async () => {
    try {
      setLoading(true)
      const { start, end } = getDateRange(timeRange)
      let response
      if (!start || !end) {
        response = await pengeluaranService.getAllPengeluaran(page + 1, rowsPerPage)
        console.log("Getall pengeluaran", response)
      } else {
        response = await pengeluaranService.getPengeluaranByDateRange(start, end, page + 1, rowsPerPage)
      }
      
      // Handle response validation
      if (!response || !response.data) {
        console.warn('Response data tidak valid:', response)
        setRows([])
        setTotalItems(0)
        setTotalPages(0)
        return
      }

      // Handle empty data or null items
      if (!response.data.items || !Array.isArray(response.data.items)) {
        console.log('Data pengeluaran kosong atau format tidak valid')
        setRows([])
        setTotalItems(response.data.total_items || 0)
        setTotalPages(response.data.total_pages || 0)
        return
      }

      // Process data if available
      const pengeluaranData = response.data.items.map(item => ({
        id: item.id_pengeluaran,
        tanggal: item.tanggal,
        nominal: item.nominal,
        keterangan: item.keterangan,
        nota: item.nota
      }))
      
      setRows(pengeluaranData)
      setTotalItems(response.data.total_items || 0)
      setTotalPages(response.data.total_pages || 0)
      
    } catch (error) {
      console.error('Error fetching data:', error)
      
      // Provide more user-friendly error messages
      let errorMessage = 'Terjadi kesalahan saat mengambil data pengeluaran'
      
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else if (error.message.includes('404')) {
        errorMessage = 'Data pengeluaran tidak ditemukan.'
      } else if (error.message.includes('500')) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      } else if (error.message.includes("can't access property")) {
        errorMessage = 'Belum ada data pengeluaran yang tersimpan.'
      }
      
      showSnackbar(errorMessage, 'info')
      setRows([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, timeRange])

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        setIsLoadingTotal(true)
        const { start, end } = getDateRange(timeRange)
        let total
        if (!start || !end) {
          total = await laporanService.getTotalPengeluaran()
        } else {
          total = await laporanService.getTotalPengeluaranByDateRange(start, end)
        }
        setTotalPengeluaran(Number.isFinite(total) ? total : 0)
      } catch (error) {
        console.error('Gagal mengambil total pengeluaran:', error)
        setTotalPengeluaran(0)
        // Don't show snackbar for total fetch errors when data is empty
        // This prevents double error messages
        if (!error.message.includes("can't access property") && !error.message.includes('null')) {
          showSnackbar('Gagal memuat total pengeluaran', 'warning')
        }
      } finally {
        setIsLoadingTotal(false)
      }
    }
    fetchTotal()
  }, [timeRange])

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const saldo = await laporanService.getSaldo()
        setCurrentSaldo(Number.isFinite(saldo) ? saldo : 0)
      } catch (error) {
        console.error('Error fetching saldo:', error)
        setCurrentSaldo(0)
      }
    }
    fetchSaldo()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'nota') {
      const file = files[0]
      if (file && file.size > 5 * 1024 * 1024) {
        showSnackbar('Ukuran file terlalu besar (maksimal 5MB)', 'error')
        return
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      if (file) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl('')
      }
    } else if (name === 'nominal') {
      const numericValue = value.replace(/\D/g, '')
      if (numericValue.length > 11) {
        showSnackbar('Nominal terlalu besar (maksimal puluhan milyar)', 'error')
        return
      }
      // Simpan nilai terlebih dahulu, validasi minimal akan dilakukan saat save
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleNominalBlur = () => {
    if (formData.nominal && parseInt(formData.nominal) < 1000) {
      showSnackbar('Nominal minimal adalah Rp. 1.000', 'warning')
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      tanggal: '',
      nominal: '',
      keterangan: '',
      nota: null
    })
    setPreviewUrl('')
    setShowModal(true)
  }

  const handleEdit = (row) => {
    try {
      let localDateTime = ''
      if (row.tanggal) {
        // Handle different date formats
        if (row.tanggal.includes('T')) {
          // Already in ISO format
          localDateTime = row.tanggal.slice(0, 16)
        } else if (row.tanggal.includes(' ')) {
          // Format: DD-MM-YYYY HH:mm
          const [datePart, timePart] = row.tanggal.split(' ')
          const [day, month, year] = datePart.split('-')
          localDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`
        } else {
          // Just date
          const date = new Date(row.tanggal)
          if (!isNaN(date.getTime())) {
            localDateTime = date.toISOString().slice(0, 16)
          }
        }
      }

      setEditingId(row.id)
      setFormData({
        tanggal: localDateTime,
        nominal: row.nominal.toString(),
        keterangan: row.keterangan,
        nota: null // URL or null
      })
      if (row.nota) {
        setPreviewUrl(`${UPLOAD_URL}${row.nota}`)
      } else {
        setPreviewUrl('')
      }
      setShowModal(true)
    } catch (error) {
      console.error('Error handling edit:', error)
      showSnackbar('Gagal memuat data untuk edit', 'error')
    }
  }

  const handleDelete = (id) => {
    if (!id) {
      showSnackbar('Data tidak valid untuk dihapus', 'error')
      return
    }
    setDeleteDialog({ open: true, id })
  }

  const confirmDelete = async () => {
    const { id } = deleteDialog
    try {
      setLoading(true)
      await pengeluaranService.deletePengeluaran(id)
      
      // Refresh data with error handling
      if (rows.length === 1 && page > 0) {
        setPage(page - 1)
      } else {
        try {
          await fetchData()
        } catch (refreshError) {
          console.error('Error refreshing data after delete:', refreshError)
          // Reset to empty state if refresh fails
          setRows([])
          setTotalItems(0)
          setTotalPages(0)
        }
      }
      
      // Update total with error handling
      try {
        const { start, end } = getDateRange(timeRange)
        const total = !start || !end
          ? await laporanService.getTotalPengeluaran()
          : await laporanService.getTotalPengeluaranByDateRange(start, end)
        setTotalPengeluaran(Number.isFinite(total) ? total : 0)
      } catch (totalError) {
        console.error('Error updating total after delete:', totalError)
        setTotalPengeluaran(0)
      }
      
      showSnackbar(`Pengeluaran berhasil dihapus`, 'success')
    } catch (error) {
      console.error('Error deleting data:', error)
      
      let errorMessage = 'Gagal menghapus pengeluaran'
      if (error.message.includes('Network Error')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else if (error.message.includes('404')) {
        errorMessage = 'Data yang akan dihapus tidak ditemukan.'
      } else if (error.message.includes('500')) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      }
      
      showSnackbar(errorMessage, 'error')
    } finally {
      setLoading(false)
      setDeleteDialog({ open: false, id: null })
    }
  }

  const handleShowNota = (notaPath) => {
    if (notaPath) {
      // Try different URL constructions
      const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8087/uploads/'
      let fullImageUrl
      
      // Remove leading slash if exists in notaPath to avoid double slashes
      const cleanPath = notaPath.startsWith('/') ? notaPath.slice(1) : notaPath
      
      // Ensure base URL ends with slash
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
      
      fullImageUrl = `${cleanBaseUrl}${cleanPath}`
      
      console.log('UPLOAD_URL:', baseUrl)
      console.log('notaPath (original):', notaPath)
      console.log('notaPath (cleaned):', cleanPath)
      console.log('Final URL:', fullImageUrl)
      
      setNotaDialog({
        open: true,
        imageUrl: fullImageUrl
      })
    } else {
      showSnackbar('Nota tidak tersedia', 'warning')
    }
  }

  const handleCloseNotaDialog = () => {
    setNotaDialog({
      open: false,
      imageUrl: ''
    })
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (!formData.tanggal) throw new Error('Tanggal harus diisi')
      if (!formData.nominal) throw new Error('Nominal harus diisi')
      
      // Validasi nominal minimal Rp. 1.000
      const nominalValue = parseInt(formData.nominal)
      if (nominalValue < 1000) {
        throw new Error('Nominal minimal adalah Rp. 1.000')
      }
      
      // Validasi saldo mencukupi (hanya untuk pengeluaran baru, bukan edit)
      if (!editingId && currentSaldo > 0 && nominalValue > currentSaldo) {
        const shortfall = nominalValue - currentSaldo
        throw new Error(`Saldo tidak mencukupi. Saldo saat ini: ${formatCurrency(currentSaldo)}, diperlukan: ${formatCurrency(nominalValue)}. Kekurangan: ${formatCurrency(shortfall)}`)
      }
      
      if (!formData.keterangan) throw new Error('Keterangan harus diisi')
      if (!editingId && !formData.nota) throw new Error('Nota harus diupload')

      const dateObj = new Date(formData.tanggal)
      if (isNaN(dateObj.getTime())) throw new Error('Format tanggal tidak valid')

      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const year = dateObj.getFullYear()
      const hours = String(dateObj.getHours()).padStart(2, '0')
      const minutes = String(dateObj.getMinutes()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`

      const dataToSend = {
        tanggal: formattedDate,
        nominal: parseFloat(formData.nominal),
        keterangan: formData.keterangan.trim(),
        nota: formData.nota
      }

      let result
      if (editingId) {
        const { nota, ...updateData } = dataToSend
        result = await pengeluaranService.updatePengeluaran(editingId, formData.nota ? dataToSend : updateData)
      } else {
        result = await pengeluaranService.addPengeluaran(dataToSend)
      }

      showSnackbar(result.message, 'success')
      setShowModal(false)
      
      // Refresh data with error handling
      try {
        await fetchData()
        const { start, end } = getDateRange(timeRange)
        const total = !start || !end
          ? await laporanService.getTotalPengeluaran()
          : await laporanService.getTotalPengeluaranByDateRange(start, end)
        setTotalPengeluaran(Number.isFinite(total) ? total : 0)
      } catch (refreshError) {
        console.error('Error refreshing data after save:', refreshError)
        // Don't show error to user as the save was successful
      }
    } catch (error) {
      console.error('Error saving data:', error)
      
      // Handle specific error cases with user-friendly Indonesian messages
      let errorMessage = 'Gagal menyimpan data pengeluaran'
      
      if (error.message && error.message.includes('insufficient saldo')) {
        // Parse the insufficient saldo error message
        const match = error.message.match(/insufficient saldo: (\d+), required: (\d+)/)
        if (match) {
          const currentSaldo = parseInt(match[1])
          const requiredAmount = parseInt(match[2])
          const shortfall = requiredAmount - currentSaldo
          
          errorMessage = `Saldo tidak mencukupi. Saldo saat ini: ${formatCurrency(currentSaldo)}, diperlukan: ${formatCurrency(requiredAmount)}. Kekurangan: ${formatCurrency(shortfall)}`
        } else {
          errorMessage = 'Saldo tidak mencukupi untuk melakukan pengeluaran ini'
        }
      } else if (error.message && error.message.includes('Network Error')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else if (error.message && error.message.includes('500')) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      } else if (error.message && error.message.includes('400')) {
        errorMessage = 'Data yang dimasukkan tidak valid. Periksa kembali form Anda.'
      } else if (error.message) {
        // Use the error message from API if available
        errorMessage = error.message
      }
      
      showSnackbar(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Page Title */}
            <Box 
              sx={{ 
                p: 3,
                mb: 4,
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
                Pengeluaran Organisasi
              </Typography>
            </Box>

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
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleCloseSnackbar}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                {snackbar.message}
              </Alert>
            </Snackbar>

            <PengeluaranHeader
              totalPengeluaran={totalPengeluaran}
              isLoadingTotal={isLoadingTotal}
              handleAdd={handleAdd}
              formatCurrency={formatCurrency}
            />

            <PengeluaranTable
          rows={rows}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleShowNota={handleShowNota}
          formatDateTime={formatDateTime}
          formatCurrency={formatCurrency}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          timeRangeOptions={timeRangeOptions}
        />

            <PengeluaranFormDialog
              showModal={showModal}
              setShowModal={setShowModal}
              editingId={editingId}
              formData={formData}
              handleInputChange={handleInputChange}
              handleNominalBlur={handleNominalBlur}
              handleSave={handleSave}
              loading={loading}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />

            <DeleteConfirmationDialog
              deleteDialog={deleteDialog}
              setDeleteDialog={setDeleteDialog}
              confirmDelete={confirmDelete}
              loading={loading}
            />

            <NotaPreviewDialog
              notaDialog={notaDialog}
              handleCloseNotaDialog={handleCloseNotaDialog}
              showSnackbar={showSnackbar}
            />
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
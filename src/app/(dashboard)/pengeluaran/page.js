'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Snackbar,
  Slide,
  Alert,
  IconButton
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

export default function Pengeluaran() {
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-'
    try {
      const [datePart, timePart] = dateTimeString.split(' ')
      const [day, month, year] = datePart.split('-')
      const [hours, minutes] = timePart.split(':')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch (e) {
      console.error('Error formatting date:', e)
      return dateTimeString
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
      const pengeluaranData = response.data.items.map(item => ({
        id: item.id_pengeluaran,
        tanggal: item.tanggal,
        nominal: item.nominal,
        keterangan: item.keterangan,
        nota: item.nota
      }))
      setRows(pengeluaranData)
      setTotalItems(response.data.total_items)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error('Error fetching data:', error)
      showSnackbar('Gagal mengambil data: ' + error.message, 'error')
      setRows([])
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
        showSnackbar('Gagal memuat total pengeluaran', 'error')
      } finally {
        setIsLoadingTotal(false)
      }
    }
    fetchTotal()
  }, [timeRange])

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
    const [datePart, timePart] = row.tanggal.split(' ')
    const [day, month, year] = datePart.split('-')
    const localDateTime = `${year}-${month}-${day}T${timePart}`
    
    setEditingId(row.id)
    setFormData({
      tanggal: localDateTime,
      nominal: row.nominal.toString(),
      keterangan: row.keterangan,
      nota: null
    })
    if (row.nota) {
      setPreviewUrl(`${UPLOAD_URL}${row.nota}`)
    } else {
      setPreviewUrl('')
    }
    setShowModal(true)
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
      if (rows.length === 1 && page > 0) {
        setPage(page - 1)
      } else {
        await fetchData()
      }
      const { start, end } = getDateRange(timeRange)
      const total = !start || !end
        ? await laporanService.getTotalPengeluaran()
        : await laporanService.getTotalPengeluaranByDateRange(start, end)
      setTotalPengeluaran(Number.isFinite(total) ? total : 0)
      showSnackbar(`Pengeluaran berhasil dihapus`, 'success')
    } catch (error) {
      console.error('Error deleting data:', error)
      showSnackbar(`Gagal menghapus pengeluaran: ${error.message}`, 'error')
    } finally {
      setLoading(false)
      setDeleteDialog({ open: false, id: null })
    }
  }

  const handleShowNota = (notaPath) => {
    if (notaPath) {
      setNotaDialog({
        open: true,
        imageUrl: `${UPLOAD_URL}${notaPath}`
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
      await fetchData()
      const { start, end } = getDateRange(timeRange)
      const total = !start || !end
        ? await laporanService.getTotalPengeluaran()
        : await laporanService.getTotalPengeluaranByDateRange(start, end)
      setTotalPengeluaran(Number.isFinite(total) ? total : 0)
    } catch (error) {
      console.error('Error saving data:', error)
      showSnackbar(error.message || 'Gagal menyimpan data', 'error')
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
    <Box sx={{
      padding: '24px',
      mt: { xs: '64px', sm: '80px' }
    }}>
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
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            fontWeight: 500
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
    </Box>
  )
}
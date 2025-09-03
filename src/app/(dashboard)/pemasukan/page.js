'use client'

import { useState, useEffect, useCallback } from 'react'
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
  PemasukanHeader,
  PemasukanTable,
  PemasukanFormDialog,
  DeleteConfirmationDialog,
  NotaPreviewDialog
} from '@/components/pemasukan'
import { pemasukanService } from '@/services/pemasukanService'
import { laporanService } from '@/services/laporanService'
import { useSoftUIController } from '@/context'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function Pemasukan() {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  
  // State management
  const customTheme = createCustomTheme(isDarkMode)
  
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: '',
    nominal: '',
    keterangan: '',
    kategori: '',
    kategoriKustom: '',
    nota: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [isLoadingTotal, setIsLoadingTotal] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null
  });
  const [timeRange, setTimeRange] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [notaDialog, setNotaDialog] = useState({
    open: false,
    imageUrl: ''
  });

  // Constants
  const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8087/uploads/';
  const timeRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: '7days', label: '7 Hari Terakhir' },
    { value: '1month', label: '1 Bulan Terakhir' },
    { value: '3months', label: '3 Bulan Terakhir' },
    { value: '6months', label: '6 Bulan Terakhir' },
    { value: '1year', label: '1 Tahun Terakhir' },
    { value: 'all', label: 'Semua' }
  ];

  // Helper functions
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateRange = useCallback((range) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (range) {
      case 'today':
        return { start: formatDate(today), end: formatDate(today.setHours(24, 0, 0, 0)) };
      case 'yesterday':
        startDate.setDate(today.getDate() - 1);
        return { start: formatDate(startDate), end: formatDate(today) };
      case '7days':
        startDate.setDate(today.getDate() - 7);
        return { start: formatDate(startDate), end: formatDate(today) };
      case '1month':
        startDate.setMonth(today.getMonth() - 1);
        return { start: formatDate(startDate), end: formatDate(today) };
      case '3months':
        startDate.setMonth(today.getMonth() - 3);
        return { start: formatDate(startDate), end: formatDate(today) };
      case '6months':
        startDate.setMonth(today.getMonth() - 6);
        return { start: formatDate(startDate), end: formatDate(today) };
      case '1year':
        startDate.setFullYear(today.getFullYear() - 1);
        return { start: formatDate(startDate), end: formatDate(today) };
      case 'all':
      default:
        return { start: null, end: null };
    }
  }, []); // Empty dependency array karena tidak bergantung pada state/props

  const formatCurrency = (amount) => {
    const validAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(validAmount);
  };

  const formatDateTime = (backendDateString) => {
    if (!backendDateString) return '-';
    try {
      const [datePart, timePart] = backendDateString.split(' ');
      const [day, month, year] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      return new Date(year, month - 1, day, hours, minutes).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return backendDateString;
    }
  };

  // Data fetching
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange(timeRange);
      let response;
      if (!start || !end) {
        response = await pemasukanService.getAllPemasukan(page + 1, rowsPerPage);
      } else {
        response = await pemasukanService.getPemasukanByDateRange(start, end, page + 1, rowsPerPage);
      }
      
      // Handle response validation
      if (!response || !response.data) {
        console.warn('Response data tidak valid:', response);
        setRows([]);
        setTotalItems(0);
        setTotalPages(0);
        return;
      }

      // Handle empty data or null items
      if (!response.data.items || !Array.isArray(response.data.items)) {
        console.log('Data pemasukan kosong atau format tidak valid');
        setRows([]);
        setTotalItems(response.data.total_items || 0);
        setTotalPages(response.data.total_pages || 0);
        return;
      }

      // Process data if available
      const pemasukanData = response.data.items.map(item => ({
        id: item.id_pemasukan,
        tanggal: item.tanggal,
        nominal: item.nominal,
        keterangan: item.keterangan,
        kategori: item.kategori,
        nota: item.nota
      }));
      
      setRows(pemasukanData);
      setTotalItems(response.data.total_items || 0);
      setTotalPages(response.data.total_pages || 0);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Terjadi kesalahan saat mengambil data pemasukan';
      
      if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Data pemasukan tidak ditemukan.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
      } else if (error.message.includes("can't access property")) {
        errorMessage = 'Belum ada data pemasukan yang tersimpan.';
      }
      
      showSnackbar(errorMessage, 'info');
      setRows([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, timeRange, getDateRange]); // Dependencies yang diperlukan

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, timeRange]);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        setIsLoadingTotal(true);
        const { start, end } = getDateRange(timeRange);
        let total;
        if (!start || !end) {
          total = await laporanService.getTotalPemasukan();
        } else {
          total = await laporanService.getTotalPemasukanByDateRange(start, end);
        }
        setTotalPemasukan(Number.isFinite(total) ? total : 0);
      } catch (error) {
        console.error('Gagal mengambil total pemasukan:', error);
        setTotalPemasukan(0);
        // Don't show snackbar for total fetch errors when data is empty
        // This prevents double error messages
        if (!error.message.includes("can't access property") && !error.message.includes('null')) {
          showSnackbar('Gagal memuat total pemasukan', 'warning');
        }
      } finally {
        setIsLoadingTotal(false);
      }
    };
    fetchTotal();
  }, [timeRange]); // Hapus getDateRange karena sudah di-memoize dengan useCallback

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nominal') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 11) {
        showSnackbar('Nominal terlalu besar (maksimal puluhan milyar)', 'error');
        return;
      }
      // Simpan nilai terlebih dahulu, validasi minimal akan dilakukan saat save
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNominalBlur = () => {
    if (formData.nominal && parseInt(formData.nominal) < 1000) {
      showSnackbar('Nominal minimal adalah Rp. 1.000', 'warning');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      tanggal: '',
      nominal: '',
      keterangan: '',
      kategori: '',
      kategoriKustom: '',
      nota: null
    });
    setShowModal(true);
  };

  const handleEdit = (row) => {
    try {
      let localDateTime = '';
      if (row.tanggal) {
        // Handle different date formats
        if (row.tanggal.includes('T')) {
          // Already in ISO format
          localDateTime = row.tanggal.slice(0, 16);
        } else if (row.tanggal.includes(' ')) {
          // Format: DD-MM-YYYY HH:mm
          const [datePart, timePart] = row.tanggal.split(' ');
          const [day, month, year] = datePart.split('-');
          localDateTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
        } else {
          // Just date
          const date = new Date(row.tanggal);
          if (!isNaN(date.getTime())) {
            localDateTime = date.toISOString().slice(0, 16);
          }
        }
      }
      
      setEditingId(row.id);
      setFormData({
        tanggal: localDateTime,
        nominal: row.nominal.toString(),
        keterangan: row.keterangan,
        kategori: ['Iuran', 'Sumbangan', 'Dana Organisasi'].includes(row.kategori) ? row.kategori : 'Lainnya',
        kategoriKustom: ['Iuran', 'Sumbangan', 'Dana Organisasi'].includes(row.kategori) ? '' : row.kategori,
        nota: row.nota // URL or null
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error handling edit:', error);
      showSnackbar('Gagal memuat data untuk edit', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showSnackbar('Data tidak valid untuk dihapus', 'error');
      return;
    }
    setDeleteDialog({ open: true, id });
  };

  const confirmDelete = async () => {
    const { id } = deleteDialog;
    try {
      setLoading(true);
      await pemasukanService.deletePemasukan(id);
      
      // Refresh data with error handling
      if (rows.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        try {
          await fetchData();
        } catch (refreshError) {
          console.error('Error refreshing data after delete:', refreshError);
          // Reset to empty state if refresh fails
          setRows([]);
          setTotalItems(0);
          setTotalPages(0);
        }
      }
      
      // Update total with error handling
      try {
        const { start, end } = getDateRange(timeRange);
        const total = !start || !end
          ? await laporanService.getTotalPemasukan()
          : await laporanService.getTotalPemasukanByDateRange(start, end);
        setTotalPemasukan(Number.isFinite(total) ? total : 0);
      } catch (totalError) {
        console.error('Error updating total after delete:', totalError);
        setTotalPemasukan(0);
      }
      
      showSnackbar('Pemasukan berhasil dihapus', 'success');
    } catch (error) {
      console.error('Error deleting data:', error);
      
      let errorMessage = 'Gagal menghapus pemasukan';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Data yang akan dihapus tidak ditemukan.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!formData.tanggal) throw new Error('Tanggal harus diisi');
      if (!formData.nominal) throw new Error('Nominal harus diisi');
      
      // Validasi nominal minimal Rp. 1.000
      const nominalValue = parseInt(formData.nominal);
      if (nominalValue < 1000) {
        throw new Error('Nominal minimal adalah Rp. 1.000');
      }
      
      if (!formData.kategori) throw new Error('Kategori harus diisi');
      if (formData.kategori === 'Lainnya' && !formData.kategoriKustom) {
        throw new Error('Kategori kustom harus diisi');
      }

      const dateObj = new Date(formData.tanggal);
      if (isNaN(dateObj.getTime())) throw new Error('Format tanggal tidak valid');

      const dataToSend = {
        tanggal: formData.tanggal,
        nominal: formData.nominal,
        kategori: formData.kategori === 'Lainnya' ? formData.kategoriKustom : formData.kategori,
        keterangan: formData.keterangan,
        nota: formData.nota
      };

      let result;
      if (editingId) {
        result = await pemasukanService.updatePemasukan(editingId, dataToSend);
      } else {
        result = await pemasukanService.addPemasukan(dataToSend);
      }
      showSnackbar(result.message, 'success');
      setShowModal(false);
      
      // Refresh data with error handling
      try {
        await fetchData();
        const { start, end } = getDateRange(timeRange);
        const total = !start || !end
          ? await laporanService.getTotalPemasukan()
          : await laporanService.getTotalPemasukanByDateRange(start, end);
        setTotalPemasukan(Number.isFinite(total) ? total : 0);
      } catch (refreshError) {
        console.error('Error refreshing data after save:', refreshError);
        // Don't show error to user as the save was successful
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showSnackbar(error.message || 'Gagal menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleShowNota = (notaPath) => {
    if (notaPath) {
      // Try different URL constructions
      const baseUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8087/uploads/';
      let fullImageUrl;
      
      // Remove leading slash if exists in notaPath to avoid double slashes
      const cleanPath = notaPath.startsWith('/') ? notaPath.slice(1) : notaPath;
      
      // Ensure base URL ends with slash
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      
      fullImageUrl = `${cleanBaseUrl}${cleanPath}`;
      
      console.log('UPLOAD_URL:', baseUrl);
      console.log('notaPath (original):', notaPath);
      console.log('notaPath (cleaned):', cleanPath);
      console.log('Final URL:', fullImageUrl);
      
      setNotaDialog({
        open: true,
        imageUrl: fullImageUrl
      });
    } else {
      showSnackbar('Nota tidak tersedia', 'warning');
    }
  };

  const handleCloseNotaDialog = () => {
    setNotaDialog({
      open: false,
      imageUrl: ''
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              Pemasukan Organisasi
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

          {/* Animasi untuk Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PemasukanHeader
              totalPemasukan={totalPemasukan}
              isLoadingTotal={isLoadingTotal}
              handleAdd={handleAdd}
              formatCurrency={formatCurrency}
            />
          </motion.div>

          {/* Animasi untuk Table */}
          <motion.div
            key={timeRange} // supaya animasi jalan saat filter berubah
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            <PemasukanTable
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
          </motion.div>

          {/* Animasi untuk Form Dialog */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                key="formDialog"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PemasukanFormDialog
                  showModal={showModal}
                  setShowModal={setShowModal}
                  editingId={editingId}
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  handleNominalBlur={handleNominalBlur}
                  handleSave={handleSave}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animasi untuk Delete Confirmation */}
          <AnimatePresence>
            {deleteDialog.open && (
              <motion.div
                key="deleteDialog"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <DeleteConfirmationDialog
                  deleteDialog={deleteDialog}
                  setDeleteDialog={setDeleteDialog}
                  confirmDelete={confirmDelete}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nota Preview Dialog */}
          <NotaPreviewDialog
            notaDialog={notaDialog}
            handleCloseNotaDialog={handleCloseNotaDialog}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
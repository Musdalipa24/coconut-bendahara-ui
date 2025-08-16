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
  PemasukanHeader,
  PemasukanTable,
  PemasukanFormDialog,
  DeleteConfirmationDialog
} from '@/components/pemasukan'
import { pemasukanService } from '@/services/pemasukanService'
import { laporanService } from '@/services/laporanService'

export default function Pemasukan() {
  // State management
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
  }, [formatDate]);

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
      const pemasukanData = response.data.items.map(item => ({
        id: item.id_pemasukan,
        tanggal: item.tanggal,
        nominal: item.nominal,
        keterangan: item.keterangan,
        kategori: item.kategori,
        nota: item.nota
      }));
      setRows(pemasukanData);
      setTotalItems(response.data.total_items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Gagal mengambil data: ' + error.message, 'error');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, timeRange, getDateRange, pemasukanService, showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        showSnackbar('Gagal memuat total pemasukan', 'error');
      } finally {
        setIsLoadingTotal(false);
      }
    };
    fetchTotal();
  }, [getDateRange, timeRange, laporanService, showSnackbar]);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nominal') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 11) {
        showSnackbar('Nominal terlalu besar (maksimal puluhan milyar)', 'error');
        return;
      }
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
    const [datePart, timePart] = row.tanggal.split(' ');
    const [day, month, year] = datePart.split('-');
    const localDateTime = `${year}-${month}-${day}T${timePart}`;
    setEditingId(row.id);
    setFormData({
      tanggal: localDateTime,
      nominal: row.nominal.toString(),
      keterangan: row.keterangan,
      kategori: ['Pajak', 'Retribusi', 'Dana Desa', 'Bantuan'].includes(row.kategori) ? row.kategori : 'Lainnya',
      kategoriKustom: ['Pajak', 'Retribusi', 'Dana Desa', 'Bantuan'].includes(row.kategori) ? '' : row.kategori,
      nota: row.nota // URL or null
    });
    setShowModal(true);
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
      if (rows.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        await fetchData();
      }
      const { start, end } = getDateRange(timeRange);
      const total = !start || !end
        ? await laporanService.getTotalPemasukan()
        : await laporanService.getTotalPemasukanByDateRange(start, end);
      setTotalPemasukan(Number.isFinite(total) ? total : 0);
      showSnackbar('Pemasukan berhasil dihapus', 'success');
    } catch (error) {
      console.error('Error deleting data:', error);
      showSnackbar(`Gagal menghapus pemasukan: ${error.message}`, 'error');
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
        nota: formData.nota // File atau null/URL
      };

      let result;
      if (editingId) {
        result = await pemasukanService.updatePemasukan(editingId, dataToSend);
      } else {
        result = await pemasukanService.addPemasukan(dataToSend);
      }
      showSnackbar(result.message, 'success');
      setShowModal(false);
      await fetchData();
      const { start, end } = getDateRange(timeRange);
      const total = !start || !end
        ? await laporanService.getTotalPemasukan()
        : await laporanService.getTotalPemasukanByDateRange(start, end);
      setTotalPemasukan(Number.isFinite(total) ? total : 0);
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

      <PemasukanHeader
        totalPemasukan={totalPemasukan}
        isLoadingTotal={isLoadingTotal}
        handleAdd={handleAdd}
        formatCurrency={formatCurrency}
      />

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
        formatDateTime={formatDateTime}
        formatCurrency={formatCurrency}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        timeRangeOptions={timeRangeOptions}
      />

      <PemasukanFormDialog
        showModal={showModal}
        setShowModal={setShowModal}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        loading={loading}
      />

      <DeleteConfirmationDialog
        deleteDialog={deleteDialog}
        setDeleteDialog={setDeleteDialog}
        confirmDelete={confirmDelete}
        loading={loading}
      />
    </Box>
  );
}
import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, MenuItem, Accordion,
    AccordionSummary, AccordionDetails, Typography, Tabs, Tab,
    TableContainer, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { iuranService } from '@/services/iuranService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function IuranTable({ darkMode, onDelete, showSnackbar }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [value, setValue] = React.useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedIuran, setSelectedIuran] = useState([]);
    const [editMemberId, setEditMemberId] = useState(null);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        periode: '',
        minggu_ke: '',
        tanggal_bayar: '',
        status: '',
        jumlah_bayar: ''
    });

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const membersData = await iuranService.getAllMember();
                setMembers(Array.isArray(membersData) ? membersData : []);
            } catch (err) {
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const handleOpenDialog = (iuranData) => {
        setSelectedIuran(Array.isArray(iuranData) ? iuranData : []);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedIuran([]);
    };

    const handleOpenEdit = (row) => {
        setEditMemberId(row.id_member);
        setEditData({
            periode: '',
            minggu_ke: '',
            tanggal_bayar: '',
            status: '',
            jumlah_bayar: ''
        });
        setOpenEditDialog(true);
    };

    const handleSaveEdit = async () => {
        try {
            if (editData.status === 'belum' && editData.jumlah_bayar < 1000) {
                showSnackbar('Pembayaran sementara minimal Rp 1.000', 'error');
                return;
            }

            await iuranService.updateMemberIuran(editMemberId, {
                periode: value ? value.format('YYYY-MM') : '',
                minggu_ke: Number(editData.minggu_ke),
                tanggal_bayar: editData.tanggal_bayar,
                status: editData.status,
                jumlah_bayar: editData.jumlah_bayar ? Number(editData.jumlah_bayar) : 0
            });

            const membersData = await iuranService.getAllMember();
            setMembers(Array.isArray(membersData) ? membersData : []);
            setOpenEditDialog(false);
            showSnackbar('Iuran berhasil diperbarui', 'success');
        } catch (error) {
            console.error('Error update iuran:', error);
            showSnackbar('Gagal update iuran', 'error');
        }
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (row) => {
        setMemberToDelete(row);
        setOpenConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (memberToDelete) {
            try {
                await iuranService.deleteMember(memberToDelete.id_member);
                const membersData = await iuranService.getAllMember();
                setMembers(Array.isArray(membersData) ? membersData : []);
                showSnackbar('Member berhasil dihapus', 'success');
            } catch (error) {
                console.error('Error deleting member:', error);
                showSnackbar('Gagal menghapus member: ' + (error.message || 'Unknown error'), 'error');
            } finally {
                setOpenConfirmDelete(false);
                setMemberToDelete(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setOpenConfirmDelete(false);
        setMemberToDelete(null);
    };

    const groupByPeriode = (data) => {
        return data.reduce((acc, curr) => {
            if (!acc[curr.periode]) {
                acc[curr.periode] = [];
            }
            acc[curr.periode].push(curr);
            return acc;
        }, {});
    };

    const renderTableRows = (data) => (
        loading ? (
            <TableRow>
                <TableCell colSpan={5} align="center">Memuat data anggota...</TableCell>
            </TableRow>
        ) : (
            data.map((row, idx) => (
                <TableRow key={row.id_member || idx}>
                    <TableCell>{row.nra}</TableCell>
                    <TableCell>{row.nama}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell
                        sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                        onClick={() => handleOpenDialog(row.iuran)}
                    >
                        {Array.isArray(row.iuran)
                            ? `${row.iuran.length} data`
                            : '-'}
                    </TableCell>
                    <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenEdit(row)}><EditIcon /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton>
                    </TableCell>
                </TableRow>
            ))
        )
    );

    const bphMembers = members.filter(m => m.status?.toLowerCase() === 'bph');
    const regularMembers = members.filter(m => m.status?.toLowerCase() !== 'bph');

    return (
        <>
            {/* Tabs */}
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                <Tab label="BPH" />
                <Tab label="Anggota" />
            </Tabs>

            {/* Table */}
            <TableContainer component={Box} sx={{ overflowX: 'auto' }}>
                <Table sx={{ borderRadius: '12px', overflow: 'hidden', background: darkMode ? 'rgba(66,165,245,0.08)' : '#fff', minWidth: 600 }}>
                    <TableHead>
                        <TableRow sx={{ background: darkMode ? '#1976D2' : '#e3f2fd' }}>
                            <TableCell sx={{ color: darkMode ? '#fff' : '#1976D2', fontWeight: 600 }}>NRA</TableCell>
                            <TableCell sx={{ color: darkMode ? '#fff' : '#1976D2', fontWeight: 600 }}>Nama</TableCell>
                            <TableCell sx={{ color: darkMode ? '#fff' : '#1976D2', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: darkMode ? '#fff' : '#1976D2', fontWeight: 600 }}>Iuran</TableCell>
                            <TableCell sx={{ color: darkMode ? '#fff' : '#1976D2', fontWeight: 600 }}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tabValue === 0
                            ? renderTableRows(bphMembers)
                            : renderTableRows(regularMembers)}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog Detail */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Detail Iuran</DialogTitle>
                <DialogContent>
                    {selectedIuran.length > 0 ? (
                        Object.entries(groupByPeriode(selectedIuran)).map(([periode, list], idx) => (
                            <Accordion key={idx}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ fontWeight: 'bold' }}>Periode: {periode}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {list.map((i, subIdx) => (
                                        <Typography key={subIdx} sx={{ mb: 1 }}>
                                            Minggu ke-{i.minggu_ke} → <strong>{i.status}</strong>
                                        </Typography>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <p>Tidak ada data iuran</p>
                    )}
                    <Button onClick={handleCloseDialog} variant="contained" sx={{ mt: 2 }}>Tutup</Button>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit */}
            <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="sm">
                <DialogTitle>Edit Iuran</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker sx={{ mt: 1 }}
                            views={['year', 'month']}
                            label="Periode"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </LocalizationProvider>

                    <TextField label="Minggu ke" name="minggu_ke" type="number" value={editData.minggu_ke} onChange={handleChangeEdit} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Tanggal Bayar"
                            value={dayjs(editData.tanggal_bayar)}
                            onChange={(newValue) => {
                                handleChangeEdit({
                                    target: {
                                        name: 'tanggal_bayar',
                                        value: newValue ? newValue.format('YYYY-MM-DD') : ''
                                    }
                                });
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: false
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Status"
                        name="status"
                        select
                        value={editData.status}
                        onChange={handleChangeEdit}
                    >
                        <MenuItem value="lunas">Lunas</MenuItem>
                        <MenuItem value="belum">Belum Lunas</MenuItem>
                    </TextField>
                    {editData.status === 'belum' && (
                        <TextField
                            label="Pembayaran Sementara"
                            name="jumlah_bayar"
                            type="number"
                            value={editData.jumlah_bayar}
                            onChange={handleChangeEdit}
                            helperText="Minimal Rp 1.000"
                            inputProps={{ min: 0 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Batal</Button>
                    <Button variant="contained" color="primary" onClick={handleSaveEdit}>Simpan</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Confirm Delete */}
            <Dialog open={openConfirmDelete} onClose={handleCancelDelete} maxWidth="xs">
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <Typography>
                        Apakah Anda yakin ingin menghapus member <strong>{memberToDelete?.nama || 'ini'}</strong>? Aksi ini tidak dapat dibatalkan.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Batal
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, MenuItem, Accordion,
    AccordionSummary, AccordionDetails, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { iuranService } from '@/services/iuranService';

export default function IuranTable({ darkMode, onDelete }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedIuran, setSelectedIuran] = useState([]);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        periode: '',
        minggu_ke: '',
        tanggal_bayar: '',
        status: '',
        pembayaran_sementara: ''
    });

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
        // Kosongkan atau isi default
        setEditData({
            periode: '',
            minggu_ke: '',
            tanggal_bayar: '',
            status: '',
            pembayaran_sementara: ''
        });
        setOpenEditDialog(true);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
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

    return (
        <>
            <Table sx={{ borderRadius: '12px', overflow: 'hidden', background: darkMode ? 'rgba(66,165,245,0.08)' : '#fff' }}>
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
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">Memuat data anggota...</TableCell>
                        </TableRow>
                    ) : (
                        members.map((row, idx) => (
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
                                    <IconButton color="error" onClick={() => onDelete && onDelete(row)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

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
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField sx={{ mt: 1 }} label="Periode" name="periode" value={editData.periode} onChange={handleChangeEdit} />
                    <TextField label="Minggu ke" name="minggu_ke" type="number" value={editData.minggu_ke} onChange={handleChangeEdit} />
                    <TextField label="Tanggal Bayar" name="tanggal_bayar" type="date" value={editData.tanggal_bayar} onChange={handleChangeEdit} InputLabelProps={{ shrink: true }} />
                    <TextField
                        label="Status"
                        name="status"
                        select
                        value={editData.status}
                        onChange={handleChangeEdit}
                    >
                        <MenuItem value="lunas">Lunas</MenuItem>
                        <MenuItem value="belum lunas">Belum Lunas</MenuItem>
                    </TextField>
                    {editData.status === 'belum lunas' && (
                        <TextField
                            label="Pembayaran Sementara"
                            name="pembayaran_sementara"
                            type="number"
                            value={editData.pembayaran_sementara}
                            onChange={handleChangeEdit}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Batal</Button>
                    <Button variant="contained" color="primary" onClick={() => console.log('Simpan', editData)}>Simpan</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
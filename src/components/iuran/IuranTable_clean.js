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
import { useSoftUIController } from '@/context';

export default function IuranTable({ onDelete, showSnackbar }) {
    const [controller] = useSoftUIController()
    const { darkMode } = controller
    const isDarkMode = darkMode

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
                
                // Handle response validation
                if (!membersData) {
                    console.log('Data member iuran kosong');
                    setMembers([]);
                    return;
                }
                
                // Handle array validation
                if (!Array.isArray(membersData)) {
                    console.log('Format data member tidak valid');
                    setMembers([]);
                    return;
                }
                
                setMembers(membersData);
                
            } catch (err) {
                console.error('Error fetching members:', err);
                setMembers([]);
                
                // Provide user-friendly error messages
                if (!err.message.includes("can't access property") && showSnackbar) {
                    let errorMessage = 'Gagal memuat data anggota';
                    
                    if (err.message.includes('Network Error') || err.message.includes('fetch')) {
                        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
                    } else if (err.message.includes('404')) {
                        errorMessage = 'Data anggota tidak ditemukan.';
                    } else if (err.message.includes('500')) {
                        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
                    }
                    
                    showSnackbar(errorMessage, 'warning');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [showSnackbar]);

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

    const renderTableRows = (data) => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell 
                      colSpan={5} 
                      align="center"
                      sx={{ 
                        py: 4,
                        color: isDarkMode ? '#90caf9' : '#1976d2'
                      }}
                    >
                      <Box 
                        sx={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isDarkMode 
                            ? 'conic-gradient(from 0deg, #64b5f6, #90caf9, #42a5f5, #64b5f6)'
                            : 'conic-gradient(from 0deg, #1976d2, #42a5f5, #2196f3, #1976d2)',
                          animation: 'spin 2s linear infinite',
                          margin: '0 auto 8px',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                      Memuat data anggota...
                    </TableCell>
                </TableRow>
            );
        }
        
        if (data.length === 0) {
            return (
                <TableRow>
                    <TableCell 
                      colSpan={5} 
                      align="center" 
                      sx={{ 
                        py: 4, 
                        color: isDarkMode ? '#b0b0b0' : '#666666'
                      }}
                    >
                        Belum ada data anggota yang tersimpan
                    </TableCell>
                </TableRow>
            );
        }
        
        return data.map((row, idx) => (
            <TableRow 
              key={row.id_member || idx}
              sx={{
                backgroundColor: idx % 2 === 0 
                  ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)')
                  : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(248, 249, 250, 0.8)'),
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(100, 181, 246, 0.1)' 
                    : 'rgba(25, 118, 210, 0.05)',
                }
              }}
            >
                <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  {row.nra}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  {row.nama}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  {row.status}
                </TableCell>
                <TableCell
                    sx={{ 
                      cursor: 'pointer', 
                      color: isDarkMode ? '#90caf9' : '#1976d2', 
                      textDecoration: 'underline',
                      '&:hover': {
                        color: isDarkMode ? '#64b5f6' : '#0d47a1'
                      }
                    }}
                    onClick={() => handleOpenDialog(row.iuran)}
                >
                    {Array.isArray(row.iuran)
                        ? `${row.iuran.length} data`
                        : '-'}
                </TableCell>
                <TableCell>
                    <IconButton 
                      sx={{ color: isDarkMode ? '#90caf9' : '#1976d2' }} 
                      onClick={() => handleOpenEdit(row)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ color: isDarkMode ? '#e57373' : '#d32f2f' }} 
                      onClick={() => handleDelete(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        ));
    };

    const bphMembers = members.filter(m => m.status?.toLowerCase() === 'bph');
    const regularMembers = members.filter(m => m.status?.toLowerCase() !== 'bph');

    return (
        <>
            {/* Tabs */}
            <Tabs 
              value={tabValue} 
              onChange={(e, newValue) => setTabValue(newValue)} 
              sx={{ 
                mb: 2,
                '& .MuiTab-root': {
                  color: isDarkMode ? '#b0b0b0' : '#666666',
                  '&.Mui-selected': {
                    color: isDarkMode ? '#90caf9' : '#1976d2'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: isDarkMode ? '#90caf9' : '#1976d2'
                }
              }}
            >
                <Tab label="BPH" />
                <Tab label="Anggota" />
            </Tabs>

            {/* Table */}
            <TableContainer 
              component={Box} 
              sx={{ 
                overflowX: 'auto',
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
              }}
            >
                <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                        <TableRow sx={{ 
                          background: isDarkMode 
                            ? 'rgba(100, 181, 246, 0.1)' 
                            : 'rgba(25, 118, 210, 0.05)',
                        }}>
                            <TableCell sx={{ 
                              color: isDarkMode ? '#90caf9' : '#1976d2', 
                              fontWeight: 600 
                            }}>
                              NRA
                            </TableCell>
                            <TableCell sx={{ 
                              color: isDarkMode ? '#90caf9' : '#1976d2', 
                              fontWeight: 600 
                            }}>
                              Nama
                            </TableCell>
                            <TableCell sx={{ 
                              color: isDarkMode ? '#90caf9' : '#1976d2', 
                              fontWeight: 600 
                            }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ 
                              color: isDarkMode ? '#90caf9' : '#1976d2', 
                              fontWeight: 600 
                            }}>
                              Iuran
                            </TableCell>
                            <TableCell sx={{ 
                              color: isDarkMode ? '#90caf9' : '#1976d2', 
                              fontWeight: 600 
                            }}>
                              Aksi
                            </TableCell>
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
            <Dialog 
              open={openDialog} 
              onClose={handleCloseDialog} 
              fullWidth 
              maxWidth="sm"
              PaperProps={{
                sx: {
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(40, 40, 40, 0.95) 0%, rgba(60, 60, 60, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                }
              }}
            >
                <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  Detail Iuran
                </DialogTitle>
                <DialogContent>
                    {selectedIuran.length > 0 ? (
                        Object.entries(groupByPeriode(selectedIuran)).map(([periode, list], idx) => (
                            <Accordion 
                              key={idx}
                              sx={{
                                background: isDarkMode 
                                  ? 'rgba(100, 181, 246, 0.1)'
                                  : 'rgba(25, 118, 210, 0.05)',
                                '&:before': {
                                  display: 'none',
                                },
                                mb: 1
                              }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ 
                                      fontWeight: 'bold',
                                      color: isDarkMode ? '#90caf9' : '#1976d2'
                                    }}>
                                      Periode: {periode}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {list.map((i, subIdx) => (
                                        <Typography 
                                          key={subIdx} 
                                          sx={{ 
                                            mb: 1,
                                            color: isDarkMode ? '#ffffff' : '#000000'
                                          }}
                                        >
                                            Minggu ke-{i.minggu_ke} → <strong>{i.status}</strong>
                                        </Typography>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <Typography sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                          Tidak ada data iuran
                        </Typography>
                    )}
                    <Button 
                      onClick={handleCloseDialog} 
                      variant="contained" 
                      sx={{ 
                        mt: 2,
                        background: isDarkMode 
                          ? 'linear-gradient(45deg, #64b5f6, #90caf9)'
                          : 'linear-gradient(45deg, #1976d2, #42a5f5)'
                      }}
                    >
                      Tutup
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Dialog Edit */}
            <Dialog 
              open={openEditDialog} 
              onClose={handleCloseEdit} 
              fullWidth 
              maxWidth="sm"
              PaperProps={{
                sx: {
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(40, 40, 40, 0.95) 0%, rgba(60, 60, 60, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                }
              }}
            >
                <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  Edit Iuran
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker sx={{ 
                          mt: 1,
                          '& .MuiOutlinedInput-root': {
                            color: isDarkMode ? '#ffffff' : '#000000',
                            '& fieldset': {
                              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDarkMode ? '#b0b0b0' : '#666',
                            '&.Mui-focused': {
                              color: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                          },
                        }}
                            views={['year', 'month']}
                            label="Periode"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </LocalizationProvider>

                    <TextField 
                      label="Minggu ke" 
                      name="minggu_ke" 
                      type="number" 
                      value={editData.minggu_ke} 
                      onChange={handleChangeEdit}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: isDarkMode ? '#ffffff' : '#000000',
                          '& fieldset': {
                            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: isDarkMode ? '#b0b0b0' : '#666',
                          '&.Mui-focused': {
                            color: isDarkMode ? '#90caf9' : '#1976d2',
                          },
                        },
                      }}
                    />
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
                                    error: false,
                                    sx: {
                                      '& .MuiOutlinedInput-root': {
                                        color: isDarkMode ? '#ffffff' : '#000000',
                                        '& fieldset': {
                                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                                        },
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: isDarkMode ? '#b0b0b0' : '#666',
                                        '&.Mui-focused': {
                                          color: isDarkMode ? '#90caf9' : '#1976d2',
                                        },
                                      },
                                    }
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: isDarkMode ? '#ffffff' : '#000000',
                            '& fieldset': {
                              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: isDarkMode ? '#b0b0b0' : '#666',
                            '&.Mui-focused': {
                              color: isDarkMode ? '#90caf9' : '#1976d2',
                            },
                          },
                        }}
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
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: isDarkMode ? '#ffffff' : '#000000',
                                '& fieldset': {
                                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover fieldset': {
                                  borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: isDarkMode ? '#90caf9' : '#1976d2',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: isDarkMode ? '#b0b0b0' : '#666',
                                '&.Mui-focused': {
                                  color: isDarkMode ? '#90caf9' : '#1976d2',
                                },
                              },
                              '& .MuiFormHelperText-root': {
                                color: isDarkMode ? '#b0b0b0' : '#666',
                              },
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                      onClick={handleCloseEdit}
                      sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}
                    >
                      Batal
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={handleSaveEdit}
                      sx={{
                        background: isDarkMode 
                          ? 'linear-gradient(45deg, #64b5f6, #90caf9)'
                          : 'linear-gradient(45deg, #1976d2, #42a5f5)'
                      }}
                    >
                      Simpan
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Confirm Delete */}
            <Dialog 
              open={openConfirmDelete} 
              onClose={handleCancelDelete} 
              maxWidth="xs"
              PaperProps={{
                sx: {
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(40, 40, 40, 0.95) 0%, rgba(60, 60, 60, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                }
              }}
            >
                <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                  Konfirmasi Hapus
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                        Apakah Anda yakin ingin menghapus member <strong>{memberToDelete?.nama || 'ini'}</strong>? Aksi ini tidak dapat dibatalkan.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                      onClick={handleCancelDelete} 
                      sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}
                    >
                        Batal
                    </Button>
                    <Button 
                      onClick={handleConfirmDelete} 
                      variant="contained"
                      sx={{
                        background: isDarkMode 
                          ? 'linear-gradient(45deg, #e57373, #ef5350)'
                          : 'linear-gradient(45deg, #d32f2f, #f44336)'
                      }}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

'use client'
import React, { useState } from 'react';
import {
    Box,
    Paper,
    Tabs,
    Tab,
    Snackbar,
    Slide,
    Alert,
    IconButton
} from '@mui/material';
import { IuranTable, IuranHeader } from '@/components/iuran'
import CloseIcon from '@mui/icons-material/Close';

const dummyBPH = [
    { nama: 'Budi', status: 'BPH', lunas: true, jumlah: 10000 },
    { nama: 'Siti', status: 'BPH', lunas: false, jumlah: 5000 },
];
const dummyAnggota = [
    { nama: 'Rina', status: 'Anggota', lunas: true, jumlah: 10000 },
    { nama: 'Joko', status: 'Anggota', lunas: false, jumlah: 7000 },
];

export default function IuranPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [totalIuran, setTotalIuran] = useState(0)
    const [isLoadingTotal, setIsLoadingTotal] = useState(true)

    // Simulate loading total iuran from dummy data
    React.useEffect(() => {
        // Hitung total dari dummy data
        const total = [...dummyBPH, ...dummyAnggota].reduce((sum, item) => sum + (item.jumlah || 0), 0);
        setTotalIuran(total);
        setIsLoadingTotal(false);
    }, []);

    // Snackbar helpers
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Currency formatter
    const formatCurrency = (amount) => {
        const validAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(validAmount);
    };

    return (
        <Box sx={{
            padding: '24px',
            mt: { xs: '64px', sm: '80px' },
            minHeight: '100vh',
            bgcolor: darkMode ? '#121212' : '#F8F9FA',
            color: darkMode ? '#fff' : 'inherit',
            transition: 'background 0.3s'
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

            <IuranHeader
                totalIuran={totalIuran}
                isLoadingTotal={isLoadingTotal}
                formatCurrency={formatCurrency}
                showSnackbar={showSnackbar}
            />

            <Paper elevation={3} sx={{
                borderRadius: '16px',
                p: { xs: 2, sm: 4 },
                mb: 4,
                boxShadow: darkMode ? '0 4px 20px 0 rgba(66,165,245,0.15)' : '0 4px 20px 0 rgba(0,0,0,0.08)',
                background: darkMode ? 'rgba(66,165,245,0.08)' : '#fff',
                transition: 'background 0.3s'
            }}>
                <Box>
                    <IuranTable
                        rows={dummyBPH}
                        darkMode={darkMode}
                        formatCurrency={formatCurrency}
                        onEdit={null}
                        onDelete={null}
                        showSnackbar={showSnackbar}
                    />
                </Box>
            </Paper>
        </Box>
    );
}

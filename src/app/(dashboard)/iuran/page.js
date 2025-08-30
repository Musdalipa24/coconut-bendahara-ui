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
    IconButton,
    Container,
    Typography,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { IuranTable, IuranHeader } from '@/components/iuran'
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
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

export default function IuranPage() {
    const [controller] = useSoftUIController()
    const { darkMode } = controller
    const isDarkMode = darkMode
    
    const customTheme = createCustomTheme(isDarkMode)
    
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [totalIuran, setTotalIuran] = useState(0)
    const [isLoadingTotal, setIsLoadingTotal] = useState(false)

    // Initialize empty state
    React.useEffect(() => {
        setTotalIuran(0);
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
                            Iuran Anggota
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

            {/* Animasi Fade In untuk Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <IuranHeader
                            totalIuran={totalIuran}
                            isLoadingTotal={isLoadingTotal}
                            formatCurrency={formatCurrency}
                            showSnackbar={showSnackbar}
                        />
                    </motion.div>

                    {/* Animasi Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper elevation={3} sx={{
                            borderRadius: '16px',
                            p: { xs: 2, sm: 4 },
                            mb: 4,
                            boxShadow: isDarkMode ? '0 4px 20px 0 rgba(66,165,245,0.15)' : '0 4px 20px 0 rgba(0,0,0,0.08)',
                            background: isDarkMode ? 'rgba(66,165,245,0.08)' : '#fff',
                            transition: 'background 0.3s'
                        }}>
                            <Box>
                                <IuranTable
                                    darkMode={isDarkMode}
                                    formatCurrency={formatCurrency}
                                    onEdit={null}
                                    onDelete={null}
                                    showSnackbar={showSnackbar}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

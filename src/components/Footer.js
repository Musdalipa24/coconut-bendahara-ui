'use client'
import { Box, Container, Grid, Typography, Link } from '@mui/material'

export default function DashboardFooter({ darkMode }) {
    return (
        <Box component="footer"
            sx={{
                py: 4,
                px: 3,
                mt: 'auto',
                background: darkMode 
                    ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(60, 60, 60, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                border: darkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                borderBottom: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                boxShadow: darkMode 
                    ? '0 -8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 -8px 32px rgba(0, 0, 0, 0.1)',
                borderRadius: '20px 20px 0 0',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: darkMode
                        ? 'radial-gradient(circle at 50% 0%, rgba(100, 181, 246, 0.05) 0%, transparent 70%)'
                        : 'radial-gradient(circle at 50% 0%, rgba(25, 118, 210, 0.03) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            flexWrap: 'wrap',
                            p: 2,
                            borderRadius: '12px',
                            background: darkMode 
                                ? 'rgba(100, 181, 246, 0.1)' 
                                : 'rgba(25, 118, 210, 0.05)',
                            border: darkMode 
                                ? '1px solid rgba(144, 202, 249, 0.2)' 
                                : '1px solid rgba(25, 118, 210, 0.1)',
                        }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: darkMode ? '#90caf9' : '#1976d2',
                                    fontWeight: 500,
                                }}
                            >
                                © {new Date().getFullYear()} Sistem Informasi Bendahara
                            </Typography>
                            <Link
                                href="https://coconut.or.id"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ 
                                        fontWeight: 700, 
                                        background: darkMode 
                                            ? 'linear-gradient(45deg, #64b5f6, #90caf9)'
                                            : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            transform: 'scale(1.05)',
                                            filter: 'brightness(1.2)',
                                        } 
                                    }}
                                >
                                    COCONUT Computer Club
                                </Typography>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: { xs: 'flex-start', sm: 'flex-end' }, 
                            gap: 3, 
                            flexWrap: 'wrap',
                            p: 2,
                            borderRadius: '12px',
                            background: darkMode 
                                ? 'rgba(100, 181, 246, 0.1)' 
                                : 'rgba(25, 118, 210, 0.05)',
                            border: darkMode 
                                ? '1px solid rgba(144, 202, 249, 0.2)' 
                                : '1px solid rgba(25, 118, 210, 0.1)',
                        }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: darkMode ? '#90caf9' : '#1976d2',
                                    fontWeight: 600,
                                }}
                            >
                                Versi 1.0.0
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                p: 1,
                                borderRadius: '8px',
                                background: darkMode 
                                    ? 'rgba(244, 143, 177, 0.1)' 
                                    : 'rgba(220, 0, 78, 0.05)',
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: darkMode ? '#f48fb1' : '#dc004e',
                                        fontWeight: 600,
                                    }}
                                >
                                    Crafted with 💙 by hacklab
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
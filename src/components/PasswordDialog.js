'use client'
import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Lock as LockIcon, VpnKey as KeyIcon, Security as SecurityIcon } from '@mui/icons-material'
import { useSoftUIController } from '@/context'
import { authService } from '@/services/authService'

export default function PasswordDialog({ open, setOpen }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert(null)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlert({ severity: 'error', message: 'Semua field wajib diisi.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setAlert({ severity: 'error', message: 'Konfirmasi password tidak cocok.' })
      return
    }

    setLoading(true)

    try {
      const result = await authService.updatePassword(oldPassword, newPassword)

      if (result.success) {
        setAlert({ severity: 'success', message: result.message || 'Password berhasil diperbarui.' })
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        // Tutup pop-up otomatis setelah 1 detik
        setTimeout(() => setOpen(false), 1000)
      } else {
        setAlert({ severity: 'error', message: result.error || 'Gagal memperbarui password.' })
      }
    } catch (error) {
      setAlert({ severity: 'error', message: 'Terjadi kesalahan server.' })
    }

    setLoading(false)
  }

  return (
    <Dialog 
      open={open} 
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.18)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          boxShadow: isDarkMode
            ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 50px rgba(76, 175, 80, 0.1)'
            : '0 25px 50px rgba(0, 0, 0, 0.1), 0 0 50px rgba(76, 175, 80, 0.05)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        pb: 2,
        pt: 3,
        px: 3,
        borderBottom: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(69, 160, 73, 0.4) 50%, rgba(102, 187, 106, 0.3) 100%)'
          : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(69, 160, 73, 0.15) 50%, rgba(102, 187, 106, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        color: isDarkMode ? '#81c784' : '#2e7d32',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textShadow: isDarkMode 
          ? '0 2px 10px rgba(129, 199, 132, 0.3)' 
          : '0 2px 10px rgba(46, 125, 50, 0.2)',
        '& .MuiTypography-root': {
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }
      }}>
        <LockIcon sx={{ fontSize: 28 }} />
        Ganti Password
      </DialogTitle>
      <DialogContent sx={{
        p: 3,
        background: isDarkMode
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(255, 255, 255, 0.3)',
        borderTop: 'none',
        borderBottom: 'none'
      }}>
        {alert && (
          <Alert 
            severity={alert.severity} 
            sx={{ 
              mb: 3,
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.12) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              '& .MuiAlert-message': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                fontWeight: 500
              }
            }}
          >
            {alert.message}
          </Alert>
        )}
        
        <Box sx={{ 
          mb: 3,
          p: 3,
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(69, 160, 73, 0.12) 100%)'
            : 'linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(69, 160, 73, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: isDarkMode 
            ? '1px solid rgba(129, 199, 132, 0.2)'
            : '1px solid rgba(46, 125, 50, 0.1)',
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(129, 199, 132, 0.1)'
            : '0 8px 32px rgba(46, 125, 50, 0.05)'
        }}>
          <Typography variant="subtitle1" sx={{ 
            mb: 2, 
            fontWeight: 600, 
            color: isDarkMode ? '#81c784' : '#2e7d32',
            textShadow: isDarkMode 
              ? '0 2px 8px rgba(129, 199, 132, 0.3)' 
              : '0 2px 8px rgba(46, 125, 50, 0.2)',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SecurityIcon sx={{ fontSize: 24 }} />
            Keamanan Password
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Password Lama"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              mb: 3,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  textShadow: isDarkMode 
                    ? '0 0 10px rgba(129, 199, 132, 0.3)' 
                    : '0 0 8px rgba(46, 125, 50, 0.2)'
                }
              },
              '& .MuiOutlinedInput-root': {
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: isDarkMode
                    ? '0 8px 25px rgba(129, 199, 132, 0.15)'
                    : '0 8px 25px rgba(46, 125, 50, 0.1)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                  border: isDarkMode 
                    ? '1px solid rgba(129, 199, 132, 0.3)'
                    : '1px solid rgba(46, 125, 50, 0.2)'
                },
                '&.Mui-focused': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 12px 35px rgba(129, 199, 132, 0.25)'
                    : '0 12px 35px rgba(46, 125, 50, 0.15)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  border: isDarkMode 
                    ? '2px solid rgba(129, 199, 132, 0.5)'
                    : '2px solid rgba(46, 125, 50, 0.3)'
                },
                '& input': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }
              }
            }}
          />
          <TextField
            label="Password Baru"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              mb: 3,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  textShadow: isDarkMode 
                    ? '0 0 10px rgba(129, 199, 132, 0.3)' 
                    : '0 0 8px rgba(46, 125, 50, 0.2)'
                }
              },
              '& .MuiOutlinedInput-root': {
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: isDarkMode
                    ? '0 8px 25px rgba(129, 199, 132, 0.15)'
                    : '0 8px 25px rgba(46, 125, 50, 0.1)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                  border: isDarkMode 
                    ? '1px solid rgba(129, 199, 132, 0.3)'
                    : '1px solid rgba(46, 125, 50, 0.2)'
                },
                '&.Mui-focused': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 12px 35px rgba(129, 199, 132, 0.25)'
                    : '0 12px 35px rgba(46, 125, 50, 0.15)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  border: isDarkMode 
                    ? '2px solid rgba(129, 199, 132, 0.5)'
                    : '2px solid rgba(46, 125, 50, 0.3)'
                },
                '& input': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }
              }
            }}
          />
          <TextField
            label="Konfirmasi Password Baru"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              mb: 3,
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&.Mui-focused': {
                  color: isDarkMode ? '#81c784' : '#2e7d32',
                  textShadow: isDarkMode 
                    ? '0 0 10px rgba(129, 199, 132, 0.3)' 
                    : '0 0 8px rgba(46, 125, 50, 0.2)'
                }
              },
              '& .MuiOutlinedInput-root': {
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: isDarkMode
                    ? '0 8px 25px rgba(129, 199, 132, 0.15)'
                    : '0 8px 25px rgba(46, 125, 50, 0.1)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
                  border: isDarkMode 
                    ? '1px solid rgba(129, 199, 132, 0.3)'
                    : '1px solid rgba(46, 125, 50, 0.2)'
                },
                '&.Mui-focused': {
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 12px 35px rgba(129, 199, 132, 0.25)'
                    : '0 12px 35px rgba(46, 125, 50, 0.15)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  border: isDarkMode 
                    ? '2px solid rgba(129, 199, 132, 0.5)'
                    : '2px solid rgba(46, 125, 50, 0.3)'
                },
                '& input': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }
              }
            }}
          />
          <DialogActions sx={{
            px: 4,
            py: 3,
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            borderTop: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            gap: 2
          }}>
            <Button 
              onClick={() => setOpen(false)} 
              disabled={loading}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 1) 100%)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.3)'
                    : '1px solid rgba(0, 0, 0, 0.2)',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  transform: 'translateY(-1px)',
                  boxShadow: isDarkMode
                    ? '0 4px 20px rgba(255, 255, 255, 0.1)'
                    : '0 4px 20px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                background: isDarkMode
                  ? 'linear-gradient(135deg, #81c784 0%, #4caf50 50%, #66bb6a 100%)'
                  : 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 50%, #388e3c 100%)',
                boxShadow: isDarkMode
                  ? '0 8px 25px rgba(129, 199, 132, 0.4)'
                  : '0 8px 25px rgba(46, 125, 50, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: 1,
                '&:hover': {
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #66bb6a 0%, #4caf50 50%, #81c784 100%)'
                    : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: isDarkMode
                    ? '0 12px 35px rgba(129, 199, 132, 0.5)'
                    : '0 12px 35px rgba(46, 125, 50, 0.4)'
                },
                '&:disabled': {
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.12)' 
                    : 'rgba(0, 0, 0, 0.12)',
                  color: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : 'rgba(0, 0, 0, 0.26)',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? (
                <>
                  <KeyIcon sx={{ fontSize: 20 }} />
                  Loading...
                </>
              ) : (
                <>
                  <KeyIcon sx={{ fontSize: 20 }} />
                  Simpan
                </>
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
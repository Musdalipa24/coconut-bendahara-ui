'use client'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material'
import { useState } from 'react'
import { authService } from '@/services/authService'
import { useSoftUIController } from '@/context'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'

export default function LoginDialog({ open, setOpen }) {
  const [controller] = useSoftUIController()
  const { darkMode } = controller
  const isDarkMode = darkMode
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await authService.login(username, password)
    if (result.success) {
      setLoggedIn(true)
      setOpen(false)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (!loggedIn) return // blokir close jika belum login
        setOpen(false)
      }}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(45, 45, 45, 0.95) 50%, rgba(25, 25, 25, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(241, 245, 249, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode
              ? 'linear-gradient(45deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)'
              : 'linear-gradient(45deg, rgba(25, 118, 210, 0.05) 0%, rgba(21, 101, 192, 0.02) 100%)',
            pointerEvents: 'none',
            zIndex: -1
          }
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.3) 0%, rgba(21, 101, 192, 0.4) 50%, rgba(30, 136, 229, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.15) 50%, rgba(30, 136, 229, 0.1) 100%)',
          color: isDarkMode ? '#64b5f6' : '#1565c0',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          backdropFilter: 'blur(10px)',
          borderBottom: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          textShadow: isDarkMode 
            ? '0 2px 10px rgba(100, 181, 246, 0.3)' 
            : '0 2px 10px rgba(21, 101, 192, 0.2)',
          fontSize: '1.5rem',
          letterSpacing: '0.5px'
        }}
      >
        Login
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.25) 100%)'
                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode 
                ? '1px solid rgba(244, 67, 54, 0.3)'
                : '1px solid rgba(244, 67, 54, 0.2)',
              color: isDarkMode ? '#ffcdd2' : '#c62828',
              '& .MuiAlert-icon': {
                color: isDarkMode ? '#e57373' : '#d32f2f'
              }
            }}
          >
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
            <PersonIcon sx={{ 
              color: isDarkMode ? '#90caf9' : '#1976d2', 
              mr: 2,
              fontSize: '1.5rem'
            }} />
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  '& fieldset': {
                    border: 'none'
                  },
                  '&:hover': {
                    background: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    background: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: isDarkMode
                      ? '0 0 0 2px rgba(100, 181, 246, 0.3)'
                      : '0 0 0 2px rgba(25, 118, 210, 0.2)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#b0bec5' : '#546e7a',
                  '&.Mui-focused': {
                    color: isDarkMode ? '#64b5f6' : '#1976d2'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#ffffff' : '#212121'
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LockIcon sx={{ 
              color: isDarkMode ? '#90caf9' : '#1976d2', 
              mr: 2,
              fontSize: '1.5rem'
            }} />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  '& fieldset': {
                    border: 'none'
                  },
                  '&:hover': {
                    background: isDarkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    background: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 1)',
                    boxShadow: isDarkMode
                      ? '0 0 0 2px rgba(100, 181, 246, 0.3)'
                      : '0 0 0 2px rgba(25, 118, 210, 0.2)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#b0bec5' : '#546e7a',
                  '&.Mui-focused': {
                    color: isDarkMode ? '#64b5f6' : '#1976d2'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  color: isDarkMode ? '#ffffff' : '#212121'
                }
              }}
            />
          </Box>
          <DialogActions sx={{ px: 0, pb: 2 }}>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              sx={{
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(21, 101, 192, 0.9) 50%, rgba(30, 136, 229, 0.8) 100%)'
                  : 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 1) 50%, rgba(30, 136, 229, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(25, 118, 210, 0.3)'
                  : '1px solid rgba(25, 118, 210, 0.2)',
                boxShadow: isDarkMode
                  ? '0 4px 16px rgba(25, 118, 210, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 4px 16px rgba(25, 118, 210, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.9) 0%, rgba(21, 101, 192, 1) 50%, rgba(30, 136, 229, 0.9) 100%)'
                    : 'linear-gradient(135deg, rgba(25, 118, 210, 1) 0%, rgba(21, 101, 192, 1.1) 50%, rgba(30, 136, 229, 1) 100%)',
                  boxShadow: isDarkMode
                    ? '0 6px 20px rgba(25, 118, 210, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    : '0 6px 20px rgba(25, 118, 210, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                },
                '&:disabled': {
                  background: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}